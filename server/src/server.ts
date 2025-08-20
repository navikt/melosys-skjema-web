import express from "express";

import { setupActuators } from "./actuators.js";
import { setupStaticRoutes } from "./frontendRoute.js";

const app = express();

// Restricts the server to only accept UTF-8 encoding of bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1);

setupActuators(app);

setupStaticRoutes(app);

export default app;
