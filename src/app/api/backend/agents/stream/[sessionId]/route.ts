// app/api/backend/agents/stream/[sessionId]/route.ts
import { backendFetch } from '@/lib/backendClient';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const backendRes = await backendFetch(`/agents/stream/${sessionId}/`, {
    method: 'GET',
    // Important for SSE; some servers like to see this
    headers: {
      Accept: 'text/event-stream',
    },
  });

  if (!backendRes.body) {
    return new Response('No stream body from backend', { status: 502 });
  }

  // Pipe the SSE stream through unchanged
  return new Response(backendRes.body, {
    status: backendRes.status,
    headers: {
      'Content-Type':
        backendRes.headers.get('Content-Type') ?? 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}