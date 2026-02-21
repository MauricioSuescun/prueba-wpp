import { trackEvent } from "/utils/tracking.js";

const CLICK_URL = "https://example.com";

export function initWeatherBanner({
  size,
  bannerType,
  clickUrl = CLICK_URL,
  cities = ["Bogota"],
  brand = "ClimaPro",
}) {
  const banner = document.getElementById("banner");
  const brandEl = document.getElementById("brand");
  const cityEl = document.getElementById("city");
  const tempEl = document.getElementById("temp");
  const conditionEl = document.getElementById("condition");
  const cta = document.getElementById("cta");

  if (brandEl) brandEl.textContent = brand;

  const cityList = Array.isArray(cities) ? cities : [cities];
  let currentCityIndex = 0;

  // Métricas: impresión al cargar
  trackEvent({ bannerType, event: "impression" });

  async function loadWeather() {
    const city = cityList[currentCityIndex % cityList.length];
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      cityEl.textContent = data.city || city;
      tempEl.innerHTML = `${data.temp !== undefined ? data.temp : "--"}<span>°C</span>`;
      conditionEl.textContent = data.condition || "—";
      applyWeatherEffects(Number(data.code));
    } catch (e) {
      cityEl.textContent = "Colombia";
      tempEl.innerHTML = `--<span>°C</span>`;
      conditionEl.textContent = "—";
      banner.classList.remove("rainy", "sunny", "cloudy");
    }
  }

  function rotateCity() {
    currentCityIndex++;
    loadWeather();
  }

  function applyWeatherEffects(code) {
    banner.classList.remove("rainy", "sunny", "cloudy");
    // simple grouping based on weather codes from Open-Meteo
    if (code >= 61 && code <= 82) {
      banner.classList.add("rainy");
    } else if (code === 0 || code === 1) {
      banner.classList.add("sunny");
    } else {
      banner.classList.add("cloudy");
    }
  }

  loadWeather();
  setInterval(rotateCity, 5000);

  function openUrl(e) {
    if (e) e.stopPropagation();
    trackEvent({ bannerType, event: "banner_click" });
    window.open(clickUrl, "_blank");
  }

  banner.addEventListener("click", () => openUrl());
  cta.addEventListener("click", (e) => {
    e.stopPropagation();
    trackEvent({ bannerType, event: "cta_click" });
    window.open(clickUrl, "_blank");
  });
}
