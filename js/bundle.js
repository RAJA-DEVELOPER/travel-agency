(() => {
  // js/utils.js
  function throttle(fn, limit = 100) {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }
  function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  }

  // js/navbar.js
  function initNavbar() {
    const navbar = $(".navbar");
    if (!navbar) return;
    const hamburger = $(".hamburger");
    const mobileMenu = $(".mobile-menu");
    const body = document.body;
    let lastScroll = 0;
    const handleScroll = throttle(() => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      if (currentScroll > lastScroll && currentScroll > 300) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = currentScroll;
    }, 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("active");
        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        body.classList.toggle("no-scroll");
        hamburger.setAttribute("aria-expanded", !isOpen);
      });
      $$(".mobile-menu__link", mobileMenu).forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active");
          mobileMenu.classList.remove("active");
          body.classList.remove("no-scroll");
        });
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
          hamburger.classList.remove("active");
          mobileMenu.classList.remove("active");
          body.classList.remove("no-scroll");
        }
      });
      const closeBtn = $(".mobile-menu__close", mobileMenu);
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          hamburger.classList.remove("active");
          mobileMenu.classList.remove("active");
          body.classList.remove("no-scroll");
        });
      }
    }
    $$(".navbar__item", navbar).forEach((item) => {
      const link = $(".navbar__link", item);
      const dropdown = $(".navbar__dropdown", item);
      if (!dropdown) return;
      link.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dropdown.style.opacity = "1";
          dropdown.style.visibility = "visible";
          dropdown.style.transform = "translateY(0)";
        }
      });
      item.addEventListener("focusout", (e) => {
        if (!item.contains(e.relatedTarget)) {
          dropdown.style.opacity = "";
          dropdown.style.visibility = "";
          dropdown.style.transform = "";
        }
      });
    });
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    $$(".navbar__link", navbar).forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPage || currentPage === "" && href === "index.html") {
        link.classList.add("active");
      }
    });
    if (mobileMenu) {
      $$(".mobile-menu__link", mobileMenu).forEach((link) => {
        const href = link.getAttribute("href");
        if (href === currentPage || currentPage === "" && href === "index.html") {
          link.classList.add("active");
        }
      });
    }
    const profileBtns = $$(".navbar__profile-btn");
    profileBtns.forEach((btn) => {
      const dropdown = btn.nextElementSibling;
      if (!dropdown) return;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains("open");
        $$(".navbar__profile-dropdown.open").forEach((d) => d.classList.remove("open"));
        if (!isOpen) {
          dropdown.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        } else {
          btn.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("click", (e) => {
        if (!btn.parentElement.contains(e.target)) {
          dropdown.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // js/hero-slider.js
  function initHeroSlider() {
    const slider = $(".hero__slider");
    if (!slider) return;
    const slides = $$(".hero__slide", slider);
    const dots = $$(".hero__dot");
    const prevBtn = $(".hero__arrow--prev");
    const nextBtn = $(".hero__arrow--next");
    if (slides.length === 0) return;
    let currentIndex = 0;
    let interval = null;
    const DURATION = 6e3;
    function goTo(index) {
      slides.forEach((s) => s.classList.remove("active"));
      dots.forEach((d) => d.classList.remove("active"));
      currentIndex = (index + slides.length) % slides.length;
      slides[currentIndex].classList.add("active");
      if (dots[currentIndex]) dots[currentIndex].classList.add("active");
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
    if (nextBtn) nextBtn.addEventListener("click", () => {
      next();
      startAutoplay();
    });
    if (prevBtn) prevBtn.addEventListener("click", () => {
      prev();
      startAutoplay();
    });
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goTo(i);
        startAutoplay();
      });
    });
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });
    slider.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
      startAutoplay();
    }, { passive: true });
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });
    document.addEventListener("keydown", (e) => {
      const hero = $(".hero");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (e.key === "ArrowRight") {
        next();
        startAutoplay();
      }
      if (e.key === "ArrowLeft") {
        prev();
        startAutoplay();
      }
    });
    goTo(0);
    startAutoplay();
  }

  // js/scroll-reveal.js
  function initScrollReveal() {
    const revealElements = $$(".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children");
    if (!revealElements.length) return;
    const revealAll = () => revealElements.forEach((el) => el.classList.add("revealed"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "50px 0px 50px 0px"
    });
    revealElements.forEach((el) => observer.observe(el));
    setTimeout(revealAll, 1200);
  }

  // js/page-transitions.js
  function initPageTransitions() {
    const overlay = $(".page-transition");
    if (!overlay) return;
    overlay.classList.remove("active");
    $$("a").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || link.target === "_blank") return;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        overlay.classList.add("active");
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    });
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) {
        overlay.classList.remove("active");
      }
    });
  }

  // js/forms.js
  function initForms() {
    initFormValidation();
    initFileUpload();
    initPasswordToggle();
  }
  function initFormValidation() {
    $$("form[data-validate]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;
        $$(".form-input--error", form).forEach((el) => el.classList.remove("form-input--error"));
        $$(".form-error", form).forEach((el) => el.remove());
        $$("[required]", form).forEach((input) => {
          if (!input.value.trim()) {
            isValid = false;
            showError(input, "This field is required");
          }
        });
        $$('input[type="email"]', form).forEach((input) => {
          if (input.value && !isValidEmail(input.value)) {
            isValid = false;
            showError(input, "Please enter a valid email");
          }
        });
        const password = $('input[name="password"]', form);
        const confirm = $('input[name="confirm-password"]', form);
        if (password && confirm && password.value !== confirm.value) {
          isValid = false;
          showError(confirm, "Passwords do not match");
        }
        $$('input[type="tel"]', form).forEach((input) => {
          if (input.value && !isValidPhone(input.value)) {
            isValid = false;
            showError(input, "Please enter a valid phone number");
          }
        });
        if (isValid) {
          const submitBtn = $('button[type="submit"]', form);
          if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            setTimeout(() => {
              submitBtn.textContent = "Sent Successfully!";
              submitBtn.style.background = "var(--color-success)";
              submitBtn.style.color = "#fff";
              setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = "";
                submitBtn.style.color = "";
                form.reset();
              }, 2e3);
            }, 1500);
          }
        }
      });
      $$(".form-input", form).forEach((input) => {
        input.addEventListener("blur", () => {
          const error = input.parentElement.querySelector(".form-error");
          if (error) error.remove();
          input.classList.remove("form-input--error");
          if (input.required && !input.value.trim()) {
            showError(input, "This field is required");
          } else if (input.type === "email" && input.value && !isValidEmail(input.value)) {
            showError(input, "Please enter a valid email");
          }
        });
      });
    });
  }
  function showError(input, message) {
    input.classList.add("form-input--error");
    const existing = input.parentElement.querySelector(".form-error");
    if (existing) existing.remove();
    const error = document.createElement("span");
    error.className = "form-error";
    error.textContent = message;
    input.parentElement.appendChild(error);
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhone(phone) {
    return /^[+]?[\d\s-()]{7,}$/.test(phone);
  }
  function initFileUpload() {
    $$(".file-upload").forEach((zone) => {
      const input = $('input[type="file"]', zone);
      const textEl = $(".file-upload__text", zone);
      if (!input) return;
      zone.addEventListener("click", () => input.click());
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("drag-over");
      });
      zone.addEventListener("dragleave", () => {
        zone.classList.remove("drag-over");
      });
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        const files = e.dataTransfer.files;
        if (files.length) {
          input.files = files;
          updateFileDisplay(textEl, files);
        }
      });
      input.addEventListener("change", () => {
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
  function initPasswordToggle() {
    $$("[data-toggle-password]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.previousElementSibling || btn.parentElement.querySelector("input");
        if (!input) return;
        const type = input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);
        btn.setAttribute("aria-label", type === "password" ? "Show password" : "Hide password");
      });
    });
  }

  // js/app.js
  var ThemeManager = {
    STORAGE_KEY: "luxe-travel-theme",
    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = saved || (prefersDark ? "dark" : "light");
      this.apply(theme);
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.apply(e.matches ? "dark" : "light");
        }
      });
      $$("[data-theme-toggle]").forEach((btn) => {
        btn.addEventListener("click", () => this.toggle());
      });
    },
    apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      this.updateIcons(theme);
    },
    toggle() {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      this.apply(next);
      localStorage.setItem(this.STORAGE_KEY, next);
    },
    updateIcons(theme) {
      $$("[data-theme-toggle]").forEach((btn) => {
        const sunIcon = btn.querySelector(".icon-sun");
        const moonIcon = btn.querySelector(".icon-moon");
        if (sunIcon && moonIcon) {
          sunIcon.style.display = theme === "dark" ? "block" : "none";
          moonIcon.style.display = theme === "dark" ? "none" : "block";
        }
      });
    }
  };
  var RTLManager = {
    STORAGE_KEY: "luxe-travel-dir",
    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        document.documentElement.setAttribute("dir", saved);
      }
      $$("[data-rtl-toggle]").forEach((btn) => {
        btn.addEventListener("click", () => this.toggle());
      });
    },
    toggle() {
      const current = document.documentElement.getAttribute("dir") || "ltr";
      const next = current === "rtl" ? "ltr" : "rtl";
      document.documentElement.setAttribute("dir", next);
      localStorage.setItem(this.STORAGE_KEY, next);
    }
  };
  function initAccordions() {
    $$(".accordion").forEach((accordion) => {
      const items = $$(".accordion__item", accordion);
      items.forEach((item) => {
        const trigger = $(".accordion__trigger", item);
        const content = $(".accordion__content", item);
        if (!trigger || !content) return;
        trigger.addEventListener("click", () => {
          const isOpen = item.classList.contains("active");
          items.forEach((i) => {
            i.classList.remove("active");
            const c = $(".accordion__content", i);
            if (c) c.style.maxHeight = "0";
          });
          if (!isOpen) {
            item.classList.add("active");
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      });
    });
  }
  function initTabs() {
    $$("[data-tabs]").forEach((tabContainer) => {
      const buttons = $$(".tab-btn", tabContainer);
      const parentSection = tabContainer.closest("[data-tab-group]") || tabContainer.parentElement;
      const panels = $$(".tab-panel", parentSection);
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = btn.dataset.tab;
          buttons.forEach((b) => b.classList.remove("active"));
          panels.forEach((p) => p.classList.remove("active"));
          btn.classList.add("active");
          const targetPanel = $(`#${target}`, parentSection);
          if (targetPanel) targetPanel.classList.add("active");
        });
      });
    });
  }
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href === "#") return;
        const target = $(href);
        if (target) {
          e.preventDefault();
          const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height-scrolled")) || 64;
          const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  }
  function initCounters() {
    const counters = $$("[data-counter]");
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = "true";
          const target = parseInt(entry.target.dataset.counter, 10);
          const suffix = entry.target.dataset.suffix || "";
          const prefix = entry.target.dataset.prefix || "";
          animateValue(entry.target, target, prefix, suffix);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach((c) => observer.observe(c));
  }
  function animateValue(el, target, prefix, suffix, duration = 2e3) {
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
  function initBackToTop() {
    const btn = $("#back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
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
})();
