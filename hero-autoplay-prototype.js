const liveVideo = document.querySelector("#liveHeroVideo");

let progressFrame = 0;

function setProgress() {
  if (!liveVideo || !Number.isFinite(liveVideo.duration) || liveVideo.duration <= 0) {
    progressFrame = window.requestAnimationFrame(setProgress);
    return;
  }

  const progress = liveVideo.currentTime / liveVideo.duration;
  document.documentElement.style.setProperty("--video-progress", progress.toFixed(4));
  progressFrame = window.requestAnimationFrame(setProgress);
}

function startVideo() {
  if (!liveVideo) return;
  liveVideo.muted = true;
  liveVideo.play().catch(() => {
    document.addEventListener("pointerdown", () => liveVideo.play(), { once: true });
  });
}

liveVideo?.addEventListener("loadedmetadata", () => {
  window.cancelAnimationFrame(progressFrame);
  setProgress();
  startVideo();
});

liveVideo?.addEventListener("play", () => {
  window.cancelAnimationFrame(progressFrame);
  setProgress();
});

startVideo();
