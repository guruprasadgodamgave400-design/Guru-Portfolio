/* ═══════════════════════════════════════════════════════
   GURUPRASAD GODAMGAVE — PORTFOLIO JS
   Particle Background · Typing Effect · Scroll Reveals
   Skill Bars · Counter Animation · Nav · Contact Form
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── PARTICLE BACKGROUND ───
  initParticles();

  // ─── TYPING EFFECT ───
  initTypingEffect();

  // ─── NAVBAR ───
  initNavbar();

  // ─── SCROLL REVEALS ───
  initScrollReveal();

  // ─── SKILL BARS ───
  initSkillBars();

  // ─── STAT COUNTERS ───
  initStatCounters();

  // ─── BACK TO TOP ───
  initBackToTop();

  // ─── CONTACT FORM ───
  initContactForm();

  // ─── CERTIFICATE MODAL ───
  initCertModal();

  // ─── CARD3D TILT ───
  initCard3D();

  // ─── SEND BUTTON PULSE ───
  setTimeout(() => {
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.classList.add('pulse');
  }, 2500);
});


/* ═══════════════════════════════════════════════════════
   CARD3D — 3D TILT + SHINE + CLICK
   ═══════════════════════════════════════════════════════ */
function initCard3D() {
  const cards = document.querySelectorAll('.card3d');
  if (!cards.length) return;

  cards.forEach(card => {
    let rafId = null;
    let isHovered = false;

    // ── Mouse move: update tilt + shine ──
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width)  - 0.5) * 25;
      const rotateX = ((y / rect.height) - 0.5) * -25;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform =
          `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(18px)`;
        card.style.boxShadow =
          `0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.18)`;

        // Shimmer angle tracks pointer
        const shine = card.querySelector('.card3d-shine');
        if (shine) {
          const angle = rotateY + 135;
          shine.style.background =
            `linear-gradient(${angle}deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)`;
        }
      });
    });

    // ── Mouse enter ──
    card.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    // ── Mouse leave: reset tilt ──
    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform =
        'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.boxShadow =
        '0 10px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12)';
      const shine = card.querySelector('.card3d-shine');
      if (shine) shine.style.background = 'transparent';
    });

    // ── Click: open cert in new tab ──
    card.addEventListener('click', () => {
      const href = card.dataset.href;
      if (href) window.open(href, '_blank', 'noopener,noreferrer');
    });

    // ── Keyboard: Enter / Space to activate ──
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const href = card.dataset.href;
        if (href) window.open(href, '_blank', 'noopener,noreferrer');
      }
    });
  });
}



/* ═══════════════════════════════════════════════════════
   PARTICLE BACKGROUND
   ═══════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 150;
  const MOUSE_DIST = 200;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // ── Fade out particles on spotlight hero section ──
  const landingSection = document.getElementById('landing');
  function updateParticleVisibility() {
    if (!landingSection) return;
    const heroBottom = landingSection.offsetTop + landingSection.offsetHeight;
    const scrollY = window.scrollY;
    // Fade out in hero zone, fade back in past hero
    if (scrollY < heroBottom - 100) {
      const ratio = Math.min(scrollY / 300, 1);
      canvas.style.opacity = (ratio * 0.7).toFixed(2); // starts hidden, grows
    } else {
      canvas.style.opacity = '1';
    }
  }
  updateParticleVisibility();
  window.addEventListener('scroll', updateParticleVisibility, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST;
          this.x += dx * force * 0.02;
          this.y += dy * force * 0.02;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.update();
      p.draw();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}



/* ═══════════════════════════════════════════════════════
   TYPING EFFECT
   ═══════════════════════════════════════════════════════ */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const strings = [
    'Software Engineer',
    'AI & Data Science Student',
    'Google Student Ambassador',
    'Full Stack Web Developer',
    'Computer Vision Enthusiast',
    'NASA Galactic Problem Solver'
  ];

  let strIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 80;

  function type() {
    const current = strings[strIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 40;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      speed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      strIdx = (strIdx + 1) % strings.length;
      speed = 500; // Pause before next string
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
}


/* ═══════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  // Scroll class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section detection
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
  });

  // Close on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
    });
  });
}


/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
   ═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealClasses = [
    'reveal-up', 'reveal-left', 'reveal-right',
    'reveal-flip', 'reveal-drop', 'reveal-scale',
    'reveal-zoom', 'cert-cascade',
    'reveal-slide-bl', 'reveal-slide-br',
    'social-pop', 'pop-in', 'bounce-in',
    'quick-link'
  ];

  const selector = revealClasses.map(c => `.${c}`).join(', ');
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains('social-pop')) {
          el.classList.add('animated');
        } else {
          el.classList.add('revealed');
        }

        // Also reveal stagger-list children
        const staggerLists = el.querySelectorAll('.stagger-list');
        staggerLists.forEach(list => list.classList.add('revealed'));

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Also observe stagger lists directly
  const staggerLists = document.querySelectorAll('.stagger-list');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  staggerLists.forEach(el => staggerObserver.observe(el));

  // Trigger landing section immediately
  setTimeout(() => {
    const landingReveals = document.querySelectorAll('.section-landing .reveal-up');
    landingReveals.forEach(el => el.classList.add('revealed'));

    setTimeout(() => {
      const socials = document.querySelectorAll('.social-pop');
      socials.forEach(el => el.classList.add('animated'));
    }, 800);
  }, 300);
}


/* ═══════════════════════════════════════════════════════
   SKILL BARS ANIMATION
   ═══════════════════════════════════════════════════════ */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
        fill.classList.add('animated');

        // Animate the percentage counter
        const skillItem = fill.closest('.skill-item');
        if (skillItem) {
          const percentEl = skillItem.querySelector('.skill-percent');
          if (percentEl) {
            animateNumber(percentEl, 0, parseInt(width), 1200, '%');
          }
        }

        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => observer.observe(fill));
}


/* ═══════════════════════════════════════════════════════
   STAT COUNTER ANIMATION
   ═══════════════════════════════════════════════════════ */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateNumber(el, 0, target, 1500, '');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}


/* ─── NUMBER ANIMATION HELPER ─── */
function animateNumber(el, start, end, duration, suffix) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out curve
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/* ═══════════════════════════════════════════════════════
   BACK TO TOP
   ═══════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ═══════════════════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const subject = document.getElementById('formSubject').value;
    const message = document.getElementById('formMessage').value;

    // Open mailto with form data
    const mailtoLink = `mailto:guruprasadgodamgave400@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    window.location.href = mailtoLink;

    // Visual feedback
    const btn = document.getElementById('sendBtn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent! ✓</span>';
    btn.style.background = 'linear-gradient(135deg, #10B981, #34D399)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}


/* ═══════════════════════════════════════════════════════
   CERTIFICATE MODAL
   ═══════════════════════════════════════════════════════ */
function initCertModal() {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');

  if (!modal || !modalImg) return;

  // Add click listener to all "View Certificate" buttons and image containers
  const viewButtons = document.querySelectorAll('.btn-view-cert, .btn-view-cert-btn, .cert-img-container');

  viewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certSrc = btn.getAttribute('data-cert-src');
      const certTitle = btn.getAttribute('data-cert-title');

      if (certSrc) {
        modalImg.src = certSrc;
        modalImg.alt = certTitle || 'Certificate';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

