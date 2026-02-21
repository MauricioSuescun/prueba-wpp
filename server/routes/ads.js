import express from "express";
import { generateAd } from "../services/openaiService.js";

const router = express.Router();

let adsPool = [];
let globalMetrics = {};
let adsMetrics = {};
let nextAdId = 1;

function addAdToPool(ad) {
  const withId = { id: `ad_${nextAdId++}`, ...ad };
  adsPool.push(withId);
  return withId;
}

async function preloadAds() {
  const count = 25; // 20-30 registros según requisitos
  for (let i = 0; i < count; i++) {
    const ad = await generateAd({
      brand: "Nike",
      country: "Colombia",
      productType: "running shoes",
    });
    addAdToPool(ad);
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

/** Genera un anuncio con IA y lo añade al pool (forma visual/interactiva de alimentar el endpoint) */
router.post("/ads/generate-and-add", async (req, res) => {
  try {
    const { brand = "Nike", country = "Colombia", productType = "producto" } =
      req.body;
    const ad = await generateAd({ brand, country, productType });
    const withId = addAdToPool(ad);
    res.json({ success: true, ad: withId });
  } catch (err) {
    console.error("generate-and-add error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
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
