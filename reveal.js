/* ==========================================================
   animations.js  -  Harshal Patil Portfolio
   Gives your keyframe animations (fadeDown, fadeUp, slideLeft,
   slideRight, popIn) to every component, div and section.
   - Navbar + hero play when the page loads (same delays as
     your CSS example).
   - Everything else plays when you scroll to it.
   - Any other element or page not listed gets an automatic
     animation too, so it works on all your HTML pages.
   Works in every modern browser. No CSS file needed.

   Add before </body>:
   <script src="animations.js"></script>
   (Do NOT use it together with the old animations.css.)
   ========================================================== */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* ---------- 1. Keyframes (injected, so no CSS file is needed) ---------- */
  var css =
    '@keyframes fadeDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}' +
    '@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}' +
    '@keyframes slideLeft{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}' +
    '@keyframes slideRight{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}' +
    '@keyframes popIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}' +
    '.ja-hide{opacity:0}' +
    'html{scroll-behavior:smooth}';
  var styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 2. Rules: selector -> animation(s), delay, duration ----------
     anims : list of animations, used in order for siblings of the same group
     base  : delay in seconds for the first one
     step  : extra delay for each next sibling in the group
     dur   : duration in seconds                                              */
  var RULES = [
    /* ----- NAVBAR + HERO (plays on page load) ----- */
    { sel: '.top-nav',      anims: ['fadeDown'],  base: 0,   step: 0,   dur: 0.8 },
    { sel: '.logo',         anims: ['slideLeft'], base: 0.2, step: 0,   dur: 0.8 },
    { sel: '.nav-item',     anims: ['fadeDown'],  base: 0.3, step: 0.1, dur: 0.8 },
    { sel: '.div1-p',       anims: ['slideLeft'], base: 0.5, step: 0,   dur: 0.8 },
    { sel: '.head1',        anims: ['slideLeft'], base: 0.7, step: 0,   dur: 0.8 },
    { sel: '.p1',           anims: ['fadeUp'],    base: 0.9, step: 0,   dur: 0.8 },
    { sel: '.btn1',         anims: ['fadeUp'],    base: 1.1, step: 0.2, dur: 0.8 },
    { sel: '.avatar-wrap',  anims: ['popIn'],     base: 0.8, step: 0,   dur: 1 },

    /* ----- ABOUT ----- */
    { sel: '.box',          anims: ['slideLeft', 'popIn', 'popIn', 'slideRight'], base: 0, step: 0.12, dur: 0.8 },
    { sel: '.about-img',    anims: ['popIn'],     base: 0.2, step: 0,   dur: 0.8 },

    /* ----- SKILLS ----- */
    { sel: '.techhead',     anims: ['fadeDown'],  base: 0,   step: 0,   dur: 0.8 },
    { sel: '.animation-div',anims: ['slideLeft', 'slideRight'], base: 0, step: 0.12, dur: 0.8 },
    { sel: '.stack-box span', anims: ['popIn'],   base: 0.1, step: 0.06, dur: 0.5 },

    /* ----- PROJECTS ----- */
    { sel: '#projects .cardhead', anims: ['slideLeft'], base: 0, step: 0, dur: 0.8 },
    { sel: '.projectdiv',   anims: ['slideLeft', 'fadeUp', 'slideRight'], base: 0, step: 0.15, dur: 0.8 },

    /* ----- MY PATH SO FAR ----- */
    { sel: '.third-container .cardhead', anims: ['fadeDown'], base: 0, step: 0, dur: 0.8 },
    { sel: '.pathcol section', anims: ['slideLeft', 'fadeUp', 'slideRight'], base: 0, step: 0.15, dur: 0.8 },

    /* ----- CONTACT ----- */
    { sel: '.contact-head', anims: ['popIn'],     base: 0,   step: 0,   dur: 0.8 },
    { sel: '.form-container h2', anims: ['fadeUp'], base: 0.1, step: 0,  dur: 0.8 },
    { sel: '.form-container .btn-lg', anims: ['slideLeft', 'slideRight'], base: 0.2, step: 0.12, dur: 0.8 },
    { sel: '.socialicon a', anims: ['popIn'],     base: 0.1, step: 0.1, dur: 0.5 },

    /* ----- FOOTER ----- */
    { sel: '.footer-div',   anims: ['fadeUp'],    base: 0,   step: 0,   dur: 0.8 }
  ];

  /* Fallback for any other element or page that is not listed above */
  var GENERIC = 'h1,h2,h3,h4,h5,h6,p,img,button,.btn,li,section,article,aside,form,' +
                'table,figure,blockquote,.card,.col,[class*="col-"],footer';

  /* ---------- 3. Build the plan ---------- */
  var plan = new Map();

  function groupIndex(el, sel) {
    var parent = el.parentElement;
    if (!parent) return 0;
    var sibs = Array.prototype.filter.call(parent.children, function (c) {
      return c.matches(sel);
    });
    return Math.max(0, sibs.indexOf(el));
  }

  RULES.forEach(function (rule) {
    document.querySelectorAll(rule.sel).forEach(function (el) {
      if (plan.has(el)) return;
      var i = groupIndex(el, rule.sel);
      plan.set(el, {
        anim: rule.anims[i % rule.anims.length],
        delay: rule.base + i * rule.step,
        dur: rule.dur
      });
      el.setAttribute('data-ja', '');
    });
  });

  document.querySelectorAll(GENERIC).forEach(function (el) {
    if (plan.has(el)) return;
    if (el.closest('nav')) return;                         // navbar handled above
    if (el.closest('[data-ja]')) return;                   // already inside an animated parent
    if (el.querySelector('[data-ja]')) return;             // contains animated children
    var tag = el.tagName.toLowerCase();
    var anim = /^h[1-6]$/.test(tag) ? 'slideLeft'
             : tag === 'img' ? 'popIn'
             : 'fadeUp';
    var parent = el.parentElement;
    var i = parent ? Array.prototype.indexOf.call(parent.children, el) : 0;
    plan.set(el, { anim: anim, delay: Math.min(i, 5) * 0.1, dur: 0.8 });
    el.setAttribute('data-ja', '');
  });

  /* ---------- 4. Play each animation when the element is seen ---------- */
  function play(el) {
    var p = plan.get(el);
    el.style.animation = p.anim + ' ' + p.dur + 's ease-out ' + p.delay + 's both';
    el.classList.remove('ja-hide');
    el.addEventListener('animationend', function done(e) {
      if (e.target !== el || e.animationName !== p.anim) return;
      el.style.animation = '';             // give control back to your own CSS
      el.removeEventListener('animationend', done);
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      play(entry.target);
    });
  }, { threshold: 0.05 });

  plan.forEach(function (_, el) {
    el.classList.add('ja-hide');
    io.observe(el);
  });
})();