const BLOB_KEY = 'club-users.json';

async function getUsers(get) {
  try {
    const result = await get(BLOB_KEY);
    if (!result) return {};
    return JSON.parse(await result.text());
  } catch { return {}; }
}
async function saveUsers(put, obj) {
  await put(BLOB_KEY, JSON.stringify(obj), { contentType: 'application/json', access: 'private' });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}

export async function POST(req) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'pb-club-secret-2026';
    const blob = await import('@vercel/blob');
    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');
    const { get } = blob;
    const { name, email, password } = await req.json();
    if (!email || !name || !password) return json({ error: 'Email, name, and password are required' }, 400);
    if (password.length < 6) return json({ error: 'Password must be at least 6 characters' }, 400);
    const emailKey = email.toLowerCase().trim();
    const users = await getUsers(get);
    if (users[emailKey]) return json({ error: 'An account with this email already exists' }, 409);
    users[emailKey] = {
      email: emailKey,
      name: name.trim(),
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
    };
    await saveUsers(blob.put, users);
    const token = jwt.sign({ email: emailKey, name: name.trim() }, JWT_SECRET, { expiresIn: '7d' });
    return json({ token, user: { email: emailKey, name: name.trim() } });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
