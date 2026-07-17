const hero = document.querySelector("[data-video-hero]");
const scrollVideo = document.querySelector("#scrollHeroVideo");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let ticking = false;
let videoDuration = 0;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getHeroProgress() {
  if (!hero) return 0;
  const rect = hero.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  return clamp(-rect.top / travel);
}

function syncVideo(progress) {
  if (!scrollVideo || !videoDuration || reduceMotion.matches) return;

  const targetTime = progress * Math.max(0, videoDuration - 0.08);
  if (Math.abs(scrollVideo.currentTime - targetTime) < 0.035) return;
  scrollVideo.currentTime = targetTime;
}

function updateHero() {
  ticking = false;
  const progress = getHeroProgress();
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  syncVideo(progress);
}

function requestUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateHero);
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
reduceMotion.addEventListener("change", requestUpdate);

scrollVideo?.addEventListener("loadedmetadata", () => {
  videoDuration = Number.isFinite(scrollVideo.duration) ? scrollVideo.duration : 0;
  scrollVideo.pause();
  updateHero();
});

scrollVideo?.addEventListener(
  "canplay",
  () => {
    scrollVideo.pause();
    updateHero();
  },
  { once: true }
);

updateHero();
