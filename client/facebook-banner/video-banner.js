import { trackEvent } from "/utils/tracking.js";

export function initVideoBanner({ size, clickUrl }) {
  const banner = document.getElementById("banner");
  const video = document.getElementById("video");
  const btnPlay = document.getElementById("btn-play");
  const btnPause = document.getElementById("btn-pause");
  const btnMute = document.getElementById("btn-mute");
  const vol = document.getElementById("vol");
  const controls = document.getElementById("controls");

  const bannerType = `facebook_video_${size}`;

  function trackVideo(eventName, metadata = {}) {
    trackEvent({
      bannerType,
      event: eventName,
      metadata: { ...metadata, timestamp: new Date().toISOString() },
    });
  }

  // Clic en el banner (fuera de controles) -> redirigir
  banner.addEventListener("click", (e) => {
    if (controls.contains(e.target)) return;
    trackEvent({ bannerType, event: "banner_click" });
    window.open(clickUrl, "_blank");
  });

  // Controles: no redirigen, solo acción + tracking
  btnPlay.addEventListener("click", (e) => {
    e.stopPropagation();
    video.play();
    trackVideo("video_play");
  });
  btnPause.addEventListener("click", (e) => {
    e.stopPropagation();
    video.pause();
    trackVideo("video_pause");
  });

  video.addEventListener("play", () => {
    btnPlay.style.display = "none";
    btnPause.style.display = "flex";
  });
  video.addEventListener("pause", () => {
    btnPlay.style.display = "flex";
    btnPause.style.display = "none";
  });

  let isMuted = false;
  btnMute.addEventListener("click", (e) => {
    e.stopPropagation();
    isMuted = !isMuted;
    video.muted = isMuted;
    btnMute.textContent = isMuted ? "🔇" : "🔊";
    trackVideo(isMuted ? "video_mute" : "video_unmute");
  });

  vol.addEventListener("input", (e) => {
    e.stopPropagation();
    const v = Number(e.target.value) / 100;
    video.volume = v;
    if (v === 0) {
      video.muted = true;
      isMuted = true;
      btnMute.textContent = "🔇";
    } else {
      video.muted = false;
      isMuted = false;
      btnMute.textContent = "🔊";
    }
    trackEvent({
      bannerType,
      event: "video_volume_change",
      metadata: { volume: v },
    });
  });

  vol.addEventListener("click", (e) => e.stopPropagation());
}
