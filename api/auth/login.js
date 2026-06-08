import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const JWT_SECRET=process.env.JWT_SECRET || 'pb-club-secret-2026';
const DB_PATH = '/tmp/pickleball-users.json';

function getUsers() {
  try {
    if (!fs.existsSync(DB_PATH)) return {};
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch { return {}; }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return json({ error: 'Email and password are required' }, 400);

    const emailKey = email.toLowerCase().trim();
    const users = getUsers();
    const user = users[emailKey];
    if (!user) return json({ error: 'Invalid email or password' }, 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return json({ error: 'Invalid email or password' }, 401);

    const token = jwt.sign(
      { email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
