import { addClient, removeClient } from "@/lib/sse";

export async function GET(req) {
  // Create stream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Register client
  addClient(writer);

  // Send initial handshake event
  writer.write(`event: connected\ndata: "SSE Connected"\n\n`);

  // Heartbeat ping every 20 seconds (prevents disconnect)
  const pingInterval = setInterval(() => {
    writer.write(`event: ping\ndata: "keep-alive"\n\n`);
  }, 20000);

  // Clean up when client disconnects
  req.signal.addEventListener("abort", () => {
    clearInterval(pingInterval);
    removeClient(writer);
    writer.close();
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no" // Important for Nginx (disables buffering)
    },
  });
}
