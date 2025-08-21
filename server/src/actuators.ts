import { Router } from "express";

import logger from "./logger.js";

export function setupActuators(router: Router) {
  router.get("/internal/health/liveness", (request, response) => {
    response.send({
      status: "UP",
    });
  });

  logger.info("Liveness available on /internal/health/liveness");

  router.get("/internal/health/readiness", (request, response) => {
    response.send({
      status: "UP",
    });
  });

  logger.info("Readiness available on /internal/health/rediness");
}
