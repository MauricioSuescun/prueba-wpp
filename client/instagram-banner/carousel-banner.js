import { trackEvent } from "/utils/tracking.js";

// Imágenes de Pexels (búsqueda "adidas shoes") – fotos de zapatos Adidas
const SLIDES = [
  {
    image:
      "https://images.pexels.com/photos/13058810/pexels-photo-13058810.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "https://www.adidas.co/hombre",
    alt: "Adidas Hombre",
    tag: "Hombre",
  },
  {
    image:
      "https://images.pexels.com/photos/233312/pexels-photo-233312.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "https://www.adidas.co/mujer",
    alt: "Adidas Mujer",
    tag: "Adidas Mujer",
  },
  {
    image:
      "https://images.pexels.com/photos/6150128/pexels-photo-6150128.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "https://www.adidas.co/calzado",
    alt: "Adidas Calzado",
    tag: "Adidas Calzado",
  },
  {
    image:
      "https://images.pexels.com/photos/6050909/pexels-photo-6050909.jpeg?auto=compress&cs=tinysrgb&w=600",
    url: "https://www.adidas.co/ninos",
    alt: "Adidas Niños",
    tag: "Adidas Niños",
  },
];

export function initCarouselBanner({ size, bannerType }) {
  const banner = document.getElementById("banner");
  const track = document.getElementById("track");
  const prevBtn = document.getElementById("btn-prev");
  const nextBtn = document.getElementById("btn-next");
  const dots = document.getElementById("dots");

  let index = 0;
  const total = SLIDES.length;

  function renderSlides() {
    const tag = (s) =>
      s.tag
        ? `<div class="slide-overlay"><span class="slide-tag">${s.tag}</span></div>`
        : "";
    track.innerHTML = SLIDES.map(
      (s, i) =>
        `<a class="slide" href="${s.url}" target="_blank" rel="noopener" data-index="${i}" data-url="${s.url}">
          <img src="${s.image}" alt="${s.alt}" loading="lazy" />
          ${tag(s)}
        </a>`,
    ).join("");

    dots.innerHTML = SLIDES.map(
      (_, i) =>
        `<button type="button" class="dot" data-index="${i}" aria-label="Ir a imagen ${i + 1}"></button>`,
    ).join("");

    track.querySelectorAll(".slide").forEach((el) => {
      el.addEventListener("click", (e) => {
        const i = Number(el.dataset.index);
        trackEvent({
          bannerType,
          event: "carousel_image_click",
          metadata: { slideIndex: i, url: el.dataset.url },
        });
        // Dejar que el <a> navegue
      });
    });

    dots.querySelectorAll(".dot").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        goTo(Number(btn.dataset.index));
      });
    });
  }

  function goTo(i) {
    index = ((i % total) + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.querySelectorAll(".dot").forEach((d, j) => {
      d.classList.toggle("active", j === index);
    });
    prevBtn.classList.toggle("hidden", index === 0);
    nextBtn.classList.toggle("hidden", index === total - 1);
  }

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    trackEvent({ bannerType, event: "carousel_arrow_left" });
    goTo(index - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    trackEvent({ bannerType, event: "carousel_arrow_right" });
    goTo(index + 1);
  });

  banner.addEventListener("click", (e) => {
    if (
      prevBtn.contains(e.target) ||
      nextBtn.contains(e.target) ||
      dots.contains(e.target)
    )
      return;
    if (e.target.closest(".slide")) return;
    trackEvent({ bannerType, event: "banner_click" });
    window.open(SLIDES[index].url, "_blank");
  });

  renderSlides();
  goTo(0);
}
