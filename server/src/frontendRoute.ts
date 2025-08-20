import path from "node:path";

import { DecoratorFetchProps } from "@navikt/nav-dekoratoren-moduler";
import {
  buildCspHeader,
  injectDecoratorServerSide,
} from "@navikt/nav-dekoratoren-moduler/ssr/index.js";
import express, { Router } from "express";
import rateLimit from "express-rate-limit";

import config from "./config.js";

const csp = await buildCspHeader(
  config.app.env === "prod"
    ? {
        "img-src": ["data:", "'self'"],
        "connect-src": ["https://telemetry.nav.no/collect"],
      }
    : {
        "img-src": ["data:", "'self'"],
        "script-src-elem": ["http://localhost:*"],
        "style-src-elem": ["http://localhost:*"],
        "connect-src": [
          "https://telemetry.ekstern.dev.nav.no/collect",
          "http://localhost:*",
        ],
      },
  { env: config.app.env },
);

const decoratorProps = {
  env: config.app.env,
  params: {
    context: "privatperson",
    simple: true,
    logoutWarning: true,
    chatbot: false,
  },
} satisfies DecoratorFetchProps;

export function setupStaticRoutes(router: Router) {
  // Set up rate limiter: maximum of 900 requests per 15 minutes which
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 900,
  });

  console.log("Setter csp");

  router.use((request, response, next) => {
    response.setHeader("Content-Security-Policy", csp);
    return next();
  });

  // Apply rate limiter to all requests
  router.use(limiter);

  router.use(express.static("./public", { index: false }));

  // Når appen er deployet, kopieres det bygde frontend-innholdet til public-mappen. Hvis BFF kjøres lokalt, vil ikke denne mappen eksistere.
  const spaFilePath = path.resolve("./public", "index.html");

  // Fra Express 5 er wildcard ruten erstattet med *splat: https://expressjs.com/en/guide/migrating-5.html
  router.get("/*splat", async (request, response) => {
    console.log("Henter dekorator");

    const html = await injectDecoratorServerSide({
      filePath: spaFilePath,
      ...decoratorProps,
    });

    console.log("Sender dekorator");

    console.log(html);

    return response.sendFile(html);
  });
}
