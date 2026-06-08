import { addUser } from '../_db.js';
import { createToken, corsHeaders, json } from '../_auth.js';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    return json({ ok: true, message: 'Imports work!' });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
