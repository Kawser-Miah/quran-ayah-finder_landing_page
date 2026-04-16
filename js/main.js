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

function updatePhoneImages(theme) {
  document.querySelectorAll('.phone-screen-content img[data-light-src]').forEach(img => {
    const src = theme === 'dark' ? img.dataset.darkSrc : img.dataset.lightSrc;
    if (src) img.src = src;
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('qaf-theme', theme);
  updatePhoneImages(theme);
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
// RENDER: APP INFO  (rating, downloads from content.json)
// =====================================================
function renderAppInfo(app) {
  if (!app) return;
  if (app.rating) {
    document.querySelectorAll('[data-app-rating]').forEach(el => {
      el.textContent = app.rating;
    });
  }
  if (app.downloads) {
    document.querySelectorAll('[data-app-downloads]').forEach(el => {
      el.textContent = app.downloads;
    });
  }
}

// =====================================================
// RENDER: QR CODES  (from content.json store URLs)
// =====================================================
function renderQRCodes(app) {
  const container = document.getElementById('dl-qr-codes');
  if (!container || typeof QRCode === 'undefined') return;

  const playIconSvg = '<svg viewBox="0 0 512 512" fill="#0D5C46" xmlns="http://www.w3.org/2000/svg"><path d="M48 59.49v393a4.33 4.33 0 0 0 7.37 3.07L260 256 55.37 56.42A4.33 4.33 0 0 0 48 59.49zM345.8 174L89.22 32.64l-.16-.09c-4.42-2.4-8.62 3.58-5 7.06L285.19 231.93zM84.08 472.39c-3.64 3.48.56 9.46 5 7.06l.16-.09L345.8 338l-60.61-57.95zM449.38 231l-71.65-39.46L310.36 256l67.37 64.43L449.38 281c19.49-10.77 19.49-39.23 0-50z"/></svg>';
  const appleIconSvg = '<svg viewBox="0 0 24 24" fill="#0D5C46" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';

  const stores = [
    { url: app.playStoreUrl, label: 'Google Play', icon: playIconSvg },
    { url: app.appStoreUrl,  label: 'App Store',   icon: appleIconSvg }
  ].filter(s => s.url && s.url !== '#');

  if (!stores.length) return;
  container.innerHTML = '';

  stores.forEach(({ url, label, icon }) => {
    const item = document.createElement('div');
    item.className = 'dl-qr-item';

    const box = document.createElement('div');
    box.className = 'dl-qr-box';

    // H-level error correction so the center logo doesn't break scanning
    new QRCode(box, {
      text: url,
      width: 128,
      height: 128,
      colorDark:  '#0D5C46',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.H
    });

    // QRCode.js appends both <canvas> AND <img> — remove canvas to avoid duplicates
    setTimeout(() => {
      const canvas = box.querySelector('canvas');
      if (canvas) canvas.remove();

      // Centred store icon overlay
      const logo = document.createElement('div');
      logo.className = 'dl-qr-logo';
      logo.innerHTML = icon;
      box.appendChild(logo);
    }, 50);

    const lbl = document.createElement('span');
    lbl.className = 'dl-qr-label';
    lbl.textContent = label;

    item.appendChild(box);
    item.appendChild(lbl);
    container.appendChild(item);
  });
}

// =====================================================
// RENDER: DOWNLOAD LINKS  (from content.json)
// =====================================================
function renderDownloadLinks(app) {
  if (!app) return;
  document.querySelectorAll('[data-play-store]').forEach(el => {
    el.href = app.playStoreUrl || '#';
    if (app.playStoreUrl && app.playStoreUrl !== '#') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });
  document.querySelectorAll('[data-app-store]').forEach(el => {
    el.href = app.appStoreUrl || '#';
    if (app.appStoreUrl && app.appStoreUrl !== '#') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
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
    facebook:  { d: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`, filled: false },
    instagram: { d: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>`, filled: false },
    twitter:   { d: `<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>`, filled: false },
    youtube:   { d: `<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>`, filled: false },
    whatsapp:  { d: `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>`, filled: true },
  };
  if (socialEl && footer.social) {
    socialEl.innerHTML = footer.social.map(s => {
      const icon = svgPaths[s.icon];
      const target = s.url && s.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
      const svgAttrs = icon && icon.filled
        ? `fill="currentColor"`
        : `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
      return `<a href="${s.url}" aria-label="${s.label}" class="social-btn" ${target}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${svgAttrs} aria-hidden="true">
          ${icon ? icon.d : ''}
        </svg>
      </a>`;
    }).join('');
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
      renderAppInfo(data.app);
      renderDownloadLinks(data.app);
      renderQRCodes(data.app);
      renderFooter(data.footer);

      // Setup all interactions (must come after dynamic render)
      updatePhoneImages(document.documentElement.getAttribute('data-theme') || 'light');
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

      setupWhatsAppStrip();
      // Re-run observers after dynamic content is in the DOM
      setTimeout(() => { setupScrollReveal(); setupCountUp(); }, 100);
    })
    .catch(err => {
      console.error('[Quran Ayah Finder]', err.message);
      console.warn('Tip: open this site via a local server (e.g. `python3 -m http.server 8080`) so content.json can be fetched.');

      // Still wire up non-data interactions so the page is not broken
      updatePhoneImages(document.documentElement.getAttribute('data-theme') || 'light');
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
      setupWhatsAppStrip();
      // Fallback: use hardcoded URLs from content.json
      renderQRCodes({
        playStoreUrl: 'https://play.google.com/store/apps/details?id=xyz.brainbo.quranicsolution',
        appStoreUrl:  'https://apps.apple.com/us/app/quran-ayah-finder/id6748535211'
      });
    });
})();

// =====================================================
// WHATSAPP CHANNEL STRIP DISMISS
// =====================================================
function setupWhatsAppStrip() {
  const strip = document.getElementById('wa-strip');
  const closeBtn = document.getElementById('wa-strip-close');
  if (!strip || !closeBtn) return;

  // Hide if already dismissed this session
  if (sessionStorage.getItem('wa-strip-dismissed')) {
    strip.remove();
    return;
  }

  closeBtn.addEventListener('click', () => {
    strip.style.transition = 'max-height 0.35s ease, opacity 0.35s ease, padding 0.35s ease';
    strip.style.maxHeight = strip.offsetHeight + 'px';
    strip.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      strip.style.maxHeight = '0';
      strip.style.opacity = '0';
      strip.style.padding = '0';
    });
    setTimeout(() => strip.remove(), 380);
    sessionStorage.setItem('wa-strip-dismissed', '1');
  });
}
