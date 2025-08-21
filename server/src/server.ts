import express from "express";

import { setupActuators } from "./actuators.js";
import { setupStaticRoutes } from "./frontendRoute.js";

const app = express();

// Restricts the server to only accept UTF-8 encoding of bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupActuators(app);

const protectedRouter = express.Router();
app.set("trust proxy", 1);

// Catch all route, må være sist
setupStaticRoutes(protectedRouter);

app.use(protectedRouter);

export default app;
