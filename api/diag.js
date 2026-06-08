export async function GET() {
  try {
    const mod = await import('@vercel/blob');
    const { list } = mod;
    return new Response(JSON.stringify({ ok: true, hasList: typeof list === 'function' }), {
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
