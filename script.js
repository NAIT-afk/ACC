/* ===== PAGE NAVIGATION ===== */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update active link in side panel
  document.querySelectorAll('.side-panel a').forEach(a => {
    a.classList.toggle('active-link', a.dataset.page === pageId);
  });
  closeSidePanel();
  setTimeout(triggerAnimations, 100);
  if (pageId === 'home') setTimeout(runCounters, 300);
}

/* ===== SIDE PANEL ===== */
const hamburger = document.getElementById('hamburger');
const sidePanel = document.getElementById('sidePanel');
const overlay   = document.getElementById('overlay');
const closePanel = document.getElementById('closePanel');

function openSidePanel() {
  sidePanel.classList.add('open');
  overlay.classList.add('active');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidePanel() {
  sidePanel.classList.remove('open');
  overlay.classList.remove('active');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  sidePanel.classList.contains('open') ? closeSidePanel() : openSidePanel();
});
closePanel.addEventListener('click', closeSidePanel);
overlay.addEventListener('click', closeSidePanel);

// Close on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidePanel(); });

/* ===== STICKY HEADER ===== */
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== SCROLL ANIMATIONS ===== */
function triggerAnimations() {
  const els = document.querySelectorAll('.page.active .animate-fadein, .page.active .animate-slidein');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function runCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(current);
    }, 16);
  });
}

/* ===== PORTFOLIO FILTER ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ===== TESTIMONIAL SLIDER — removed (page deleted) ===== */

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

/* ===== CONTACT FORM VALIDATION ===== */
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'name',    errorId: 'nameError',    msg: 'Please enter your full name.',       check: v => v.trim().length >= 2 },
    { id: 'email',   errorId: 'emailError',   msg: 'Please enter a valid email address.', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'subject', errorId: 'subjectError', msg: 'Please enter a subject.',             check: v => v.trim().length >= 3 },
    { id: 'message', errorId: 'messageError', msg: 'Please enter a message (min 10 chars).', check: v => v.trim().length >= 10 },
  ];

  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const error = document.getElementById(f.errorId);
    const ok = f.check(input.value);
    input.classList.toggle('error', !ok);
    error.textContent = ok ? '' : f.msg;
    if (!ok) valid = false;
  });

  if (valid) {
    this.reset();
    fields.forEach(f => {
      document.getElementById(f.id).classList.remove('error');
      document.getElementById(f.errorId).textContent = '';
    });
    const success = document.getElementById('formSuccess');
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  }
});

// Clear error on input
['name','email','subject','message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById(id + 'Error').textContent = '';
  });
});

/* ===== INIT ===== */
triggerAnimations();
runCounters();

/* ===== COOKIE CONSENT ===== */
(function () {
  const banner       = document.getElementById('cookieBanner');
  const modalOverlay = document.getElementById('cookieModalOverlay');

  // Show banner if no consent stored
  function initCookies() {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => banner.classList.add('show'), 800);
    }
  }

  function hideBanner() { banner.classList.remove('show'); }
  function showModal()  { modalOverlay.classList.add('show'); }
  function hideModal()  { modalOverlay.classList.remove('show'); }

  function saveConsent(analytics, prefs, marketing) {
    localStorage.setItem('cookieConsent', JSON.stringify({
      essential: true, analytics, prefs, marketing,
      date: new Date().toISOString()
    }));
  }

  // Accept all
  document.getElementById('cookieAccept').addEventListener('click', () => {
    saveConsent(true, true, true);
    hideBanner();
  });

  // Reject non-essential
  document.getElementById('cookieReject').addEventListener('click', () => {
    saveConsent(false, false, false);
    hideBanner();
  });

  // Open preferences modal
  document.getElementById('cookieManage').addEventListener('click', () => {
    hideBanner();
    showModal();
  });

  // Close modal
  document.getElementById('cookieModalClose').addEventListener('click', hideModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) hideModal(); });

  // Save preferences from modal
  document.getElementById('cookieSavePrefs').addEventListener('click', () => {
    saveConsent(
      document.getElementById('analyticsConsent').checked,
      document.getElementById('prefConsent').checked,
      document.getElementById('marketingConsent').checked
    );
    hideModal();
  });

  // Accept all from modal
  document.getElementById('cookieAcceptAll').addEventListener('click', () => {
    ['analyticsConsent','prefConsent','marketingConsent'].forEach(id => {
      document.getElementById(id).checked = true;
    });
    saveConsent(true, true, true);
    hideModal();
  });

  // Expose for policy links
  window.showCookiePolicy = () => { hideModal(); hideBanner(); showPage('faq'); };
  window.showPrivacyPolicy = () => { hideModal(); hideBanner(); showPage('faq'); };

  initCookies();
})();
