import express from "express";
import { generateAd } from "../services/openaiService.js";

const router = express.Router();

let adsPool = [];

async function preloadAds() {
  for (let i = 0; i < 10; i++) {
    const ad = await generateAd({
      brand: "Nike",
      country: "Colombia",
      productType: "running shoes",
    });
    adsPool.push(ad);
  }
}

preloadAds();

router.get("/generate", async (req, res) => {
  if (adsPool.length === 0) {
    await preloadAds();
  }

  const randomIndex = Math.floor(Math.random() * adsPool.length);
  const ad = adsPool.splice(randomIndex, 1)[0]; // lo elimina del pool

  res.json(ad);
});

export default router;