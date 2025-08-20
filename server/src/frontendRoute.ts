import path from "node:path";

import express, { Express } from "express";
import rateLimit from "express-rate-limit";

export function setupStaticRoutes(app: Express) {
  // Set up rate limiter: maximum of 900 requests per 15 minutes which
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 900,
  });

  // Apply rate limiter to all requests
  app.use(limiter);

  app.use(express.static("./public", { index: false }));
  // Når appen er deployet, kopieres det bygde frontend-innholdet til public-mappen. Hvis BFF kjøres lokalt, vil ikke denne mappen eksistere.
  const pathToSpaFile = path.resolve("./public", "index.html");

  // Fra Express 5 er wildcard ruten erstattet med *splat: https://expressjs.com/en/guide/migrating-5.html
  app.get("*splat", (request, response) => {
    return response.sendFile(pathToSpaFile);
  });
}
