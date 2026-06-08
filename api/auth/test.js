export async function POST(req) {
  return new Response(JSON.stringify({ status: "ok", message: "Hello from auth API!" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
