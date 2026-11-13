(() => {
  const button = document.querySelector('#portrait-window');
  const inside = document.querySelector('#portrait-inside');
  const video = inside.querySelector('video');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  function stop() {
    clearTimeout(timer);
    video.pause();
    video.classList.remove('playing');
  }
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'false';
    stop();
    button.setAttribute('aria-expanded', String(open));
    inside.setAttribute('aria-hidden', String(!open));
    if (open && !reduced.matches) {
      if (!video.hasAttribute('src')) video.src = video.dataset.src;
      video.currentTime = 0;
      timer = setTimeout(() => video.play().catch(stop), 400);
    }
  });
  video.addEventListener('playing', () => video.classList.add('playing'));
  video.addEventListener('ended', stop);
  reduced.addEventListener('change', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
