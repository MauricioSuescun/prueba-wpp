import { trackEvent } from "/utils/tracking.js";

const PLAY_SVG = '<path d="M8 5v14l11-7z"/>';
const PAUSE_SVG = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
const MUTE_SVG = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
const UNMUTE_SVG = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';

export function initVideoBanner({ size, clickUrl }) {
  const banner = document.getElementById("banner");
  const video = document.getElementById("video");
  const playOverlay = document.getElementById("playOverlay");
  const btnPlay = document.getElementById("btn-play");
  const playSvg = document.getElementById("playSvg");
  const btnMute = document.getElementById("btn-mute");
  const muteSvg = document.getElementById("muteSvg");
  const vol = document.getElementById("vol");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const controls = document.getElementById("controls");
  const volumeBadge = document.getElementById("volumeBadge");

  const bannerType = `facebook_banner_${size}`;

  function updateVolumeBadge(isMuted) {
    if (!volumeBadge) return;
    volumeBadge.innerHTML = "<svg viewBox=\"0 0 24 24\">" + (isMuted ? MUTE_SVG : UNMUTE_SVG) + "</svg>";
  }

  function trackVideo(eventName, metadata = {}) {
    trackEvent({
      bannerType,
      event: eventName,
      metadata: { ...metadata, timestamp: new Date().toISOString() },
    });
  }

  // Evitar que el clic en controles redirija
  if (controls) {
    controls.addEventListener("click", (e) => e.stopPropagation());
    controls.addEventListener("mousedown", (e) => e.stopPropagation());
  }
  if (playOverlay) playOverlay.addEventListener("click", (e) => e.stopPropagation());

  // Clic en el banner (fuera de video-wrap/controles) -> redirigir
  banner.addEventListener("click", (e) => {
    if (document.querySelector(".video-wrap")?.contains(e.target)) return;
    trackEvent({ bannerType, event: "banner_click" });
    window.open(clickUrl, "_blank");
  });

  // Play overlay: alternar play/pause
  if (playOverlay) {
    playOverlay.addEventListener("click", () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }

  video.addEventListener("play", () => {
    if (playOverlay) playOverlay.classList.add("hidden");
    if (playSvg) playSvg.innerHTML = PAUSE_SVG;
    trackVideo("video_play");
  });

  video.addEventListener("pause", () => {
    if (playOverlay) {
      playOverlay.classList.remove("hidden");
      if (playOverlay.querySelector(".play-icon") === null) {
        const icon = document.createElement("div");
        icon.className = "play-icon";
        playOverlay.innerHTML = "";
        playOverlay.appendChild(icon);
      }
    }
    if (playSvg) playSvg.innerHTML = PLAY_SVG;
    trackVideo("video_pause");
  });

  // Botón play/pause
  btnPlay?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.paused ? video.play() : video.pause();
  });

  // Barra de progreso: actualizar fill
  video.addEventListener("timeupdate", () => {
    if (video.duration && progressFill) {
      progressFill.style.width = (video.currentTime / video.duration) * 100 + "%";
    }
  });

  // Clic en barra = seek
  progressBar?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!video.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    video.currentTime = ratio * video.duration;
    trackVideo("video_seek", { position: ratio.toFixed(2) });
  });

  // Mute
  btnMute?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (muteSvg) muteSvg.innerHTML = video.muted ? MUTE_SVG : UNMUTE_SVG;
    updateVolumeBadge(video.muted);
    trackVideo(video.muted ? "video_mute" : "video_unmute");
  });

  // Volumen (0-1)
  vol?.addEventListener("input", (e) => {
    e.stopPropagation();
    const v = parseFloat(vol.value);
    video.volume = v;
    if (v === 0) {
      video.muted = true;
      if (muteSvg) muteSvg.innerHTML = MUTE_SVG;
    } else {
      video.muted = false;
      if (muteSvg) muteSvg.innerHTML = UNMUTE_SVG;
    }
    updateVolumeBadge(video.muted);
    trackEvent({
      bannerType,
      event: "video_volume_change",
      metadata: { volume: v },
    });
  });

}
