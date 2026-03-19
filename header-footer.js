/**
 * Qualia — Shared Header & Footer Injector
 * Injects the canonical nav and footer into every page.
 * Usage: include this script in <head> with defer, then place
 *   <div id="site-header"></div>  as the first element inside <body>
 *   <div id="site-footer"></div>  as the last element before </body>
 *
 * Active-page detection: the script compares the current filename
 * to known page filenames and adds class="active" to the matching link.
 *
 * CSS injection: nav + footer CSS is injected into <head> so pages that
 * were built with a different header/footer design (e.g. blog-archive)
 * still render correctly. Pages that already have .nav / .footer CSS
 * are unaffected — duplicate rules are simply overridden by specificity.
 */
(function () {
  'use strict';

  /* ── Shared CSS for nav + footer ─────────────────────────── */
  var SHARED_CSS = [
    /* --- Design tokens (only set if not already defined) --- */
    ':root {',
    '  --nav-orange: #E8863A;',
    '  --nav-parchment: #FAF6F1;',
    '  --nav-warm-dark: #1C1917;',
    '  --nav-font-display: \'Fraunces\', \'Noto Serif Hebrew\', serif;',
    '  --nav-font-body: \'DM Sans\', \'Noto Sans Hebrew\', sans-serif;',
    '}',

    /* --- Skip link (visible on focus only) --- */
    '.skip-link {',
    '  position: absolute;',
    '  top: -40px;',
    '  right: 0;',
    '  background: var(--nav-orange);',
    '  color: var(--nav-warm-dark);',
    '  padding: 8px 16px;',
    '  z-index: 10001;',
    '  border-radius: 0 0 8px 8px;',
    '  font-weight: 500;',
    '  transition: top 0.2s;',
    '  text-decoration: none;',
    '  font-family: var(--nav-font-body);',
    '  font-size: 0.875rem;',
    '}',
    '.skip-link:focus {',
    '  top: 0;',
    '}',

    /* --- Global focus-visible ring --- */
    ':focus-visible {',
    '  outline: 2px solid var(--nav-orange);',
    '  outline-offset: 3px;',
    '  border-radius: 4px;',
    '}',

    /* --- Nav base --- */
    '.nav {',
    '  position: fixed;',
    '  top: 0;',
    '  left: 0;',
    '  right: 0;',
    '  z-index: 1000;',
    '  padding: 1.8rem 3.5rem;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  transition: all 0.5s cubic-bezier(0.33, 1, 0.68, 1);',
    '}',
    '.nav.scrolled {',
    '  background: rgba(250, 246, 241, 0.92);',
    '  backdrop-filter: blur(20px);',
    '  -webkit-backdrop-filter: blur(20px);',
    '  padding: 1rem 3.5rem;',
    '  box-shadow: 0 1px 0 rgba(0,0,0,0.04);',
    '}',
    '.nav-logo {',
    '  font-family: var(--nav-font-display);',
    '  font-weight: 900;',
    '  font-size: 1.6rem;',
    '  color: var(--nav-warm-dark);',
    '  text-decoration: none;',
    '  letter-spacing: -0.02em;',
    '  transition: opacity 0.3s;',
    '}',
    '.hero-active .nav-logo { color: white; }',
    '.nav.scrolled .nav-logo { color: var(--nav-warm-dark); }',
    '.nav-links {',
    '  display: flex;',
    '  gap: 2.5rem;',
    '  list-style: none;',
    '  align-items: center;',
    '}',
    '.nav-links a {',
    '  font-family: var(--nav-font-body);',
    '  font-size: 0.85rem;',
    '  font-weight: 400;',
    '  color: var(--nav-warm-dark);',
    '  text-decoration: none;',
    '  position: relative;',
    '  transition: color 0.3s;',
    '}',
    '.hero-active .nav-links a { color: rgba(255,255,255,0.8); }',
    '.nav.scrolled .nav-links a { color: var(--nav-warm-dark); }',
    '.nav-links a::after {',
    '  content: \'\';',
    '  position: absolute;',
    '  bottom: -4px;',
    '  right: 0;',
    '  width: 0;',
    '  height: 2px;',
    '  background: var(--nav-orange);',
    '  border-radius: 1px;',
    '  transition: width 0.4s cubic-bezier(0.33, 1, 0.68, 1);',
    '}',
    '.nav-links a:hover::after,',
    '.nav-links a.active::after { width: 100%; }',
    '.nav-links a.active { color: var(--nav-warm-dark); }',
    '.nav-cta-btn {',
    '  font-family: var(--nav-font-body) !important;',
    '  font-weight: 500 !important;',
    '  font-size: 0.85rem !important;',
    '  padding: 0.7rem 1.8rem;',
    '  background: var(--nav-orange);',
    '  color: var(--nav-warm-dark) !important;',
    '  border-radius: 100px;',
    '  transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);',
    '  box-shadow: 0 2px 12px rgba(232, 134, 58, 0.25);',
    '}',
    '.nav-cta-btn::after { display: none !important; }',
    '.nav-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(232, 134, 58, 0.35); }',
    '.hero-active .nav-cta-btn { color: var(--nav-warm-dark) !important; }',

    /* --- Footer base --- */
    '.footer {',
    '  background: var(--nav-warm-dark);',
    '  padding: 4rem;',
    '  border-radius: 28px 28px 0 0;',
    '  margin: 0;',
    '}',
    '.footer-top {',
    '  display: grid;',
    '  grid-template-columns: 2fr 1fr 1fr 1fr;',
    '  gap: 3rem;',
    '  padding-bottom: 3rem;',
    '  border-bottom: 1px solid rgba(255,255,255,0.08);',
    '  margin-bottom: 2rem;',
    '}',
    '.footer-brand-name {',
    '  font-family: var(--nav-font-display);',
    '  font-weight: 900;',
    '  font-size: 1.5rem;',
    '  color: white;',
    '  margin-bottom: 1rem;',
    '}',
    '.footer-brand-desc {',
    '  font-size: 0.85rem;',
    '  color: rgba(255,255,255,0.4);',
    '  line-height: 1.7;',
    '  max-width: 300px;',
    '}',
    '.footer-col-title {',
    '  font-family: var(--nav-font-body);',
    '  font-size: 0.8rem;',
    '  font-weight: 500;',
    '  color: rgba(255,255,255,0.6);',
    '  margin-bottom: 1.2rem;',
    '  letter-spacing: 0.05em;',
    '}',
    '.footer-col ul {',
    '  list-style: none;',
    '  padding: 0;',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 0.7rem;',
    '}',
    '.footer-col a {',
    '  font-size: 0.85rem;',
    '  color: rgba(255,255,255,0.65);',
    '  text-decoration: none;',
    '  transition: color 0.3s;',
    '}',
    '.footer-col a:hover { color: var(--nav-orange); }',
    '.footer-bottom {',
    '  display: flex;',
    '  justify-content: space-between;',
    '  align-items: center;',
    '}',
    '.footer-copy {',
    '  font-size: 0.75rem;',
    '  color: rgba(255,255,255,0.55);',
    '}',
    '.footer-social {',
    '  display: flex;',
    '  gap: 1rem;',
    '}',
    '.footer-social a {',
    '  width: 44px;',
    '  height: 44px;',
    '  border-radius: 50%;',
    '  border: 1px solid rgba(255,255,255,0.1);',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  color: rgba(255,255,255,0.4);',
    '  text-decoration: none;',
    '  font-size: 0.8rem;',
    '  transition: all 0.3s ease;',
    '}',
    '.footer-social a:hover {',
    '  border-color: var(--nav-orange);',
    '  color: var(--nav-orange);',
    '  background: rgba(232,134,58,0.1);',
    '}',

    /* --- Responsive --- */
    '@media (max-width: 1024px) {',
    '  .footer-top { grid-template-columns: 1fr 1fr; }',
    '  .nav { padding: 1.2rem 2rem; }',
    '  .nav.scrolled { padding: 1rem 2rem; }',
    '}',
    '@media (max-width: 640px) {',
    '  .nav-links { display: none; }',
    '  .footer-top { grid-template-columns: 1fr; }',
    '  .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }',
    '  .footer { padding: 3rem 2rem; }',
    '}'
  ].join('\n');

  /* ── Page map: filename → nav key ─────────────────────────── */
  var PAGE_MAP = {
    'homepage-design.html':             'home',
    'index.html':                       'home',
    'about-page-design.html':           'about',
    'services-page-design.html':        'services',
    'service-phone-systems-design.html':'services',
    'service-virtual-numbers-design.html':'services',
    'service-answering-design.html':    'services',
    'blog-archive-design.html':         'blog',
    'blog-post-design.html':            'blog',
    'contact-page-design.html':         'contact',
    'policies-template-design.html':    'policies'
  };

  var filename = window.location.pathname.split('/').pop() || 'homepage-design.html';
  var activePage = PAGE_MAP[filename] || '';

  function activeClass(key) {
    return activePage === key ? ' class="active"' : '';
  }

  /* ── Canonical header HTML ───────────────────────────────── */
  var headerHTML = [
    '<a href="#main-content" class="skip-link">דלג לתוכן הראשי</a>',
    '<nav class="nav" id="mainNav">',
    '  <a href="index.html" class="nav-logo">Qualia</a>',
    '  <ul class="nav-links">',
    '    <li><a href="about-page-design.html"' + activeClass('about') + '>אודות</a></li>',
    '    <li><a href="services-page-design.html"' + activeClass('services') + '>שירותים</a></li>',
    '    <li><a href="blog-archive-design.html"' + activeClass('blog') + '>הבלוג</a></li>',
    '    <li><a href="contact-page-design.html"' + activeClass('contact') + '>צור קשר</a></li>',
    '    <li><a href="contact-page-design.html" class="nav-cta-btn">בואו נדבר</a></li>',
    '  </ul>',
    '</nav>'
  ].join('\n');

  /* ── Canonical footer HTML ───────────────────────────────── */
  var footerHTML = [
    '<footer class="footer">',
    '  <div class="footer-top">',
    '    <div>',
    '      <div class="footer-brand-name">Qualia</div>',
    '      <p class="footer-brand-desc">',
    '        תקשורת עסקית פרימיום. מערכות טלפוניה, מספרים וירטואליים',
    '        ושירות טלפוני אנושי — מאז 2010.',
    '      </p>',
    '    </div>',
    '    <div class="footer-col">',
    '      <div class="footer-col-title">שירותים</div>',
    '      <ul>',
    '        <li><a href="service-phone-systems-design.html">מערכות תקשורת</a></li>',
    '        <li><a href="service-virtual-numbers-design.html">מספרים וירטואליים</a></li>',
    '        <li><a href="service-answering-design.html">שירות טלפוני</a></li>',
    '      </ul>',
    '    </div>',
    '    <div class="footer-col">',
    '      <div class="footer-col-title">חברה</div>',
    '      <ul>',
    '        <li><a href="about-page-design.html">אודות</a></li>',
    '        <li><a href="blog-archive-design.html">הבלוג</a></li>',
    '        <li><a href="contact-page-design.html">צור קשר</a></li>',
    '      </ul>',
    '    </div>',
    '    <div class="footer-col">',
    '      <div class="footer-col-title">מידע</div>',
    '      <ul>',
    '        <li><a href="policies-template-design.html">מדיניות פרטיות</a></li>',
    '        <li><a href="policies-template-design.html">תנאי שימוש</a></li>',
    '        <li><a href="policies-template-design.html">נגישות</a></li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '  <div class="footer-bottom">',
    '    <div class="footer-copy">© 2025 Qualia — Marketools Ltd. כל הזכויות שמורות.</div>',
    '    <div class="footer-social">',
    '      <a href="#" aria-label="פייסבוק">f</a>',
    '      <a href="#" aria-label="לינקדאין">in</a>',
    '      <a href="#" aria-label="אינסטגרם">ig</a>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join('\n');

  /* ── Inject CSS into <head> ──────────────────────────────── */
  function injectCSS() {
    var style = document.createElement('style');
    style.id = 'qualia-shared-chrome-css';
    style.textContent = SHARED_CSS;
    document.head.appendChild(style);
  }

  /* ── Inject on DOMContentLoaded ──────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    /* Inject shared CSS first */
    injectCSS();

    var headerSlot = document.getElementById('site-header');
    if (headerSlot) {
      headerSlot.outerHTML = headerHTML;
    }

    var footerSlot = document.getElementById('site-footer');
    if (footerSlot) {
      footerSlot.outerHTML = footerHTML;
    }

    /* Set up nav scroll behaviour */
    initNav();
  });

  /* ── Nav scroll behaviour ────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('mainNav');
    if (!nav) return;

    /* On the homepage the hero gives the nav a transparent "hero-active" state.
       On all other pages we start with solid background immediately. */
    var isHomepage = (activePage === 'home');

    function updateNav() {
      var scrolled = window.scrollY > 50;
      if (isHomepage) {
        nav.classList.toggle('hero-active', !scrolled);
        nav.classList.toggle('scrolled', scrolled);
      } else {
        nav.classList.remove('hero-active');
        nav.classList.add('scrolled');
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

})();
