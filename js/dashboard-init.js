
    import { initForms } from './forms.js';
    import { $ } from './utils.js';

    // Theme toggle
    const saved = localStorage.getItem('luxe-travel-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const updateIcons = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        btn.querySelector('.icon-sun').style.display = isDark ? 'block' : 'none';
        btn.querySelector('.icon-moon').style.display = isDark ? 'none' : 'block';
      };
      updateIcons();
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('luxe-travel-theme', next);
        document.querySelectorAll('[data-theme-toggle]').forEach(b => {
          b.querySelector('.icon-sun').style.display = next === 'dark' ? 'block' : 'none';
          b.querySelector('.icon-moon').style.display = next === 'dark' ? 'none' : 'block';
        });
      });
    });

    // Dashboard tabs
    const tabs = document.querySelectorAll('[data-dash-tab]');
    const panels = document.querySelectorAll('.dash-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
        tab.classList.add('active');
        const target = document.getElementById('dash-' + tab.dataset.dashTab);
        if (target) { target.classList.add('active'); target.style.display = 'block'; }
      });
    });

    // File upload
    const uploadZone = document.querySelector('.file-upload');
    if (uploadZone) {
      const input = uploadZone.querySelector('input[type="file"]');
      uploadZone.addEventListener('click', () => input.click());
      uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.style.borderColor = 'var(--color-gold)'; });
      uploadZone.addEventListener('dragleave', () => { uploadZone.style.borderColor = 'var(--color-border)'; });
      uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.style.borderColor = 'var(--color-border)'; const el = uploadZone.querySelector('.file-upload__text'); if (e.dataTransfer.files.length === 1) el.textContent = e.dataTransfer.files[0].name; });
      input.addEventListener('change', () => { const el = uploadZone.querySelector('.file-upload__text'); if (input.files.length === 1) el.textContent = input.files[0].name; });
    }

    initForms();
  