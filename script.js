// ---------- Theme toggle (persists in localStorage) ----------
const themeToggle = document.getElementById('themeToggle');
const stored = localStorage.getItem('theme');
if (stored === 'light') document.documentElement.setAttribute('data-theme', 'light');

themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  if (cur === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// ---------- Reveal-on-scroll ----------
const reveals = document.querySelectorAll('.section, .hero-content, .hero-visual');
reveals.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => io.observe(el));

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(l => l.style.color = '');
      link.style.color = 'var(--text)';
    }
  });
});

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const total = h.scrollHeight - h.clientHeight;
  const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ---------- Cursor spotlight (desktop only) ----------
const cursorSpot = document.getElementById('cursorSpot');
const isFinePointer = window.matchMedia('(pointer: fine)').matches;
if (isFinePointer) {
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });
  const tick = () => {
    curX += (targetX - curX) * 0.12;
    curY += (targetY - curY) * 0.12;
    cursorSpot.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();
} else {
  cursorSpot.style.display = 'none';
}

// ---------- Stat counter animation ----------
const counters = document.querySelectorAll('.stat-number');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const finalText = el.textContent.trim();
    const match = finalText.match(/^([\d.]+)(.*)$/);
    if (!match) { counterIO.unobserve(el); return; }
    const target = parseFloat(match[1]);
    const suffix = match[2];
    const isFloat = !Number.isInteger(target);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = target * eased;
      el.textContent = (isFloat ? cur.toFixed(1) : Math.floor(cur)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = finalText;
    };
    requestAnimationFrame(step);
    counterIO.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(el => counterIO.observe(el));

// ---------- 3D tilt on project cards (desktop only) ----------
if (isFinePointer) {
  document.querySelectorAll('.project-card').forEach(card => {
    let raf;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rY = (px - 0.5) * 8;
      const rX = (0.5 - py) * 8;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-6px) scale(1.01)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
}
