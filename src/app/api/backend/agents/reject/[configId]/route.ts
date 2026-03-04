// app/api/backend/agents/reject/[configId]/route.ts
import { backendFetch } from '@/lib/backendClient';

export const runtime = 'nodejs';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ configId: string }> }
) {
  const { configId } = await params;
  const body = await req.text();

  const res = await backendFetch(`/agents/reject/${configId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  });
}