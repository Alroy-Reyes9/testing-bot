// Smooth scroll nav
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Nav background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? 'rgba(10,10,15,0.95)'
    : 'rgba(10,10,15,0.8)';
});

// Button hover effects
document.querySelectorAll('.btn-glow, .btn-outline').forEach(btn => {
  btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.02)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
});
