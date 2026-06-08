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
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const emailKey = email.toLowerCase().trim();
    const users = await getUsers();
    const user = users[emailKey];
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
