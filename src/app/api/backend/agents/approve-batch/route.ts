// app/api/backend/agents/approve-batch/route.ts
import { backendFetch } from '@/lib/backendClient';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();

  const res = await backendFetch('/agents/approve-batch/', {
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