/* ═══════════════════════════════════════════════════
   AZMI ADAN PORTFOLIO — script.js
   Dark Luxury Purple Theme — Enhanced Edition
═══════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ───────────────────────────────── */
(function() {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverEls = 'a, button, .tp, .pj-card, .sk-card, .cert-card, .tl-card, .ci';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ── AMBIENT PARTICLE CANVAS ────────────────────── */
(function() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(155,111,224,', 'rgba(212,175,55,', 'rgba(107,53,196,', 'rgba(196,163,247,'];

  function createParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0, maxLife: Math.random() * 300 + 200,
    };
  }
  for (let i = 0; i < 120; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.life++; p.x += p.vx; p.y += p.vy;
      const a = p.alpha * Math.sin((p.life / p.maxLife) * Math.PI);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();
      if (p.life >= p.maxLife || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) {
        particles[i] = createParticle();
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════════════════════
   ★  SPLASH SCREEN — FIXED & FAST
══════════════════════════════════════════════════ */
(function() {
  const splash   = document.getElementById('splash');
  const canvas   = document.getElementById('splash-canvas');
  const fillEl   = document.getElementById('splash-fill');
  const glowEl   = document.getElementById('splash-glow');
  const statusEl = document.getElementById('splash-status');
  const pctEl    = document.getElementById('splash-pct');
  if (!splash || !canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ─── 3-D PARTICLE VORTEX ──── */
  const PARTICLE_COUNT = 280;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle   = Math.random() * Math.PI * 2;
    const radius  = 80 + Math.random() * 320;
    const speed   = (0.002 + Math.random() * 0.006) * (Math.random() > 0.5 ? 1 : -1);
    const z       = Math.random() * 2 - 1;
    const r       = Math.random() > 0.85 ? 2.5 : Math.random() * 1.5 + 0.3;
    const isGold  = Math.random() > 0.72;

    particles.push({ angle, radius, speed, z, r, isGold,
      baseAlpha: 0.3 + Math.random() * 0.7,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
    });
  }

  /* ─── CONSTELLATION LINES ──── */
  const NODES = 18;
  const nodes = Array.from({ length: NODES }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0008,
    vy: (Math.random() - 0.5) * 0.0008,
  }));

  /* ─── ANIMATED HEX RING ──── */
  let hexAngle = 0;

  function hexPath(cx, cy, r, angle) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = angle + (i * Math.PI) / 3;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
  }

  function drawHex(cx, cy, r, angle, color, alpha, lineWidth) {
    const pts = hexPath(cx, cy, r, angle);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < 6; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  /* ─── DRAW LOOP ──── */
  let splashDone = false;

  function renderSplash() {
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;

    /* moving constellation lines */
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > 1) n.vx *= -1;
      if (n.y < 0 || n.y > 1) n.vy *= -1;
    });
    for (let i = 0; i < NODES; i++) {
      for (let j = i + 1; j < NODES; j++) {
        const dx = (nodes[i].x - nodes[j].x) * W;
        const dy = (nodes[i].y - nodes[j].y) * H;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x * W, nodes[i].y * H);
          ctx.lineTo(nodes[j].x * W, nodes[j].y * H);
          ctx.strokeStyle = `rgba(107,53,196,${(1 - dist / 220) * 0.18})`;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x * W, n.y * H, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(155,111,224,0.35)';
      ctx.fill();
    });

    /* rotating hex rings */
    hexAngle += 0.003;
    drawHex(cx, cy, 310, hexAngle,       'rgba(107,53,196,0.25)', 0.8, 0.8);
    drawHex(cx, cy, 240, -hexAngle * 1.4,'rgba(212,175,55,0.2)',  0.8, 0.5);
    drawHex(cx, cy, 170, hexAngle * 2,   'rgba(155,111,224,0.15)',0.8, 0.4);

    /* vortex particles */
    particles.forEach(p => {
      p.angle += p.speed;
      p.twinkle += p.twinkleSpeed;

      const x = cx + p.radius * Math.cos(p.angle);
      const y = cy + p.radius * Math.sin(p.angle) * 0.38;

      const depth = (p.z + 1) / 2;
      const alpha = p.baseAlpha * (0.4 + depth * 0.6) * (0.7 + 0.3 * Math.sin(p.twinkle));
      const size  = p.r * (0.4 + depth * 0.7);

      if (p.isGold) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
        g.addColorStop(0, `rgba(240,208,96,${alpha})`);
        g.addColorStop(1, `rgba(212,175,55,0)`);
        ctx.beginPath();
        ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      } else {
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        g.addColorStop(0, `rgba(196,163,247,${alpha})`);
        g.addColorStop(1, `rgba(107,53,196,0)`);
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = p.isGold
        ? `rgba(240,208,96,${Math.min(1, alpha * 2)})`
        : `rgba(220,190,255,${Math.min(1, alpha * 2)})`;
      ctx.fill();
    });

    /* central glow pulse */
    const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.002);
    const glow  = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
    glow.addColorStop(0, `rgba(107,53,196,${0.15 * pulse})`);
    glow.addColorStop(0.5, `rgba(107,53,196,${0.07 * pulse})`);
    glow.addColorStop(1, 'rgba(107,53,196,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    if (!splashDone) requestAnimationFrame(renderSplash);
  }

  renderSplash();

  /* ─── PROGRESS — FIXED: guaranteed to finish in ~1.8s ──── */
  const steps = [
    { msg: 'Initializing systems…',   min: 0,  max: 20  },
    { msg: 'Loading modules…',        min: 20, max: 45  },
    { msg: 'Calibrating cloud nodes…',min: 45, max: 65  },
    { msg: 'Encrypting connections…', min: 65, max: 82  },
    { msg: 'Deploying experience…',   min: 82, max: 96  },
    { msg: 'Welcome, Azmi.',          min: 96, max: 100 },
  ];

  const TOTAL_DURATION = 1800; // ms — total splash time
  const INTERVAL       = 40;   // ms — tick rate
  const TOTAL_TICKS    = TOTAL_DURATION / INTERVAL;
  let   tick           = 0;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  const iv = setInterval(() => {
    tick++;
    const raw      = tick / TOTAL_TICKS;              // 0 → 1 linear
    const progress = Math.min(100, easeInOut(Math.min(raw, 1)) * 100);

    if (fillEl)  fillEl.style.width  = progress + '%';
    if (glowEl)  glowEl.style.left   = progress + '%';
    if (pctEl)   pctEl.textContent   = Math.floor(progress) + '%';

    const step = steps.find(s => progress >= s.min && progress <= s.max);
    if (step && statusEl) statusEl.textContent = step.msg;

    if (tick >= TOTAL_TICKS) {
      clearInterval(iv);
      splashDone = true;
      setTimeout(() => {
        splash.classList.add('splash-exit');
        setTimeout(() => splash.remove(), 1000);
      }, 200);
    }
  }, INTERVAL);
})();

/* ── TYPEWRITER ──────────────────────────────────── */
(function() {
  const el = document.getElementById('tw-text');
  if (!el) return;
  const phrases = ['Software Developer', 'Cloud Engineer', 'Security Enthusiast', 'Mobile App Developer', 'Web Developer'];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 75);
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 350); return; }
      setTimeout(type, 38);
    }
  }
  setTimeout(type, 2500);
})();

/* ── NAVBAR ──────────────────────────────────────── */
(function() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('nav-links');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  });

  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop, bot = top + sec.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < bot);
    });
  }
  updateActiveLink();
})();

/* ── SMOOTH SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ───────────────────────────────── */
(function() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));
})();

/* ── SKILL BARS ──────────────────────────────────── */
(function() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;
  let animated = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      setTimeout(() => {
        document.querySelectorAll('.sb-fill').forEach(bar => { bar.style.width = bar.dataset.w + '%'; });
      }, 200);
      obs.disconnect();
    }
  }, { threshold: 0.2 });
  obs.observe(skillsSection);
})();

/* ── TECH UNIVERSE ───────────────────────────────── */
function showTech(name, pct, desc) {
  const nameEl = document.getElementById('tup-name');
  const pctEl  = document.getElementById('tup-pct');
  const fillEl = document.getElementById('tup-fill');
  const descEl = document.getElementById('tup-desc');
  if (!nameEl) return;
  nameEl.textContent = name;
  pctEl.textContent  = pct + '% proficiency';
  descEl.textContent = desc;
  fillEl.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => { fillEl.style.width = pct + '%'; }));
}

/* ── PROJECT CARD TILT ───────────────────────────── */
(function() {
  document.querySelectorAll('.pj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── CV HOLOGRAM CARD TILT & SHINE ───────────────── */
(function() {
  const card = document.getElementById('cvCard');
  if (!card) return;

  const shine = card.querySelector('.cv-holo-shine');

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    const rotX = (y - 0.5) * -22;
    const rotY = (x - 0.5) * 22;

    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)`;
      shine.style.opacity = '1';
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    if (shine) shine.style.opacity = '0';
  });
})();

/* ── SECTION PARALLAX ORBS ───────────────────────── */
(function() {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    document.querySelectorAll('.hero-orb').forEach((orb, i) => {
      const speed = [0.08, 0.12, 0.06][i] || 0.08;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  });
})();

/* ── STAT COUNTER ANIMATION ──────────────────────── */
(function() {
  const statEls = document.querySelectorAll('.astat-n');
  if (!statEls.length) return;

  function animCount(el, target, suffix, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      statEls.forEach(el => {
        const raw = el.textContent;
        const num = parseInt(raw);
        const suffix = raw.replace(/[0-9]/g, '');
        animCount(el, num, suffix, 1200);
      });
      obs.disconnect();
    }
  }, { threshold: 0.5 });

  const aboutSec = document.getElementById('about');
  if (aboutSec) obs.observe(aboutSec);
})();

/* ── FOOTER YEAR ─────────────────────────────────── */
(function() {
  const yr = document.querySelector('.footer-bottom p');
  if (yr) yr.innerHTML = yr.innerHTML.replace('2025', new Date().getFullYear());
})();