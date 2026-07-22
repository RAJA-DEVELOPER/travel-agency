/* ==========================================================================
   PAGE TRANSITIONS — Smooth page-to-page transitions
   ========================================================================== */

import { $, $$ } from './utils.js';

export function initPageTransitions() {
  const overlay = $('.page-transition');
  if (!overlay) return;

  // Animate in on page load
  overlay.classList.remove('active');

  // Intercept internal links
  $$('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });

  // Handle back button
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      overlay.classList.remove('active');
    }
  });
}
