import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adsRoutes from "./routes/ads.js";
import path from "path";
import { fileURLToPath } from "url";
import generateAdFromAI from "./routes/ads.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", adsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dynamic banner")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dynamic banner/index.html"));
});

app.get("/dynamic/300x250", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dynamic/300x250.html"));
});

app.get("/dynamic/300x600", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dynamic/300x600.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
