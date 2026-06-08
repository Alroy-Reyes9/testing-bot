import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-production-pickleball-secret-key-2026';
const EXPIRY = '7d';

/**
 * Create a JWT token for a user.
 */
export function createToken(user) {
  return jwt.sign(
    { email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: EXPIRY }
  );
}

/**
 * Verify a JWT token. Returns payload or null.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extract user from Authorization header.
 * Returns { email, name } or null.
 */
export function getUserFromRequest(req) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  return verifyToken(token);
}

/**
 * CORS headers for API responses.
 */
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

/**
 * JSON response helper.
 */
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}
