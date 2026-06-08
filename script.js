// Smooth scroll for nav links
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Header background on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 50
    ? 'rgba(26, 26, 26, 0.98)'
    : 'rgba(26, 26, 26, 0.95)';
});

// Order Now button
document.querySelector('.order-btn').addEventListener('click', () => {
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
});

// Contact form handler
document.querySelector('.contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Message Sent! ✅';
  btn.style.background = '#27ae60';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});
