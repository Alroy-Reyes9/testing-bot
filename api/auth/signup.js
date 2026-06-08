const { put, get } = require('@vercel/blob');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET=proces...CRET || 'pb-club-secret-2026';
const BLOB_KEY = 'club-users.json';

async function getUsers() {
  try {
    const blob = await get(BLOB_KEY);
    if (!blob) return {};
    return JSON.parse(await blob.text());
  } catch { return {}; }
}
async function saveUsers(obj) {
  await put(BLOB_KEY, JSON.stringify(obj), { contentType: 'application/json', access: 'private' });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      res.status(400).json({ error: 'Email, name, and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }
    const emailKey = email.toLowerCase().trim();
    const users = await getUsers();
    if (users[emailKey]) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }
    users[emailKey] = {
      email: emailKey,
      name: name.trim(),
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
    };
    await saveUsers(users);
    const token = jwt.sign({ email: emailKey, name: name.trim() }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: emailKey, name: name.trim() } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
