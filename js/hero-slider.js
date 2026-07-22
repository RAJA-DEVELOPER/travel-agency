/* ==========================================================================
   HERO SLIDER — Auto-play Carousel with Controls
   ========================================================================== */

import { $, $$} from './utils.js';

export function initHeroSlider() {
  const slider = $('.hero__slider');
  if (!slider) return;

  const slides = $$('.hero__slide', slider);
  const dots = $$('.hero__dot');
  const prevBtn = $('.hero__arrow--prev');
  const nextBtn = $('.hero__arrow--next');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let interval = null;
  const DURATION = 6000;

  function goTo(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(next, DURATION);
  }

  function stopAutoplay() {
    if (interval) clearInterval(interval);
  }

  // Button events
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

  // Dot events
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });

  // Touch / Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    startAutoplay();
  }, { passive: true });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    const hero = $('.hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    if (e.key === 'ArrowRight') { next(); startAutoplay(); }
    if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
  });

  // Initialize
  goTo(0);
  startAutoplay();
}
