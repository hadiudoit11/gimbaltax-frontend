/**
 * Centralized API Request Provider
 * Uses src/lib/backendUrl.ts for backend URL management
 * Provides type-safe API helpers with authentication
 */

import { getBackendUrl } from "./backendUrl";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Simple auth helper without next-auth dependency
async function getSessionSafe(): Promise<any | null> {
  // TODO: Replace with actual authentication logic
  // For now, return null (no authentication)
  return null;
}

export const getAuthHeaders = async (extra?: HeadersInit): Promise<HeadersInit> => {
  const headers: HeadersInit = { 
    "Content-Type": "application/json", 
    "Authorization": "Bearer mock-token", // Use mock token for development
    ...(extra || {}) 
  };
  
  console.debug('[apiRequest] Adding mock authentication token');
  
  return headers;
};

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const body = await response.json();
      const msg = body?.message || body?.detail || response.statusText || `HTTP ${response.status}`;
      throw new Error(msg);
    } catch (_) {
      throw new Error(response.statusText || `HTTP ${response.status}`);
    }
  }

  const ct = response.headers.get("content-type") || "";
  if (ct.includes("application/json")) return response.json();
  return response.text();
};

const buildUrl = (endpoint: string, params?: Record<string, unknown>) => {
  const base = getBackendUrl();
  let url: URL;

  try {
    // Prefer using the URL constructor with a base — it correctly handles
    // leading/trailing slashes and relative paths.
    url = endpoint.startsWith("http") ? new URL(endpoint) : new URL(endpoint, base);
  } catch (err) {
    // As a last-resort fall back to manual concatenation (keeps previous behavior)
    const urlString = endpoint.startsWith("http") ? endpoint : `${base}/${endpoint.replace(/^\//, "")}`;
    url = new URL(urlString);
  }

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }

  return url.toString();
};

export const apiGet = async (endpoint: string, options: RequestOptions = {}) => {
  const { params, headers: optHeaders, ...fetchOpts } = options;
  const session = await getSessionSafe();
  const mergedParams: Record<string, unknown> = { ...(params as Record<string, unknown> || {}) };
  
  // Inject session organization/site if available
  if (session?.user?.organization && !mergedParams["organization_id"]) {
    mergedParams["organization_id"] = session.user.organization;
  }
  if (session?.user?.current_site_id && !mergedParams["site_id"]) {
    mergedParams["site_id"] = session.user.current_site_id;
  }

  const url = buildUrl(endpoint, mergedParams);
  const headers = await getAuthHeaders(optHeaders as HeadersInit | undefined);
  console.debug('[apiGet] fetching', { url, headers, options: fetchOpts });
  const res = await fetch(url, { method: "GET", headers, ...fetchOpts });
  return handleResponse(res);
};

const DEFAULT_TIMEOUT = 10000; // 10 seconds

async function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, timeout = DEFAULT_TIMEOUT) {
  if (timeout <= 0) return fetch(input, init);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const apiPost = async (endpoint: string, data?: unknown, options: RequestOptions = {}) => {
  const { params, headers: optHeaders, ...fetchOpts } = options;
  const session = await getSessionSafe();
  const body = (typeof data === "object" && data !== null) ? { ...(data as Record<string, unknown>) } : data;

  if (body && typeof body === "object") {
    if (session?.user?.organization && !(body as any)["organization_id"]) {
      (body as any)["organization_id"] = session.user.organization;
    }
    if (session?.user?.current_site_id && !(body as any)["site_id"]) {
      (body as any)["site_id"] = session.user.current_site_id;
    }
  }

  const url = buildUrl(endpoint, params as Record<string, unknown> | undefined);
  const headers = await getAuthHeaders(optHeaders as HeadersInit | undefined);
  console.debug('[apiPost] posting', { url, headers, body, options: fetchOpts });
  const res = await fetchWithTimeout(url, { 
    method: "POST", 
    headers, 
    body: body !== undefined ? JSON.stringify(body) : undefined, 
    ...fetchOpts 
  });
  return handleResponse(res as Response);
};

export const apiPut = async (endpoint: string, data?: unknown, options: RequestOptions = {}) => {
  const { params, headers: optHeaders, ...fetchOpts } = options;
  const session = await getSessionSafe();
  const body = (typeof data === "object" && data !== null) ? { ...(data as Record<string, unknown>) } : data;
  
  if (body && typeof body === "object") {
    if (session?.user?.organization && !(body as any)["organization_id"]) {
      (body as any)["organization_id"] = session.user.organization;
    }
    if (session?.user?.current_site_id && !(body as any)["site_id"]) {
      (body as any)["site_id"] = session.user.current_site_id;
    }
  }

  const url = buildUrl(endpoint, params as Record<string, unknown> | undefined);
  const headers = await getAuthHeaders(optHeaders as HeadersInit | undefined);
  
  console.debug('[apiPut] making PUT request', { url, headers, body, options: fetchOpts });
  
  const res = await fetch(url, { 
    method: "PUT", 
    headers, 
    body: body !== undefined ? JSON.stringify(body) : undefined, 
    ...fetchOpts 
  });
  
  console.debug('[apiPut] response received', { status: res.status, statusText: res.statusText });
  
  return handleResponse(res as Response);
};

export const apiDelete = async (endpoint: string, options: RequestOptions = {}) => {
  const { params, headers: optHeaders, ...fetchOpts } = options;
  const url = buildUrl(endpoint, params as Record<string, unknown> | undefined);
  const headers = await getAuthHeaders(optHeaders as HeadersInit | undefined);
  const res = await fetch(url, { method: "DELETE", headers, ...fetchOpts });
  return handleResponse(res as Response);
};

export default {
  getAuthHeaders,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
};