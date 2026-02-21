const CLICK_URL = "https://example.com";

export function initWeatherBanner({ size, clickUrl = CLICK_URL, cities = ["Bogota"] }) {
  const banner = document.getElementById("banner");
  const cityEl = document.getElementById("city");
  const tempEl = document.getElementById("temp");
  const conditionEl = document.getElementById("condition");
  const cta = document.getElementById("cta");

  const cityList = Array.isArray(cities) ? cities : [cities];
  let currentCityIndex = 0;

  async function loadWeather() {
    const city = cityList[currentCityIndex % cityList.length];
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      cityEl.textContent = data.city || city;
      tempEl.innerHTML = `${data.temp !== undefined ? data.temp : "--"}<span>°C</span>`;
      conditionEl.textContent = data.condition || "—";
    } catch (e) {
      cityEl.textContent = "Colombia";
      tempEl.innerHTML = `--<span>°C</span>`;
      conditionEl.textContent = "—";
    }
  }

  function rotateCity() {
    currentCityIndex++;
    loadWeather();
  }

  loadWeather();
  setInterval(rotateCity, 5000);

  function openUrl(e) {
    if (e) e.stopPropagation();
    window.open(clickUrl, "_blank");
  }

  banner.addEventListener("click", () => openUrl());
  cta.addEventListener("click", (e) => {
    e.stopPropagation();
    openUrl();
  });
}
