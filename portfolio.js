const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const toTopButton = document.querySelector('.to-top');
const revealItems = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id], section[id]');

function setTheme(isDark) {
  body.classList.toggle('dark', isDark);
  const toggleLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  themeToggle.setAttribute('aria-label', toggleLabel);
  themeToggle.innerHTML = isDark ? '<span class="toggle-icon">☾</span>' : '<span class="toggle-icon">☼</span>';
  localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  setTheme(shouldUseDark);
}

function handleScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  toTopButton.classList.toggle('visible', window.scrollY > 420);
}

function setupRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function handleActiveNav() {
  let currentId = 'home';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function setupMobileMenu() {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function setupBackToTop() {
  toTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupCursorEffect() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (!window.matchMedia('(pointer: fine)').matches) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    return;
  }

  window.addEventListener('pointermove', (event) => {
    const { clientX, clientY } = event;
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
    cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
    cursorRing.style.transform = `translate(${clientX - 16}px, ${clientY - 16}px)`;
  });

  document.addEventListener('pointerdown', () => {
    cursorRing.style.transform += ' scale(0.92)';
  });

  document.addEventListener('pointerup', () => {
    cursorRing.style.transform = cursorRing.style.transform.replace(' scale(0.92)', '');
  });

  document.addEventListener('pointerleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
}

themeToggle.addEventListener('click', () => {
  const isDark = !body.classList.contains('dark');
  setTheme(isDark);
});

window.addEventListener('scroll', () => {
  handleScroll();
  handleActiveNav();
});

window.addEventListener('load', () => {
  initializeTheme();
  handleScroll();
  handleActiveNav();
  setupRevealObserver();
});

setupSmoothScroll();
setupMobileMenu();
setupBackToTop();
setupCursorEffect();
