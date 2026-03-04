import { NextFunction, Request, Response, Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import logger from "./logger.js";
import { requireEnvironment } from "./utils.js";

const mockOAuthTokenUrl = process.env.MOCK_OAUTH_TOKEN_URL;
const mockOAuthClientId =
  process.env.MOCK_OAUTH_CLIENT_ID || "melosys-skjema-web";
const mockOAuthAudience =
  process.env.MOCK_OAUTH_AUDIENCE || "melosys-skjema-api";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function fetchMockOAuthToken(): Promise<string | null> {
  if (!mockOAuthTokenUrl) return null;

  if (cachedToken && Date.now() < cachedToken.expiresAt - 10_000) {
    return cachedToken.token;
  }

  try {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: mockOAuthClientId,
      client_secret: "not-used",
      audience: mockOAuthAudience,
    });

    const response = await fetch(mockOAuthTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      logger.error(
        `Failed to fetch mock OAuth token: ${response.status} ${response.statusText}`,
        new Error(`HTTP ${response.status}`),
      );
      return null;
    }

    const data = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    logger.info(`Fetched mock OAuth token (expires in ${data.expires_in}s)`);
    return cachedToken.token;
  } catch (error) {
    logger.error(
      "Error fetching mock OAuth token",
      error instanceof Error ? error : new Error(String(error)),
    );
    return null;
  }
}

async function getLocalToken(): Promise<string | null> {
  if (process.env.LOCAL_TOKEN) {
    return process.env.LOCAL_TOKEN;
  }
  return fetchMockOAuthToken();
}

export function setupLocalProxy(router: Router) {
  const apiUrl = requireEnvironment("API_URL");

  router.use(
    "/api",
    async (req: Request, _res: Response, next: NextFunction) => {
      const token = await getLocalToken();
      if (token) {
        req.headers["local-token"] = token;
      } else {
        logger.warning("No local token available");
      }
      next();
    },
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      logger: logger,
      on: {
        proxyReq: (proxyRequest, request) => {
          const token = (request as Request).headers["local-token"] as
            | string
            | undefined;
          if (token) {
            proxyRequest.removeHeader("local-token");
            proxyRequest.removeHeader("cookie");
            proxyRequest.setHeader("Authorization", `Bearer ${token}`);
            logger.debug("Local token added to proxy request");
          }
        },
      },
    }),
  );

  router.get("/nav-dekoratoren-api/auth", (_req, res) => {
    res.json({
      authenticated: true,
      name: "Lokal Bruker",
      userId: "12345678901",
    });
  });
}
