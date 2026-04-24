/* ============================================================
   SALVIE LAGAHAN — 19TH BIRTHDAY WEBSITE
   script.js  —  All interactivity & animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR: Scroll shrink + active link tracking
     ============================================================ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    // Shrink navbar on scroll
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Highlight active nav link based on scroll position
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });


  /* ============================================================
     2. HAMBURGER MENU (mobile)
     ============================================================ */
  const navToggle  = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });


  /* ============================================================
     3. SCROLL REVEAL ANIMATION
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Keep revealing — don't unobserve (persists on re-scroll)
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================================================
     4. GALLERY LIGHTBOX
     ============================================================ */
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      if (!img || img.style.display === 'none') return; // No real image loaded

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });


  /* ============================================================
     5. CONFETTI BURST (runs once on page load)
     ============================================================ */
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Color palette — purple (30%) and gold (10%) themed confetti
  const COLORS = [
    '#7B2FBE', '#9B59D6', '#C8A0E8', '#EDD9FF',  // Purples
    '#D4AF37', '#F0C040', '#FFF8DC',               // Golds
    '#FFFFFF', '#FFD6F5'                            // White/pink
  ];

  const SHAPES = ['circle', 'rect', 'triangle'];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = Math.random() * canvas.width;
      this.y     = initial ? Math.random() * -canvas.height : -20;
      this.size  = Math.random() * 10 + 5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.speed = Math.random() * 2.5 + 1.2;
      this.drift = (Math.random() - 0.5) * 1.5;
      this.spin  = (Math.random() - 0.5) * 0.12;
      this.angle = Math.random() * Math.PI * 2;
      this.alpha = 1;
      this.life  = 1;
      this.decay = Math.random() * 0.004 + 0.002;
    }

    update() {
      this.y     += this.speed;
      this.x     += this.drift;
      this.angle += this.spin;
      this.life  -= this.decay;
      this.alpha  = Math.max(0, this.life);

      if (this.y > canvas.height + 20 || this.life <= 0) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      switch (this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'rect':
          ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }

      ctx.restore();
    }
  }

  // Create particles
  const particles = Array.from({ length: 120 }, () => new Particle());

  let animId;
  let frameCount = 0;
  const MAX_FRAMES = 400; // Run confetti for ~6.5 seconds at 60fps

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    frameCount++;

    if (frameCount < MAX_FRAMES) {
      animId = requestAnimationFrame(animateConfetti);
    } else {
      // Fade out and stop
      fadeOut();
    }
  }

  function fadeOut() {
    let op = 1;
    const fade = () => {
      ctx.globalAlpha = op;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.draw());
      op -= 0.02;
      if (op > 0) requestAnimationFrame(fade);
      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animId);
      }
    };
    fade();
  }

  // Start confetti after a short delay
  setTimeout(() => animateConfetti(), 600);


  /* ============================================================
     6. BIRTHDAY COUNTER — Number reveals 1→19
     ============================================================ */
  const numEl = document.getElementById('countTo19');
  if (numEl) {
    let count = 0;
    const target = 19;
    const duration = 1600; // ms
    const interval = duration / target;

    // Wait for page to render
    setTimeout(() => {
      const counter = setInterval(() => {
        count++;
        numEl.textContent = count;
        if (count >= target) clearInterval(counter);
      }, interval);
    }, 900);
  }


  /* ============================================================
     7. SMOOTH SCROLL for Nav Links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navH = navbar.offsetHeight || 68;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ============================================================
     8. GALLERY PLACEHOLDER — Show placeholder if img fails to load
     ============================================================ */
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('error', () => {
      const wrap = img.closest('.gallery-img-wrap');
      if (wrap) {
        img.style.display = 'none';
        const placeholder = wrap.querySelector('.gallery-placeholder');
        if (placeholder) placeholder.style.display = 'flex';
      }
    });
  });


  /* ============================================================
     9. VERSE CARDS — Subtle pulse on hover
     ============================================================ */
  document.querySelectorAll('.verse-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderTopColor = 'var(--gold-main)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderTopColor = 'var(--purple-main)';
    });
  });


  /* ============================================================
     10. SPARKLE CURSOR EFFECT (desktop only)
     ============================================================ */
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.75) return; // Spawn occasionally
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top:  ${e.clientY}px;
        width: 8px;
        height: 8px;
        background: ${Math.random() > .5 ? 'var(--gold-light)' : 'var(--purple-soft)'};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%) scale(1);
        transition: transform .5s ease, opacity .5s ease;
        opacity: 0.9;
      `;
      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${(Math.random()-0.5)*40}px, ${(Math.random()-0.5)*40-20}px) scale(0)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => sparkle.remove(), 550);
    });
  }


  /* ============================================================
     11. PAGE LOAD FADE-IN
     ============================================================ */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

});