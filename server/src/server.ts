import express from "express";

import { setupActuators } from "./actuators.js";
import { errorHandling } from "./errorHandler.js";
import { setupStaticRoutes } from "./frontendRoute.js";
import logger from "./logger.js";

const app = express();

// Restricts the server to only accept UTF-8 encoding of bodies
app.use(express.urlencoded({ extended: true }));
setupActuators(app);

// Logging i json format
app.use(logger.morganMiddleware);

const protectedRouter = express.Router();
app.set("trust proxy", 1);

// Catch all route, må være sist
setupStaticRoutes(protectedRouter);

app.use(protectedRouter);

app.use(errorHandling);

export default app;
