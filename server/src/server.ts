import express from "express";

import { setupActuators } from "./actuators.js";
import { setupApiProxy, setupDekoratorenApiProxy } from "./apiProxy.js";
import { errorHandling } from "./errorHandler.js";
import { setupStaticRoutes } from "./frontendRoute.js";
import { setupLocalProxy } from "./localProxy.js";
import logger from "./logger.js";

const isLocal = process.env.USE_LOCAL_TOKEN === "true";

const app = express();

// Restricts the server to only accept UTF-8 encoding of bodies
app.use(express.urlencoded({ extended: true }));
setupActuators(app);

// Logging i json format
app.use(logger.morganMiddleware);

const protectedRouter = express.Router();
app.set("trust proxy", 1);

if (isLocal) {
  setupLocalProxy(protectedRouter);
} else {
  setupApiProxy(protectedRouter);
  setupDekoratorenApiProxy(protectedRouter);
}

// Catch all route, må være sist
setupStaticRoutes(protectedRouter);

app.use(protectedRouter);

app.use(errorHandling);

export default app;
