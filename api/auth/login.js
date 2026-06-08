import { findUser } from '../_db.js';
import { createToken, corsHeaders, json } from '../_auth.js';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, 400);
    }

    const user = await findUser(email.toLowerCase().trim());
    if (!user) {
      return json({ error: 'Invalid email or password' }, 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return json({ error: 'Invalid email or password' }, 401);
    }

    const token = createToken({ email: user.email, name: user.name });
    return json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    return json({ error: 'Internal server error' }, 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
