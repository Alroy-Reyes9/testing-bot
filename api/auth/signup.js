import { addUser } from '../_db.js';
import { createToken, corsHeaders, json } from '../_auth.js';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !name || !password) {
      return json({ error: 'Email, name, and password are required' }, 400);
    }
    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await addUser(email.toLowerCase().trim(), name.trim(), passwordHash);

    if (!created) {
      return json({ error: 'An account with this email already exists' }, 409);
    }

    const token = createToken({ email: email.toLowerCase().trim(), name: name.trim() });
    return json({ token, user: { email: email.toLowerCase().trim(), name: name.trim() } });
  } catch (err) {
    return json({ error: 'Internal server error' }, 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
