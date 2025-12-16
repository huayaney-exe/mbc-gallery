/**
 * main.js - Galería de Demos Mibanco Colombia
 * Sistema de autenticación y tracking
 */

// ========================================
// CONFIGURACIÓN
// ========================================

const CONFIG = {
  password: 'MBC',
  storageKey: 'mibanco_gallery_auth'
};

// ========================================
// PASSWORD GATE
// ========================================

function initPasswordGate() {
  const gate = document.getElementById('password-gate');
  const form = document.getElementById('password-form');
  const input = document.getElementById('password-input');
  const errorEl = document.getElementById('password-error');
  const mainContent = document.getElementById('main-content');

  // Check if already authenticated
  if (sessionStorage.getItem(CONFIG.storageKey) === 'true') {
    gate.style.display = 'none';
    mainContent.style.display = 'flex';
    return;
  }

  // Show gate, hide content
  gate.style.display = 'flex';
  mainContent.style.display = 'none';

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const enteredPassword = input.value.trim();

    if (enteredPassword === CONFIG.password) {
      // Success
      sessionStorage.setItem(CONFIG.storageKey, 'true');
      gate.style.display = 'none';
      mainContent.style.display = 'flex';
      trackEvent('auth', 'password_success');
    } else {
      // Error
      input.classList.add('password-gate__input--error');
      errorEl.classList.add('visible');
      input.value = '';
      input.focus();
      trackEvent('auth', 'password_error');

      // Remove error state after animation
      setTimeout(() => {
        input.classList.remove('password-gate__input--error');
      }, 500);
    }
  });

  // Focus input on load
  input.focus();
}

// ========================================
// TRACKING (SIMULATED)
// ========================================

function trackEvent(category, action, label = null) {
  const event = {
    timestamp: new Date().toISOString(),
    category,
    action,
    label
  };

  console.log('[TRACKING]', event);

  // In production, this would send to analytics:
  // gtag('event', action, { event_category: category, event_label: label });
}

// Track demo clicks
function initDemoTracking() {
  document.querySelectorAll('.demo-card__actions a').forEach(link => {
    link.addEventListener('click', () => {
      const card = link.closest('.demo-card');
      const title = card.querySelector('.demo-card__title').textContent;
      trackEvent('demo', 'click', title);
    });
  });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.demo-card, .info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Password gate first
  initPasswordGate();

  // Then initialize everything else
  initDemoTracking();
  initScrollAnimations();

  // Track page view
  trackEvent('pageview', 'gallery_demos');

  console.log('Galeria de Demos Mibanco initialized');
});
