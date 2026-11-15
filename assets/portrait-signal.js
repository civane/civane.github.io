(() => {
  const portrait = document.getElementById('static-hero-portrait');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!portrait || motion.matches) return;
  const spotlight = document.getElementById('golden-spotlight');
  const visible = style => style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
  const photo = portrait.querySelector('img');
  let photoReady = false;
  photo.decode().then(() => { photoReady = true; }).catch(() => { photoReady = true; });

  const snow = document.createElement('canvas');
  snow.className = 'portrait-signal';
  snow.setAttribute('aria-hidden', 'true');
  snow.width = snow.height = 192;
  const ctx = snow.getContext('2d');
  if (!ctx) return;
  const pixels = ctx.createImageData(snow.width, snow.height);
  portrait.append(snow);
  const duration = 2400;
  const start = performance.now();
  let revealStart = null;
  let lastFrame = -1;

  function draw(now) {
    // Snow is present during the opening spotlight; fade only after entry.
    if (revealStart === null && photoReady && document.body.classList.contains('is-revealed') &&
        !visible(getComputedStyle(document.body, '::before')) &&
        (!spotlight || !visible(getComputedStyle(spotlight)))) revealStart = now;
    const progress = revealStart === null ? 0 : (now - revealStart) / duration;
    if (progress >= 1 || motion.matches || portrait.getBoundingClientRect().bottom <= 0) {
      snow.remove();
      return;
    }
    const frame = Math.floor((now - start) / 65);
    if (frame !== lastFrame) {
      lastFrame = frame;
      const band = ((now - start) % duration) / duration * 220 - 16;
      for (let y = 0; y < snow.height; y++) {
        const bias = (y % 3 === 0 ? -15 : 0) + Math.max(0, 1 - Math.abs(y - band) / 6) * 32;
        for (let x = 0; x < snow.width; x++) {
          const index = (y * snow.width + x) * 4;
          const shade = 25 + Math.random() * 168 + bias;
          pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = shade;
          pixels.data[index + 3] = 255;
        }
      }
      ctx.putImageData(pixels, 0, 0);
    }
    snow.style.opacity = .82 * (1 - Math.max(0, (progress - .25) / .75));
    requestAnimationFrame(draw);
  }
  draw(start);
})();
