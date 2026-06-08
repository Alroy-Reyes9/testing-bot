
export async function POST(req) {
  try {
    const blob = await import('@vercel/blob');
    return new Response(JSON.stringify({ ok: true, hasPut: typeof blob.put === 'function' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
