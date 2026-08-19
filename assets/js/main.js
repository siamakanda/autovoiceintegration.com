(function () {
  'use strict';

  var header = document.querySelector('[data-header]');
  var navToggle = document.querySelector('[data-nav-toggle]');
  var primaryNav = document.querySelector('[data-primary-nav]');
  var yearEl = document.querySelector('[data-year]');
  var form = document.querySelector('[data-form]');
  var formTime = document.querySelector('[data-form-time]');
  var submitButton = document.querySelector('[data-submit-button]');
  var formStatus = document.querySelector('[data-form-status]');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (header) {
    var updateHeader = function () {
      if (window.scrollY > 8) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  if (navToggle && primaryNav) {
    var closeNav = function () {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      primaryNav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeNav();
      }
    });
  }

  var accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('[data-accordion-item]');
      var isOpen = item.classList.contains('is-open');

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  var revealItems = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') {
        return;
      }

      var target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
      window.scrollTo({ top: top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  if (formTime) {
    formTime.value = String(Date.now());
  }

  if (form) {
    var setStatus = function (message, type) {
      formStatus.textContent = message;
      formStatus.className = 'form-status ' + type;
    };

    var clearError = function (field) {
      field.removeAttribute('aria-invalid');
    };

    var validateField = function (field) {
      if (field.hasAttribute('required')) {
        if (!field.value.trim()) {
          field.setAttribute('aria-invalid', 'true');
          return false;
        }
      }

      if (field.type === 'email' && field.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          field.setAttribute('aria-invalid', 'true');
          return false;
        }
      }

      clearError(field);
      return true;
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var fields = form.querySelectorAll('[required]');
      var isValid = true;

      fields.forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        setStatus('Please complete the required fields correctly.', 'is-error');
        return;
      }

      var formData = new FormData(form);
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      setStatus('Sending your request...', '');

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          return response.json().catch(function () {
            return { ok: false, message: 'There was a problem submitting the form.' };
          });
        })
        .then(function (data) {
          if (data && data.ok) {
            setStatus('Thank you. Your demo request has been sent.', 'is-success');
            form.reset();
            if (formTime) {
              formTime.value = String(Date.now());
            }
          } else {
            setStatus(data.message || 'There was a problem submitting the form. Please try again.', 'is-error');
          }
        })
        .catch(function () {
          setStatus('Network error. Please try again or email us directly.', 'is-error');
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.textContent = 'Request My Demo';
        });
    });

    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        clearError(field);
      });

      field.addEventListener('change', function () {
        clearError(field);
      });
    });
  }
})();
