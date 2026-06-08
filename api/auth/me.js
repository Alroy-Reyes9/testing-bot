import { getUserFromRequest, corsHeaders, json } from '../_auth.js';

export async function GET(req) {
  const user = getUserFromRequest(req);
  if (!user) {
    return json({ error: 'Not authenticated' }, 401);
  }
  return json({ user });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
