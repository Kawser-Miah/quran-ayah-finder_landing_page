'use strict';

/* =====================================================
   QURAN AYAH FINDER — Main JavaScript
   All content is loaded from data/content.json
   ===================================================== */

// =====================================================
// THEME (runs immediately to prevent flash)
// =====================================================
(function () {
  const stored = localStorage.getItem('qaf-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const sunSvg  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('qaf-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  // Set icon to match current stored theme
  applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// =====================================================
// MOBILE MENU
// =====================================================
function setupMobileMenu() {
  const btn  = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const menuIconSvg  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  const closeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.innerHTML = isOpen ? closeIconSvg : menuIconSvg;
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.innerHTML = menuIconSvg;
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// =====================================================
// STICKY NAVBAR SHADOW
// =====================================================
function setupNavScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// =====================================================
// SMOOTH SCROLL
// =====================================================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 68;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight - 16, behavior: 'smooth' });
      }
    });
  });
}

// =====================================================
// SCROLL REVEAL
// =====================================================
function setupScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

// =====================================================
// COUNT-UP ANIMATION
// =====================================================
function animateCountUp(el) {
  const raw    = el.getAttribute('data-target') || el.textContent;
  const hasPlus = raw.includes('+');
  const target  = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(target)) return;

  const duration  = 1800;
  const startTime = performance.now();

  (function update(now) {
    const eased  = 1 - Math.pow(1 - Math.min((now - startTime) / duration, 1), 3);
    const current = Math.round(eased * target);
    el.textContent = (current >= 1000 ? current.toLocaleString() : current) + (hasPlus ? '+' : '');
    if (eased < 1) requestAnimationFrame(update);
  })(startTime);
}

function setupCountUp() {
  const els = document.querySelectorAll('.countup');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCountUp(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  els.forEach(el => observer.observe(el));
}

// =====================================================
// DONATION BUTTONS + PROGRESS BAR
// =====================================================
function setupDonation(donation) {
  const btns = document.querySelectorAll('.donation-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  if (btns.length >= 2) btns[1].classList.add('active');

  const fill = document.querySelector('.progress-bar-fill');
  if (!fill || !donation) return;
  const pct = Math.round((donation.raised / donation.monthlyGoal) * 100);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { fill.style.width = pct + '%'; observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  observer.observe(fill);
}

// =====================================================
// FOOTER YEAR + LANGUAGE BUTTONS
// =====================================================
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

function setupLanguageButtons() {
  const btns = document.querySelectorAll('.footer-lang-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  if (btns.length) btns[0].classList.add('active');
}

// =====================================================
// ACTIVE NAV ON SCROLL
// =====================================================
function setupActiveNavOnScroll() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active-nav', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
}

const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `.nav-links a.active-nav { color: var(--primary); font-weight: 600; }`;
document.head.appendChild(activeNavStyle);

// =====================================================
// RENDER: FEATURES GRID  (from content.json)
// =====================================================
const cornerOrnamentSvg = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L8 0 L0 8 Z" opacity="0.6"/><path d="M0 0 L14 0 L0 14 Z" opacity="0.3"/></svg>`;

function renderFeaturesGrid(features) {
  const grid = document.getElementById('features-grid');
  if (!grid || !features) return;
  grid.innerHTML = features.map((f, i) => `
    <div class="feature-card reveal" style="transition-delay:${(i % 4) * 0.08}s" role="listitem">
      <span class="card-corner-ornament tl" aria-hidden="true">${cornerOrnamentSvg}</span>
      <span class="card-corner-ornament br" aria-hidden="true">${cornerOrnamentSvg}</span>
      <span class="feature-card-icon">${f.icon}</span>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </div>`).join('');
}

// =====================================================
// RENDER: STATS BAR  (from content.json)
// =====================================================
function renderStats(stats) {
  const grid = document.getElementById('stats-grid');
  if (!grid || !stats) return;
  grid.innerHTML = stats.map(s => `
    <div class="stat-item">
      <div class="stat-num countup" data-target="${s.num}">${s.num}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');
}

// =====================================================
// RENDER: TOP SEARCHES  (from content.json)
// =====================================================
function renderTopSearches(topSearches) {
  const list = document.getElementById('top-searches-list');
  if (!list || !topSearches) return;
  list.innerHTML = topSearches.map(s => `
    <div class="search-item reveal" role="listitem">
      <div class="search-rank">${s.rank}</div>
      <div class="search-info">
        <div class="search-query">${s.query}</div>
        <div class="search-date">${s.date}</div>
      </div>
      <span class="search-arrow">›</span>
    </div>`).join('');
}

// =====================================================
// RENDER: TESTIMONIALS  (from content.json)
// =====================================================
function renderTestimonials(testimonials) {
  const grid = document.getElementById('testimonials-grid');
  if (!grid || !testimonials) return;
  const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  grid.innerHTML = testimonials.map((t, i) => `
    <div class="testimonial-card reveal delay-${i + 1}">
      <div class="testimonial-stars">${starSvg.repeat(t.stars)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.initials}</div>
        <div class="testimonial-author-info">
          <h4>${t.name}</h4>
          <p>${t.location}</p>
        </div>
      </div>
    </div>`).join('');
}

// =====================================================
// RENDER: DOWNLOAD LINKS  (from content.json)
// =====================================================
function renderDownloadLinks(app) {
  if (!app) return;
  document.querySelectorAll('[data-play-store]').forEach(el => {
    el.href = app.playStoreUrl || '#';
  });
  document.querySelectorAll('[data-app-store]').forEach(el => {
    el.href = app.appStoreUrl || '#';
  });
}

// =====================================================
// RENDER: FOOTER  (from content.json)
// =====================================================
function renderFooter(footer) {
  if (!footer) return;

  // App links
  const appLinksEl = document.getElementById('footer-app-links');
  if (appLinksEl && footer.appLinks) {
    appLinksEl.innerHTML = footer.appLinks.map(link =>
      `<li><a href="#${link.toLowerCase()}">${link}</a></li>`
    ).join('');
  }

  // Resource links
  const resLinksEl = document.getElementById('footer-resource-links');
  if (resLinksEl && footer.resourceLinks) {
    resLinksEl.innerHTML = footer.resourceLinks.map(link =>
      `<li><a href="${link.url}">${link.label}</a></li>`
    ).join('');
  }

  // Language buttons
  const langEl = document.getElementById('footer-languages');
  if (langEl && footer.languages) {
    langEl.innerHTML = footer.languages.map((lang, i) =>
      `<button class="footer-lang-btn${i === 0 ? ' active' : ''}" data-lang="${lang.code}">${lang.label}</button>`
    ).join('');
  }

  // Copyright — use innerHTML so the nested #footer-year span survives;
  // setFooterYear() will overwrite the year number afterwards.
  const copyrightEl = document.getElementById('footer-copyright');
  if (copyrightEl && footer.copyright) {
    // Replace only the text, keeping the footer-year span intact
    const yearSpan = copyrightEl.querySelector('#footer-year');
    const yearHtml = yearSpan ? yearSpan.outerHTML : `<span id="footer-year">${new Date().getFullYear()}</span>`;
    // footer.copyright starts with "© 20XX …"; swap in the live year span
    copyrightEl.innerHTML = footer.copyright.replace(/©\s*\d{4}/, '© ' + yearHtml);
  }

  // Social icons
  const socialEl = document.getElementById('footer-social');
  const svgPaths = {
    facebook:  `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
    instagram: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>`,
    twitter:   `<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>`,
    youtube:   `<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>`,
  };
  if (socialEl && footer.social) {
    socialEl.innerHTML = footer.social.map(s => `
      <a href="${s.url}" aria-label="${s.label}" class="social-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${svgPaths[s.icon] || ''}
        </svg>
      </a>`).join('');
  }
}

// =====================================================
// RENDER: DONATION AMOUNTS  (from content.json)
// =====================================================
function renderDonationAmounts(donation) {
  const container = document.getElementById('donation-amounts');
  if (!container || !donation) return;

  const buttons = [...(donation.amounts || []).map(amt =>
    `<button class="donation-btn" data-amount="${amt}">${donation.currency}${amt}</button>`
  ), `<button class="donation-btn" data-amount="custom">Custom</button>`];

  container.innerHTML = buttons.join('');

  // Update progress label
  const label = document.getElementById('donation-progress-label');
  if (label) {
    const pct = Math.round((donation.raised / donation.monthlyGoal) * 100);
    label.textContent = `${donation.currency}${donation.raised} raised of ${donation.currency}${donation.monthlyGoal} monthly goal (${pct}%)`;
  }

  // Update CTA link
  const cta = document.getElementById('donation-cta');
  if (cta && donation.donateUrl) cta.href = donation.donateUrl;
}

// =====================================================
// LOAD content.json → RENDER EVERYTHING → SETUP UI
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  fetch('data/content.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load content.json — status ' + res.status);
      return res.json();
    })
    .then(data => {
      // Render all dynamic sections
      renderStats(data.stats);
      renderFeaturesGrid(data.features);
      renderTopSearches(data.topSearches);
      renderTestimonials(data.testimonials);
      renderDonationAmounts(data.donation);
      renderDownloadLinks(data.app);
      renderFooter(data.footer);

      // Setup all interactions (must come after dynamic render)
      setupThemeToggle();
      setupMobileMenu();
      setupNavScroll();
      setupSmoothScroll();
      setupScrollReveal();
      setupCountUp();
      setupDonation(data.donation);
      setupLanguageButtons();
      setupActiveNavOnScroll();
      setFooterYear();

      // Re-run observers after dynamic content is in the DOM
      setTimeout(() => { setupScrollReveal(); setupCountUp(); }, 100);
    })
    .catch(err => {
      console.error('[Quran Ayah Finder]', err.message);
      console.warn('Tip: open this site via a local server (e.g. `python3 -m http.server 8080`) so content.json can be fetched.');

      // Still wire up non-data interactions so the page is not broken
      setupThemeToggle();
      setupMobileMenu();
      setupNavScroll();
      setupSmoothScroll();
      setupScrollReveal();
      setupCountUp();
      setupDonation(null);
      setupLanguageButtons();
      setupActiveNavOnScroll();
      setFooterYear();
    });
});
