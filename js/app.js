/* ==========================================================================
   APP — Main Application Init, Theme Toggle, RTL Toggle
   ========================================================================== */

import { $, $$ } from './utils.js';
import { initNavbar } from './navbar.js';
import { initHeroSlider } from './hero-slider.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initPageTransitions } from './page-transitions.js';
import { initForms } from './forms.js';

/**
 * Theme Manager (Light / Dark)
 */
const ThemeManager = {
  STORAGE_KEY: 'luxe-travel-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    this.apply(theme);

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });

    // Bind toggle buttons
    $$('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcons(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },

  updateIcons(theme) {
    $$('[data-theme-toggle]').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
      }
    });
  }
};

/**
 * RTL Manager
 */
const RTLManager = {
  STORAGE_KEY: 'luxe-travel-dir',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      document.documentElement.setAttribute('dir', saved);
    }

    $$('[data-rtl-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem(this.STORAGE_KEY, next);
  }
};

/**
 * Accordion Manager
 */
function initAccordions() {
  $$('.accordion').forEach(accordion => {
    const items = $$('.accordion__item', accordion);
    items.forEach(item => {
      const trigger = $('.accordion__trigger', item);
      const content = $('.accordion__content', item);
      if (!trigger || !content) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all siblings
        items.forEach(i => {
          i.classList.remove('active');
          const c = $('.accordion__content', i);
          if (c) c.style.maxHeight = '0';
        });

        // Open clicked
        if (!isOpen) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  });
}

/**
 * Tabs Manager
 */
function initTabs() {
  $$('[data-tabs]').forEach(tabContainer => {
    const buttons = $$('.tab-btn', tabContainer);
    const parentSection = tabContainer.closest('[data-tab-group]') || tabContainer.parentElement;
    const panels = $$('.tab-panel', parentSection);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = $(`#${target}`, parentSection);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height-scrolled')) || 64;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Initialize counters with IntersectionObserver
 */
function initCounters() {
  const counters = $$('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.counter, 10);
        const suffix = entry.target.dataset.suffix || '';
        const prefix = entry.target.dataset.prefix || '';
        animateValue(entry.target, target, prefix, suffix);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

function animateValue(el, target, prefix, suffix, duration = 2000) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = prefix + value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/**
 * Back to top button
 */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Main Init
 */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  initNavbar();
  initHeroSlider();
  initScrollReveal();
  initPageTransitions();
  initForms();
  initAccordions();
  initTabs();
  initSmoothScroll();
  initCounters();
  initBackToTop();
});
