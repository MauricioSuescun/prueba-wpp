import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adsRoutes from "./routes/ads.js";
import weatherRoutes from "./routes/weather.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", adsRoutes);
app.use("/api", weatherRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dynamic-banner/index.html"));
});

app.get("/dynamic-banner/300x250", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dynamic-banner/300x250.html"));
});
app.get("/dynamic-banner/300x600", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dynamic-banner/300x600.html"));
});

app.get("/facebook-banner/300x600", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/facebook-banner/300x600.html"));
});
app.get("/facebook-banner/320x480", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/facebook-banner/320x480.html"));
});
app.get("/instagram-banner/300x600", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/instagram-banner/300x600.html"));
});
app.get("/instagram-banner/320x480", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/instagram-banner/320x480.html"));
});

app.get("/weather-banner/300x250", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/weather-banner/300x250.html"));
});
app.get("/weather-banner/300x600", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/weather-banner/300x600.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
