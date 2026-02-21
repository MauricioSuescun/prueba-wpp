import express from "express";
import { generateAd } from "../services/openaiService.js";

const router = express.Router();

let adsPool = [];
let globalMetrics = {};
let adsMetrics = {};

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

router.get("/ads/random", async (req, res) => {
  if (adsPool.length === 0) {
    await preloadAds();
  }

  const randomIndex = Math.floor(Math.random() * adsPool.length);
  const ad = adsPool[randomIndex];

  res.json(ad);
});

router.post("/track", (req, res) => {
  const { bannerType, event, adId, metadata } = req.body;

  if (!globalMetrics[bannerType]) {
    globalMetrics[bannerType] = {};
  }

  if (!globalMetrics[bannerType][event]) {
    globalMetrics[bannerType][event] = 0;
  }

  globalMetrics[bannerType][event]++;

  if (adId) {
    if (!adsMetrics[adId]) {
      adsMetrics[adId] = {};
    }

    if (!adsMetrics[adId][event]) {
      adsMetrics[adId][event] = 0;
    }

    adsMetrics[adId][event]++;
  }

  res.json({
    success: true,
  });
});

router.get("/metrics", (req, res) => {
  res.json({
    globalMetrics,
    adsMetrics,
  });
});

export default router;
