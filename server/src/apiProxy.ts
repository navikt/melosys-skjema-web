import { getToken, requestOboToken } from "@navikt/oasis";
import { NextFunction, Request, Response, Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import config from "./config.js";
import logger from "./logger.js";

type ProxyOptions = {
  ingoingUrl: string;
  outgoingUrl: string;
  scope: string;
};

export const setupApiProxy = (router: Router) =>
  addProxyHandler(router, {
    ingoingUrl: "/server",
    outgoingUrl: config.proxy.apiUrl,
    scope: config.proxy.apiScope,
  });

function addProxyHandler(
  router: Router,
  { ingoingUrl, outgoingUrl, scope }: ProxyOptions,
) {
  router.use(
    ingoingUrl,
    async (request: Request, response: Response, next: NextFunction) => {
      const token = getToken(request);
      if (!token) {
        response.status(401).send();
        return;
      }
      const obo = await requestOboToken(token, scope);
      if (obo.ok) {
        request.headers["obo-token"] = obo.token;
        return next();
      } else {
        logger.error("OBO-veksling feilet", obo.error);
        response.status(403).send();
        return;
      }
    },
    createProxyMiddleware({
      target: outgoingUrl,
      changeOrigin: true,
      logger: logger,
      on: {
        proxyReq: (proxyRequest, request) => {
          const obo = request.headers["obo-token"];
          if (obo) {
            proxyRequest.removeHeader("obo-token");
            proxyRequest.removeHeader("cookie");
            proxyRequest.setHeader("Authorization", `Bearer ${obo}`);
          } else {
            logger.warning(
              `Access token var not present in session for scope ${scope}`,
            );
          }
        },
      },
    }),
  );
}
