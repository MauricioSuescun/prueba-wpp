export async function trackEvent({
  bannerType,
  event,
  adId = null,
  metadata = {},
}) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bannerType,
        event,
        adId,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Tracking error:", error);
  }
}
