import { ClientRequest } from "node:http";

import { getToken, requestOboToken } from "@navikt/oasis";
import { NextFunction, Request, Response, Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import logger from "./logger.js";
import { requireEnvironment } from "./utils.js";

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
  addProxyWithOboExchangeHandler(router, {
    ingoingUrl: "/api",
    outgoingUrl: requireEnvironment("API_URL"),
    scope: requireEnvironment("API_SCOPE"),
  });
};

export const setupDekoratorenApiProxy = (router: Router) => {
  addSimpleProxyHandler(router, {
    ingoingUrl: "/nav-dekoratoren-api",
    outgoingUrl: requireEnvironment("DEKORATOREN_API_URL"),
  });
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
