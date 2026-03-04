// app/api/backend/agents/research/route.ts
import { NextRequest } from 'next/server';
import { backendFetch } from '@/lib/backendClient';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();

  const res = await backendFetch('/agents/research/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  // Pass JSON back as-is
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  });
}