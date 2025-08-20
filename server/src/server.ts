import express from "express";

import { setupActuators } from "./actuators.js";

const app = express();

// Restricts the server to only accept UTF-8 encoding of bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1);

setupActuators(app);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Melosys Skjema Server" });
});

export default app;
