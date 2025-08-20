import { Router } from "express";

export function setupActuators(router: Router) {
  router.get("/internal/health/liveness", (request, response) => {
    response.send({
      status: "UP",
    });
  });

  console.log("Liveness available on /internal/health/liveness");

  router.get("/internal/health/readiness", (request, response) => {
    response.send({
      status: "UP",
    });
  });

  console.log("Readiness available on /internal/health/rediness");
}
