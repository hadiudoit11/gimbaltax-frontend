// lib/backendClient.ts
import { getBackendUrl } from './backendUrl';

// Backend API base URL - uses centralized URL logic
const BACKEND_API_BASE_URL = `${getBackendUrl()}/api/v1`;

/**
 * Simple helper that forwards requests to the Django backend,
 * attaching common headers (no auth for now).
 */
export async function backendFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = `${BACKEND_API_BASE_URL}${path}`;
  const headers = new Headers(init.headers || {});

  console.log('[backendFetch] Calling:', init.method || 'GET', url);

  return fetch(url, {
    ...init,
    headers,
    // streaming + no caching for agent operations
    cache: 'no-store',
  });
}