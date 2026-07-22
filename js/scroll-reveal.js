/* ==========================================================================
   SCROLL REVEAL — IntersectionObserver Animations
   ========================================================================== */

import { $$ } from './utils.js';

export function initScrollReveal() {
  const revealElements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  if (!revealElements.length) return;

  // Immediately reveal all elements if reduced motion or fallback timeout
  const revealAll = () => revealElements.forEach(el => el.classList.add('revealed'));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '50px 0px 50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // Fallback safety: ensure everything becomes visible after page load
  setTimeout(revealAll, 1200);
}
