(() => {
  const portrait = document.getElementById('static-hero-portrait');
  const answer = document.getElementById('door-answer');
  if (!portrait || !answer || document.body.dataset.dreamReturn) return;

  const destination = portrait.href;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  portrait.removeAttribute('href');
  portrait.setAttribute('aria-disabled', 'true');

  const snow = document.createElement('canvas');
  snow.className = 'portrait-signal';
  snow.setAttribute('aria-hidden', 'true');
  snow.width = snow.height = 176;
  portrait.append(snow);
  const ctx = snow.getContext('2d');
  const pixels = ctx.createImageData(snow.width, snow.height);
  let timer;
  let inView = true;
  let finished = false;

  function draw() {
    clearTimeout(timer);
    if (finished || document.hidden || !inView) return;
    for (let i = 0; i < pixels.data.length; i += 4) {
      const shade = 28 + Math.random() * 160;
      pixels.data[i] = pixels.data[i+1] = pixels.data[i+2] = shade;
      pixels.data[i+3] = 255;
    }
    ctx.putImageData(pixels, 0, 0);
    if (!motion.matches) timer = setTimeout(draw, 90);
  }
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    draw();
  });
  observer.observe(portrait);
  document.addEventListener('visibilitychange', draw);
  motion.addEventListener('change', draw);
  draw();

  function enter() {
    answer.hidden = false;
  }
  document.body.addEventListener('portrait-enter', enter, {once:true});
  if (document.body.classList.contains('is-revealed')) enter();

  function pickUp(event) {
    if (answer.hidden || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    window.removeEventListener('click', pickUp, true);
    const ring = document.getElementById('call-ring');
    ring.dataset.status = 'answered';
    ring.pause();
    ring.currentTime = 0;
    answer.hidden = true;
    snow.classList.add('answered');
    setTimeout(() => {
      finished = true;
      observer.disconnect();
      clearTimeout(timer);
      document.removeEventListener('visibilitychange',draw);
      motion.removeEventListener('change',draw);
      snow.remove();
      portrait.href = destination;
      portrait.removeAttribute('aria-disabled');
      portrait.focus({preventScroll:true});
    }, motion.matches ? 0 : 1650);
  }
  window.addEventListener('click', pickUp, true);
})();
