import express from "express";

const router = express.Router();

const CITIES = {
  Bogota: { lat: 4.711, lon: -74.0721, name: "Bogotá" },
  Medellin: { lat: 6.2476, lon: -75.5658, name: "Medellín" },
  Cali: { lat: 3.4516, lon: -76.532, name: "Cali" },
  Barranquilla: { lat: 10.9639, lon: -74.7964, name: "Barranquilla" },
  Cartagena: { lat: 10.3997, lon: -75.5144, name: "Cartagena" },
};

const WEATHER_LABELS = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla",
  51: "Llovizna",
  53: "Llovizna",
  55: "Llovizna",
  61: "Lluvia",
  63: "Lluvia",
  65: "Lluvia fuerte",
  71: "Nieve",
  73: "Nieve",
  75: "Nieve fuerte",
  80: "Chubascos",
  81: "Chubascos",
  82: "Chubascos fuertes",
  95: "Tormenta",
};

function getWeatherLabel(code) {
  return WEATHER_LABELS[code] ?? "Variable";
}

router.get("/weather", async (req, res) => {
  const cityKey = req.query.city || "Bogota";
  const city = CITIES[cityKey] || CITIES.Bogota;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`;
    const response = await fetch(url);
    const data = await response.json();
    const current = data.current || {};
    res.json({
      city: city.name,
      temp: Math.round(Number(current.temperature_2m ?? 0)),
      condition: getWeatherLabel(Number(current.weather_code ?? 0)),
      code: current.weather_code,
    });
  } catch (err) {
    console.error("Weather API error:", err);
    res.status(500).json({
      city: city.name,
      temp: "--",
      condition: "—",
      error: err.message,
    });
  }
});

router.get("/weather/cities", (req, res) => {
  res.json(Object.keys(CITIES));
});

export default router;
