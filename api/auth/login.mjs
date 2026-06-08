import { put, get } from '@vercel/blob';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET=proces...CRET || 'pb-club-secret-2026';
const BLOB_KEY = 'club-users.json';

async function getUsers() {
  try {
    const blob = await get(BLOB_KEY);
    if (!blob) return {};
    return JSON.parse(await blob.text());
  } catch { return {}; }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return json({ error: 'Email and password are required' }, 400);

    const emailKey = email.toLowerCase().trim();
    const users = await getUsers();
    const user = users[emailKey];
    if (!user) return json({ error: 'Invalid email or password' }, 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return json({ error: 'Invalid email or password' }, 401);

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    return json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
