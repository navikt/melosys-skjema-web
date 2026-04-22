import { ClientRequest } from "node:http";

import { getToken, requestOboToken } from "@navikt/oasis";
import { NextFunction, Request, Response, Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import logger from "./logger.js";
import { requireEnvironment } from "./utils.js";

const useLocalToken = process.env.USE_LOCAL_TOKEN === "true";

// Hvis satt, brukes tokenet direkte (Q2-modus med ekte miljø-token).
// Ellers vekslet token per innlogget bruker via mock-oauth2-server.
function getStaticLocalToken(): string | null {
  return process.env.LOCAL_TOKEN ?? null;
}

const REFRESH_SLACK_MS = 60_000;

type UserClaims = { pid: string; name?: string };
type CachedToken = { token: string; expiresAt: number };

const tokenCachePerPid = new Map<string, CachedToken>();

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readUserClaims(userToken: string): UserClaims | null {
  const payload = decodeJwtPayload(userToken);
  if (!payload) return null;
  const pid =
    typeof payload.pid === "string"
      ? payload.pid
      : typeof payload.sub === "string"
        ? payload.sub
        : null;
  if (!pid) return null;
  const name = typeof payload.name === "string" ? payload.name : undefined;
  return { pid, name };
}

async function exchangeLocalToken(pid: string): Promise<string | null> {
  const now = Date.now();
  const cached = tokenCachePerPid.get(pid);
  if (cached && cached.expiresAt > now + REFRESH_SLACK_MS) {
    return cached.token;
  }

  const endpoint = requireEnvironment("LOCAL_TOKEN_ENDPOINT");
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.LOCAL_TOKEN_CLIENT_ID ?? "some-consumer",
    client_secret: process.env.LOCAL_TOKEN_CLIENT_SECRET ?? "secret",
    audience: process.env.LOCAL_TOKEN_AUDIENCE ?? "melosys-skjema-api",
    pid,
    expiry: process.env.LOCAL_TOKEN_EXPIRY ?? "3600",
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!response.ok) {
      logger.error(
        `Kunne ikke veksle lokal token for pid=${pid} (HTTP ${response.status})`,
        new Error(await response.text()),
      );
      return null;
    }
    const data = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };
    tokenCachePerPid.set(pid, {
      token: data.access_token,
      expiresAt: now + data.expires_in * 1000,
    });
    logger.debug(
      `Vekslet lokal token for pid=${pid} (utløper om ${data.expires_in}s)`,
    );
    return data.access_token;
  } catch (error) {
    logger.error(
      `Feil ved veksling av lokal token for pid=${pid}`,
      error instanceof Error ? error : new Error(String(error)),
    );
    return null;
  }
}

type ProxyOptions = {
  ingoingUrl: string;
  outgoingUrl: string;
  scope: string;
};

type SimpleProxyOptions = {
  ingoingUrl: string;
  outgoingUrl: string;
};

export const setupApiProxy = (router: Router) => {
  if (useLocalToken) {
    addProxyWithLocalToken(router, {
      ingoingUrl: "/api",
      outgoingUrl: requireEnvironment("API_URL"),
    });
  } else {
    addProxyWithOboExchangeHandler(router, {
      ingoingUrl: "/api",
      outgoingUrl: requireEnvironment("API_URL"),
      scope: requireEnvironment("API_SCOPE"),
    });
  }
};

export const setupDekoratorenApiProxy = (router: Router) => {
  if (useLocalToken) {
    router.get("/nav-dekoratoren-api/auth", (request, response) => {
      const token = getStaticLocalToken() ?? getToken(request);
      const claims = token ? readUserClaims(token) : null;
      if (!claims) {
        response.json({ authenticated: false });
        return;
      }
      const name = claims.name ?? `Bruker ${claims.pid}`;
      response.json({
        authenticated: true,
        name,
        securityLevel: "4",
        userId: claims.pid,
        ident: claims.pid,
      });
    });
  } else {
    addSimpleProxyHandler(router, {
      ingoingUrl: "/nav-dekoratoren-api",
      outgoingUrl: requireEnvironment("DEKORATOREN_API_URL"),
    });
  }
};

function addProxyWithOboExchangeHandler(
  router: Router,
  { ingoingUrl, outgoingUrl, scope }: ProxyOptions,
) {
  router.use(
    ingoingUrl,
    async (request: Request, response: Response, next: NextFunction) => {
      logger.debug(`Inngående request url ${ingoingUrl}`);
      logger.debug(`Utgående request url ${outgoingUrl}`);
      exchangeOboTokenAndStoreInHeader(request, response, next, scope);
    },
    createProxyMiddleware({
      target: outgoingUrl,
      changeOrigin: true,
      logger: logger,
      on: {
        proxyReq: (proxyRequest, request) =>
          addOboTokenToProxyRequest(proxyRequest, request, scope),
      },
    }),
  );
}

async function exchangeOboTokenAndStoreInHeader(
  request: Request,
  response: Response,
  next: NextFunction,
  scope: string,
) {
  const token = getToken(request);
  if (!token) {
    response.status(401).send();
    return;
  }
  const obo = await requestOboToken(token, scope);
  if (obo.ok) {
    request.headers["obo-token"] = obo.token;
    logger.debug("OBO-veksling vellykket");
    return next();
  } else {
    logger.error("OBO-veksling feilet", obo.error);
    response.status(403).send();
    return;
  }
}

function addOboTokenToProxyRequest(
  proxyRequest: ClientRequest,
  requestWithOboToken: Request,
  scope: string,
) {
  const obo = requestWithOboToken.headers["obo-token"];
  if (obo) {
    proxyRequest.removeHeader("obo-token");
    proxyRequest.removeHeader("cookie");
    proxyRequest.setHeader("Authorization", `Bearer ${obo}`);
    logger.debug("OBO-token lagt til i proxy-request");
  } else {
    logger.warning(
      `Access token was not present in session for scope ${scope}`,
    );
  }
}

export function addSimpleProxyHandler(
  router: Router,
  { ingoingUrl, outgoingUrl }: SimpleProxyOptions,
) {
  router.use(
    ingoingUrl,
    createProxyMiddleware({
      target: outgoingUrl,
      changeOrigin: true,
      logger: logger,
    }),
  );
}

function addProxyWithLocalToken(
  router: Router,
  { ingoingUrl, outgoingUrl }: SimpleProxyOptions,
) {
  router.use(
    ingoingUrl,
    async (request: Request, response: Response, next: NextFunction) => {
      const staticToken = getStaticLocalToken();
      if (staticToken) {
        request.headers["x-local-token"] = staticToken;
        return next();
      }
      const userToken = getToken(request);
      if (!userToken) {
        response.status(401).send({ error: "Ikke innlogget" });
        return;
      }
      const claims = readUserClaims(userToken);
      if (!claims) {
        response.status(401).send({ error: "Kunne ikke lese brukerclaims" });
        return;
      }
      const apiToken = await exchangeLocalToken(claims.pid);
      if (!apiToken) {
        response
          .status(500)
          .send({ error: "Kunne ikke veksle token mot mock-oauth2" });
        return;
      }
      request.headers["x-local-token"] = apiToken;
      next();
    },
    createProxyMiddleware({
      target: outgoingUrl,
      changeOrigin: true,
      logger: logger,
      on: {
        proxyReq: (proxyRequest, request) => {
          const token = request.headers["x-local-token"];
          if (typeof token === "string" && token.length > 0) {
            proxyRequest.removeHeader("cookie");
            proxyRequest.removeHeader("x-local-token");
            proxyRequest.setHeader("Authorization", `Bearer ${token}`);
          }
        },
      },
    }),
  );
}
