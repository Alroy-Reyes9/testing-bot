import { put, get } from '@vercel/blob';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pb-club-secret-2026';

function getUserFromToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

export async function GET(req) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return json({ error: 'Not authenticated' }, 401);
  }
  const user = getUserFromToken(auth.slice(7));
  if (!user) return json({ error: 'Not authenticated' }, 401);
  return json({ user });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
}
