/* ==========================================================================
   FORMS — Validation, File Upload
   ========================================================================== */

import { $, $$ } from './utils.js';

export function initForms() {
  initFormValidation();
  initFileUpload();
  initPasswordToggle();
}

/**
 * Form Validation
 */
function initFormValidation() {
  $$('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      $$('.form-input--error', form).forEach(el => el.classList.remove('form-input--error'));
      $$('.form-error', form).forEach(el => el.remove());

      // Validate required fields
      $$('[required]', form).forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          showError(input, 'This field is required');
        }
      });

      // Validate email
      $$('input[type="email"]', form).forEach(input => {
        if (input.value && !isValidEmail(input.value)) {
          isValid = false;
          showError(input, 'Please enter a valid email');
        }
      });

      // Validate password match
      const password = $('input[name="password"]', form);
      const confirm = $('input[name="confirm-password"]', form);
      if (password && confirm && password.value !== confirm.value) {
        isValid = false;
        showError(confirm, 'Passwords do not match');
      }

      // Validate phone
      $$('input[type="tel"]', form).forEach(input => {
        if (input.value && !isValidPhone(input.value)) {
          isValid = false;
          showError(input, 'Please enter a valid phone number');
        }
      });

      if (isValid) {
        // Simulate submission
        const submitBtn = $('button[type="submit"]', form);
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;

          setTimeout(() => {
            submitBtn.textContent = 'Sent Successfully!';
            submitBtn.style.background = 'var(--color-success)';
            submitBtn.style.color = '#fff';

            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
              submitBtn.style.background = '';
              submitBtn.style.color = '';
              form.reset();
            }, 2000);
          }, 1500);
        }
      }
    });

    // Live validation on input
    $$('.form-input', form).forEach(input => {
      input.addEventListener('blur', () => {
        const error = input.parentElement.querySelector('.form-error');
        if (error) error.remove();
        input.classList.remove('form-input--error');

        if (input.required && !input.value.trim()) {
          showError(input, 'This field is required');
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
          showError(input, 'Please enter a valid email');
        }
      });
    });
  });
}

function showError(input, message) {
  input.classList.add('form-input--error');
  const existing = input.parentElement.querySelector('.form-error');
  if (existing) existing.remove();
  const error = document.createElement('span');
  error.className = 'form-error';
  error.textContent = message;
  input.parentElement.appendChild(error);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[+]?[\d\s-()]{7,}$/.test(phone);
}

/**
 * File Upload (Drag & Drop)
 */
function initFileUpload() {
  $$('.file-upload').forEach(zone => {
    const input = $('input[type="file"]', zone);
    const textEl = $('.file-upload__text', zone);

    if (!input) return;

    // Click to upload
    zone.addEventListener('click', () => input.click());

    // Drag events
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
      const files = e.dataTransfer.files;
      if (files.length) {
        input.files = files;
        updateFileDisplay(textEl, files);
      }
    });

    // File selected
    input.addEventListener('change', () => {
      updateFileDisplay(textEl, input.files);
    });
  });
}

function updateFileDisplay(el, files) {
  if (!el) return;
  if (files.length === 1) {
    el.textContent = files[0].name;
  } else if (files.length > 1) {
    el.textContent = `${files.length} files selected`;
  }
}

/**
 * Password visibility toggle
 */
function initPasswordToggle() {
  $$('[data-toggle-password]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (!input) return;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      btn.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
    });
  });
}
