/* ==========================================================================
   DASHBOARD — Tab Switching, Sidebar, Interactions
   ========================================================================== */

import { $, $$, throttle } from './utils.js';

export function initDashboard() {
  const layout = $('.dash-layout');
  if (!layout) return;

  initDashSidebar();
  initDashTabs();
  initDashFileUpload();
  initDashCountdown();
}

/**
 * Sidebar Navigation
 */
function initDashSidebar() {
  const sidebar = $('.dash-sidebar');
  const toggle = $('.dash-sidebar-toggle');

  if (!sidebar || !toggle) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar on link click (mobile)
  $$('.dash-sidebar__link', sidebar).forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

/**
 * Dashboard Tab Switching
 */
function initDashTabs() {
  const links = $$('.dash-sidebar__link[data-dash-tab]');
  const panels = $$('.dash-tab-panel');

  if (!links.length || !panels.length) return;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.dashTab;

      // Update active link
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show target panel
      panels.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      const targetPanel = $(`#dash-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.display = 'block';
        targetPanel.style.animation = 'fadeIn 0.4s ease';
      }
    });
  });
}

/**
 * Dashboard file upload
 */
function initDashFileUpload() {
  const uploadZone = $('.dash-upload');
  if (!uploadZone) return;

  const input = $('input[type="file"]', uploadZone);
  if (!input) return;

  uploadZone.addEventListener('click', () => input.click());

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files, uploadZone);
  });

  input.addEventListener('change', () => {
    handleFiles(input.files, uploadZone);
  });
}

function handleFiles(files, zone) {
  const list = $('.dash-upload__list', zone.parentElement) || document.createElement('div');
  list.className = 'dash-upload__list';

  Array.from(files).forEach(file => {
    const item = document.createElement('div');
    item.className = 'dash-upload__item';
    item.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      <span>${file.name}</span>
      <small>${(file.size / 1024).toFixed(1)} KB</small>
    `;
    list.appendChild(item);
  });

  if (!zone.parentElement.contains(list)) {
    zone.parentElement.appendChild(list);
  }
}

/**
 * Maintenance countdown
 */
function initDashCountdown() {
  const countdown = $('.countdown');
  if (!countdown) return;

  // Set target to 24 hours from now
  const target = new Date();
  target.setHours(target.getHours() + 24);

  function update() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) return;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const hoursEl = $('[data-countdown="hours"]', countdown);
    const minutesEl = $('[data-countdown="minutes"]', countdown);
    const secondsEl = $('[data-countdown="seconds"]', countdown);

    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    requestAnimationFrame(update);
  }

  update();
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);
