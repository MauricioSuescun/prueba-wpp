import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adsRoutes from "./routes/ads.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ads", adsRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});