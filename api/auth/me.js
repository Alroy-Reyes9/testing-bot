import jwt from 'jsonwebtoken';

const JWT_SECRET=*** || 'pb-club-secret-2026';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) return json({ error: 'Not authenticated' }, 401);
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    return json({ user: { email: payload.email, name: payload.name } });
  } catch {
    return json({ error: 'Not authenticated' }, 401);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
}
