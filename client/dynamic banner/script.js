async function loadAd() {
  try {
    const response = await fetch("/api/ads/generate");
    const data = await response.json();

    document.getElementById("ad-title").textContent = data.title;
    document.getElementById("ad-description").textContent = data.description;
    document.getElementById("ad-cta").textContent = data.cta;
  } catch (error) {
    console.error("Error loading ad:", error);
    document.getElementById("ad-title").textContent = "Error cargando anuncio";
  }
}

loadAd();
