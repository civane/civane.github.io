(() => {
  const video = document.querySelector('.peephole-motion');
  if (!video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;

  function update() {
    if (!visible || reduced.matches || document.hidden) {
      video.pause();
      if (reduced.matches) video.classList.remove('is-playing');
      return;
    }
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    video.play().catch(() => video.classList.remove('is-playing'));
  }

  video.addEventListener('playing', () => video.classList.add('is-playing'));
  video.addEventListener('error', () => video.classList.remove('is-playing'));
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }).observe(video.parentElement);
  reduced.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
})();
