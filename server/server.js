import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adsRoutes from "./routes/ads.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ads", adsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dynamic banner")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dynamic banner/index.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
