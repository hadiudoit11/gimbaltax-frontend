// app/api/backend/agents/results/[sessionId]/route.ts
import { backendFetch } from '@/lib/backendClient';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  console.log('[API Route] GET /api/backend/agents/results/', sessionId);

  try {
    const res = await backendFetch(`/agents/results/${sessionId}/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('[API Route] Backend response status:', res.status);
    const text = await res.text();
    console.log('[API Route] Backend response body:', text);
    
    return new Response(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('[API Route] Backend request failed:', error);
    return new Response(JSON.stringify({ error: 'Backend request failed', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}