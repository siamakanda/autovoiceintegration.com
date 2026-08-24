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

  var scrollProgress = document.querySelector('[data-scroll-progress]');
  var backToTop = document.querySelector('[data-back-to-top]');
  var mobileCta = document.querySelector('[data-mobile-cta]');
  var demoSection = document.getElementById('demo');
  var navSections = ['how-it-works', 'features', 'pricing', 'faq'];
  var navLinks = {};

  if (primaryNav) {
    navSections.forEach(function (id) {
      var link = primaryNav.querySelector('a[href="#' + id + '"]');
      if (link) {
        navLinks[id] = link;
      }
    });
  }

  var updateScrollUi = function () {
    var scrollY = window.scrollY || window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollProgress) {
      var progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      scrollProgress.style.width = (progress * 100) + '%';
    }

    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollY > 600);
    }

    if (mobileCta) {
      var showCta = scrollY > window.innerHeight * 0.6;
      if (demoSection) {
        showCta = showCta && demoSection.getBoundingClientRect().top > window.innerHeight * 0.9;
      }
      mobileCta.classList.toggle('is-visible', showCta);
    }

    if (header) {
      var navHeaderHeight = header.offsetHeight;
      var currentId = '';
      navSections.forEach(function (id) {
        var section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= navHeaderHeight + 120) {
          currentId = id;
        }
      });

      Object.keys(navLinks).forEach(function (id) {
        navLinks[id].classList.toggle('is-active', id === currentId);
      });
    }
  };

  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', updateScrollUi, { passive: true });
  updateScrollUi();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

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

      if (field.type === 'tel' && field.value.trim()) {
        var phonePattern = /^[0-9\s\-().]{6,20}$/;
        if (!phonePattern.test(field.value.trim())) {
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

  var escapeHtml = function (value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };

  var countrySelects = document.querySelectorAll('[data-country-select]');
  countrySelects.forEach(function (root) {
    var source = root.querySelector('[data-country-select-source]');
    var trigger = root.querySelector('[data-country-trigger]');
    var menu = root.querySelector('[data-country-menu]');
    var search = root.querySelector('[data-country-search]');
    var list = root.querySelector('[data-country-list]');
    var flagEl = root.querySelector('.country-select-flag');
    var codeEl = root.querySelector('[data-country-code-label]');

    if (!source || !trigger || !menu || !search || !list || !flagEl || !codeEl) {
      return;
    }

    var items = [];
    Array.prototype.forEach.call(source.options, function (option) {
      items.push({
        value: option.value,
        code: (option.getAttribute('data-code') || '').toUpperCase(),
        name: option.getAttribute('data-name') || option.textContent,
        dial: option.getAttribute('data-dial') || option.value
      });
    });

    var flagFromCode = function (code) {
      if (!code || code.length !== 2) {
        return '';
      }
      return String.fromCodePoint.apply(null, code.toUpperCase().split('').map(function (ch) {
        return 127397 + ch.charCodeAt(0);
      }));
    };

    var selectedIndex = source.selectedIndex;
    var activeIndex = -1;
    var optionEls = [];

    var updateTrigger = function () {
      var item = items[selectedIndex];
      if (!item) {
        return;
      }
      flagEl.textContent = flagFromCode(item.code);
      codeEl.textContent = item.dial;
    };

    var setActive = function () {
      optionEls.forEach(function (el, index) {
        el.classList.toggle('is-active', index === activeIndex);
      });
      var activeEl = activeIndex >= 0 ? optionEls[activeIndex] : null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
        list.setAttribute('aria-activedescendant', activeEl.id);
      } else {
        list.removeAttribute('aria-activedescendant');
      }
    };

    var render = function () {
      var filter = search.value.trim().toLowerCase();
      var html = '';
      var visible = [];

      items.forEach(function (item, index) {
        var hay = (item.name + ' ' + item.code + ' ' + item.dial).toLowerCase();
        if (filter && hay.indexOf(filter) === -1) {
          return;
        }
        var selected = index === selectedIndex;
        html += '<li role="option" id="cs-opt-' + index + '" data-index="' + index + '" aria-selected="' + selected + '"'
          + ' class="country-select-option' + (selected ? ' is-selected' : '') + '">'
          + '<span class="country-flag" aria-hidden="true">' + flagFromCode(item.code) + '</span>'
          + '<span class="country-name">' + escapeHtml(item.name) + '</span>'
          + '<span class="country-dial">' + escapeHtml(item.dial) + '</span>'
          + '</li>';
        visible.push(index);
      });

      if (!html) {
        html = '<li class="country-select-empty">No matching country</li>';
      }

      list.innerHTML = html;
      optionEls = Array.prototype.slice.call(list.querySelectorAll('[data-index]'));
      activeIndex = visible.indexOf(selectedIndex);
      setActive();
    };

    var openMenu = function () {
      root.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      search.value = '';
      render();
      search.focus();
    };

    var closeMenu = function (returnFocus) {
      root.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) {
        trigger.focus();
      }
    };

    var commit = function (index) {
      source.selectedIndex = index;
      selectedIndex = index;
      updateTrigger();
      closeMenu(true);
    };

    var selectActive = function () {
      if (optionEls.length === 0) {
        return;
      }
      if (activeIndex < 0) {
        activeIndex = 0;
      }
      var el = optionEls[activeIndex];
      commit(parseInt(el.getAttribute('data-index'), 10));
    };

    trigger.addEventListener('click', function () {
      if (root.classList.contains('is-open')) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    list.addEventListener('click', function (event) {
      var option = event.target.closest('[data-index]');
      if (!option) {
        return;
      }
      commit(parseInt(option.getAttribute('data-index'), 10));
    });

    list.addEventListener('mousemove', function (event) {
      var option = event.target.closest('[data-index]');
      if (!option) {
        return;
      }
      var index = optionEls.indexOf(option);
      if (index !== activeIndex) {
        activeIndex = index;
        setActive();
      }
    });

    search.addEventListener('input', function () {
      render();
    });

    search.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex = Math.min(activeIndex + 1, optionEls.length - 1);
        setActive();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        setActive();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        selectActive();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
      }
    });

    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) {
        closeMenu(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && root.classList.contains('is-open')) {
        closeMenu(true);
      }
    });

    updateTrigger();
  });
})();
