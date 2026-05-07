/* ═══════════════════════════════════════════════
   S.I.D.E. with Sid! — Campaign JS
   ═══════════════════════════════════════════════ */
'use strict';

/* ── NAVBAR ── */
(function initNav() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('navBurger');
  const links   = document.getElementById('navLinks');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Burger
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', e => {
      if (e.target.closest('.nav-link')) {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  function markActive() {
    const scrollY = window.scrollY;
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', markActive, { passive: true });
  markActive();
})();

/* ── SMOOTH SCROLL ── */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  const offset = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-h'), 10) || 70;
  window.scrollTo({ top: target.offsetTop - offset - 8, behavior: 'smooth' });
});

/* ── SCROLL ANIMATIONS ── */
(function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-animate]');

  if (prefersReduced) {
    els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ── HERO LETTER HOVER LABELS ── */
(function initLetterTooltips() {
  const labels = {
    S: 'Statewide Service',
    I: 'Integrating Chapters',
    D: 'Drawing from Community',
    E: 'Elevating Spirit'
  };
  document.querySelectorAll('.big-letter').forEach(el => {
    const letter = el.textContent.trim();
    el.setAttribute('title', labels[letter] || '');
    el.setAttribute('aria-label', `${letter} — ${labels[letter] || ''}`);
    el.style.cursor = 'default';
  });
})();

/* ── HERO SCROLL HINT FADE ── */
(function () {
  const hint = document.querySelector('.hero-scroll');
  if (!hint) return;
  window.addEventListener('scroll', () => {
    hint.style.opacity = window.scrollY > 100 ? '0' : '0.6';
  }, { passive: true });
})();

/* ── SIDE CARD CLICK → SCROLL TO PLATFORM ── */
(function initSideCards() {
  // Each pillar card, clicking scrolls to it (already visible, but bounce-highlight)
  document.querySelectorAll('.side-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(1.02) translateY(-6px)';
      setTimeout(() => { card.style.transform = ''; }, 300);
    });
  });
})();

/* ── STAGGER SIDE CARDS on load ── */
(function staggerCards() {
  const cards = document.querySelectorAll('.side-card, .spirit-card, .service-card, .about-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach(c => {
    if (!c.hasAttribute('data-animate')) {
      c.setAttribute('data-animate', 'fade-up');
      obs.observe(c);
    }
  });
})();
