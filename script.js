// Smooth scroll
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Nav shadow on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 50 ? '0 1px 8px rgba(0,0,0,0.06)' : 'none';
});

// Button hover effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.02)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
});

// Find a Court button
document.querySelector('.btn-primary').addEventListener('click', () => {
  document.querySelector('#find').scrollIntoView({ behavior: 'smooth' });
});
