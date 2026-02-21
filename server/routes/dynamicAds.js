import express from "express";
import { getAds, addAd, getRandomAd } from "../data/adsStore.js";
import generateAdFromAI from "../services/ads.js";

const router = express.Router();

router.get("/ads", (req, res) => {
  res.json(getAds());
});

router.get("/ads/random", (req, res) => {
  res.json(getRandomAd());
});

router.post("/generate", async (req, res) => {
  const { brand, country, productType } = req.body;

  const aiContent = await generateAdFromAI(brand, country, productType);

  const newAd = {
    id: Date.now(),
    brand,
    country,
    productType,
    ...aiContent,
    createdAt: new Date(),
  };

  addAd(newAd);

  res.json(newAd);
});

export default router;
