import express from "express";

const app = express();

// Restricts the server to only accept UTF-8 encoding of bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1);

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Melosys Skjema Server" });
});

export default app;
