// ===== Smooth scroll =====
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Nav shadow =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 50 ? '0 1px 8px rgba(0,0,0,0.06)' : 'none';
});

// ===== Button scale =====
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.02)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
});

// ===== Find a Court CTA =====
const courtBtn = document.querySelector('.btn-primary');
if (courtBtn) {
  courtBtn.addEventListener('click', () => {
    document.querySelector('#find').scrollIntoView({ behavior: 'smooth' });
  });
}

// ===== Auth System (localStorage) =====
const overlay = document.getElementById('modalOverlay');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = document.getElementById('modalClose');
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginMsg = document.getElementById('loginMsg');
const signupMsg = document.getElementById('signupMsg');
const userBadge = document.getElementById('userBadge');
const userName = document.getElementById('userName');

// Check session on load
const session = sessionStorage.getItem('picklehub_user');
if (session) {
  const user = JSON.parse(session);
  showUser(user.name);
}

// Open modal
loginBtn.addEventListener('click', () => overlay.classList.add('open'));
closeBtn.addEventListener('click', () => { overlay.classList.remove('open'); clearMessages(); });
overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.classList.remove('open'); clearMessages(); } });

// Tab switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.modal-form').forEach(f => f.classList.remove('active'));
    document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
    clearMessages();
  });
});

// Signup
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = signupForm.querySelector('input[type="text"]').value.trim();
  const email = signupForm.querySelector('input[type="email"]').value.trim();
  const pass = signupForm.querySelector('input[type="password"]').value;

  if (!name || !email || pass.length < 6) {
    showMsg(signupMsg, 'Please fill all fields. Password needs 6+ chars.', 'error');
    return;
  }

  if (localStorage.getItem('picklehub_user_' + email)) {
    showMsg(signupMsg, 'An account with this email already exists.', 'error');
    return;
  }

  const user = { name, email, password: pass };
  localStorage.setItem('picklehub_user_' + email, JSON.stringify(user));
  showMsg(signupMsg, 'Account created! Signing you in...', 'success');
  setTimeout(() => {
    overlay.classList.remove('open');
    saveSession(user);
    signupForm.reset();
    clearMessages();
  }, 800);
});

// Login
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm.querySelector('input[type="email"]').value.trim();
  const pass = loginForm.querySelector('input[type="password"]').value;

  const stored = localStorage.getItem('picklehub_user_' + email);
  if (!stored) {
    showMsg(loginMsg, 'No account found with this email.', 'error');
    return;
  }

  const user = JSON.parse(stored);
  if (user.password !== pass) {
    showMsg(loginMsg, 'Incorrect password.', 'error');
    return;
  }

  showMsg(loginMsg, 'Welcome back!', 'success');
  setTimeout(() => {
    overlay.classList.remove('open');
    saveSession(user);
    loginForm.reset();
    clearMessages();
  }, 500);
});

function saveSession(user) {
  sessionStorage.setItem('picklehub_user', JSON.stringify(user));
  showUser(user.name);
}

function showUser(name) {
  loginBtn.style.display = 'none';
  userBadge.style.display = 'inline';
  userName.textContent = name;
}

function clearMessages() {
  loginMsg.textContent = '';
  loginMsg.className = 'form-msg';
  signupMsg.textContent = '';
  signupMsg.className = 'form-msg';
}

function showMsg(el, text, type) {
  el.textContent = text;
  el.className = 'form-msg ' + type;
}
