/* ==========================================================================
   NAVBAR — Sticky Nav, Mobile Menu, Scroll Behavior
   ========================================================================== */

import { $, $$, throttle } from './utils.js';

export function initNavbar() {
  const navbar = $('.navbar');
  if (!navbar) return;

  const hamburger = $('.hamburger');
  const mobileMenu = $('.mobile-menu');
  const body = document.body;

  // ── Scroll behavior ────────────────────────────────────────────────
  let lastScroll = 0;

  const handleScroll = throttle(() => {
    const currentScroll = window.scrollY;

    // Add scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll direction (optional — remove if not desired)
    if (currentScroll > lastScroll && currentScroll > 300) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  }, 50);

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── Mobile menu toggle ─────────────────────────────────────────────
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');

      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      body.classList.toggle('no-scroll');

      hamburger.setAttribute('aria-expanded', !isOpen);
    });

    // Close on link click
    $$('.mobile-menu__link', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('no-scroll');
      });
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('no-scroll');
      }
    });
  }

  // ── Dropdown accessibility ─────────────────────────────────────────
  $$('.navbar__item', navbar).forEach(item => {
    const link = $('.navbar__link', item);
    const dropdown = $('.navbar__dropdown', item);
    if (!dropdown) return;

    // Keyboard navigation
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0)';
      }
    });

    // Close on focus out
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) {
        dropdown.style.opacity = '';
        dropdown.style.visibility = '';
        dropdown.style.transform = '';
      }
    });
  });

  // ── Active page highlight ──────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.navbar__link', navbar).forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Also for mobile
  if (mobileMenu) {
    $$('.mobile-menu__link', mobileMenu).forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}
