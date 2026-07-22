(() => {
  // Utility Functions
  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }
  function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  }

  // Theme Manager (Light / Dark)
  const ThemeManager = {
    STORAGE_KEY: 'luxe-travel-theme',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      this.apply(theme);

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.apply(e.matches ? 'dark' : 'light');
        }
      });

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

  // RTL Manager
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

  function initDashboard() {
    const layout = $('.dash-page') || $('.dash-layout');
    if (!layout) return;

    ThemeManager.init();
    RTLManager.init();
    initDashSidebar();
    initDashTabs();
    initDashFileUpload();
    initDashNotifications();
    initDashProfile();
    initDashPayments();
    initDashCountdown();
  }

  function initDashSidebar() {
    const sidebar = $('.dash-sidebar');
    const toggle = $('.dash-sidebar-toggle');
    const overlay = $('.dash-sidebar-overlay');

    if (!sidebar || !toggle) return;

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    };

    const openSidebar = () => {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('open');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', () => closeSidebar());
    }

    $$('.dash-sidebar__link', sidebar).forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          closeSidebar();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
          closeSidebar();
        }
      }
    });
  }

  function initDashTabs() {
    const links = $$('.dash-sidebar__link[data-dash-tab]');
    const panels = $$('.dash-panel');

    if (!links.length || !panels.length) return;

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.dashTab;

        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        panels.forEach(p => {
          p.classList.remove('active');
          p.style.display = 'none';
        });

        const targetPanel = $(`#dash-${target}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.style.display = 'block';
          targetPanel.style.animation = 'fadeIn 0.35s ease';
        }
      });
    });
  }

  function initDashFileUpload() {
    const uploadZones = $$('.file-upload, .dash-upload');
    if (!uploadZones.length) return;

    uploadZones.forEach(zone => {
      const input = $('input[type="file"]', zone);
      if (!input) return;

      zone.addEventListener('click', (e) => {
        if (e.target !== input) input.click();
      });

      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
          handleFiles(e.dataTransfer.files, zone);
        }
      });

      input.addEventListener('change', () => {
        if (input.files.length) {
          handleFiles(input.files, zone);
        }
      });
    });
  }

  function handleFiles(files, zone) {
    const parentCard = zone.closest('.dash-card') || zone.parentElement;
    let list = $('.dash-upload__list', parentCard);

    if (!list) {
      list = document.createElement('div');
      list.className = 'dash-upload__list';
      list.style.marginTop = 'var(--space-4)';
      zone.insertAdjacentElement('afterend', list);
    }

    Array.from(files).forEach(file => {
      const item = document.createElement('div');
      item.className = 'booking-item';
      item.style.padding = 'var(--space-3) 0';
      item.innerHTML = `
        <div class="kpi__icon" style="background:rgba(6,95,70,0.12);flex-shrink:0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="#065F46" stroke-width="2" width="20" height="20">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div class="booking-item__info">
          <div class="booking-item__name">${file.name}</div>
          <div class="booking-item__date">Just uploaded &nbsp;·&nbsp; ${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
        </div>
        <div class="booking-item__status">
          <span class="status-pill status-pill--confirmed">Uploaded</span>
        </div>
      `;
      list.prepend(item);
    });
  }

  function initDashNotifications() {
    const markAllBtn = $('#dash-notifications button');
    if (!markAllBtn) return;

    markAllBtn.addEventListener('click', () => {
      $$('.notif-item__dot').forEach(dot => dot.classList.add('notif-item__dot--gray'));
      const badge = $('.dash-sidebar__link[data-dash-tab="notifications"] .badge');
      if (badge) badge.style.display = 'none';
      markAllBtn.textContent = 'All marked as read';
      markAllBtn.style.opacity = '0.6';
      markAllBtn.style.cursor = 'default';
    });
  }

  function initDashProfile() {
    const photoBtn = $('#dash-profile .profile-avatar-area button');
    if (photoBtn) {
      photoBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const avatar = $('#dash-profile .avatar-lg');
              if (avatar) avatar.style.backgroundImage = `url('${evt.target.result}')`;
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      });
    }

    const form = $('#dash-profile form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = $('button[type="submit"]', form);
        if (submitBtn) {
          const origText = submitBtn.textContent;
          submitBtn.textContent = 'Saving...';
          submitBtn.disabled = true;
          setTimeout(() => {
            submitBtn.textContent = 'Saved Successfully! ✨';
            submitBtn.style.background = '#065F46';
            submitBtn.style.color = '#fff';
            setTimeout(() => {
              submitBtn.textContent = origText;
              submitBtn.disabled = false;
              submitBtn.style.background = '';
              submitBtn.style.color = '';
            }, 2000);
          }, 800);
        }
      });
    }
  }

  function initDashPayments() {
    const payBtn = $('#dash-payments a.btn--primary');
    if (payBtn) {
      payBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Redirecting to secure payment gateway for remaining balance of $6,200...');
      });
    }
  }

  function initDashCountdown() {
    const countdown = $('.countdown');
    if (!countdown) return;

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();
