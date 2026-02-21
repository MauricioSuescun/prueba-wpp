export async function trackEvent({
  bannerType,
  event,
  adId = null,
  metadata = {},
}) {
  const payload = {
    bannerType,
    event,
    adId,
    metadata,
    timestamp: new Date().toISOString(),
  };
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // Evento para que la misma página pueda actualizar el panel de métricas
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("banner-track", { detail: payload }));
    }
  } catch (error) {
    console.error("Tracking error:", error);
  }
}
