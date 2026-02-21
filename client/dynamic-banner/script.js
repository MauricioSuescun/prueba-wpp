async function loadAd() {
  try {
    const response = await fetch("/api/ads/random");
    const data = await response.json();

    document.getElementById("ad-title").textContent = data.title;
    document.getElementById("ad-description").textContent = data.description;
    document.getElementById("ad-cta").textContent = data.cta;
  } catch (error) {
    console.error("Error loading ad:", error);
    document.getElementById("ad-title").textContent = "Error cargando anuncio";
  }
}

document.getElementById("btn-refresh").addEventListener("click", loadAd);

// Formulario para alimentar el endpoint (generar con IA y añadir al catálogo)
document.getElementById("form-feed").addEventListener("submit", async (e) => {
  e.preventDefault();
  const resultEl = document.getElementById("feed-result");
  const form = e.target;
  const brand = form.brand.value.trim() || "Nike";
  const country = form.country.value.trim() || "Colombia";
  const productType = form.productType.value.trim() || "producto";

  resultEl.textContent = "Generando con IA...";
  resultEl.className = "feed-result";

  try {
    const response = await fetch("/api/ads/generate-and-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, country, productType }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error en el servidor");
    }

    resultEl.className = "feed-result success";
    resultEl.textContent = `Añadido al catálogo: "${data.ad.title}" (id: ${data.ad.id}). Total en pool: consulta /api/metrics o recarga un banner.`;
  } catch (err) {
    resultEl.className = "feed-result error";
    resultEl.textContent = "Error: " + err.message;
  }
});

loadAd();
