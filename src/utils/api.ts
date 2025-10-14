import { logout, getToken, getRefreshToken, storeToken, storeRefreshToken, getActiveRole } from './auth';

// Basic token / refresh handling assumptions:
// - Access token stored in localStorage as 'token'
// - Refresh token (if provided) stored as 'refreshToken'
// - Backend endpoints: POST /api/auth/refresh { refreshToken } -> { token, refreshToken? }
// - Enhanced user info endpoint: GET /api/auth/me-enhanced -> { user } (includes honorific, courses, department)

const { getApiBase } = await import('./endpoint');

let refreshing: Promise<string | null> | null = null;

async function refreshToken(role?: string): Promise<string | null> {
  if (refreshing) return refreshing;
  const rt = getRefreshToken(role);
  if (!rt) return null;
  refreshing = fetch(`${getApiBase()}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: rt })
  })
    .then(r => r.json().catch(() => ({})))
    .then(data => {
      if (data.token) {
        const r = role || getActiveRole() || (data.user?.role?.toLowerCase());
        if (r) {
          storeToken(r, data.token);
          if (data.refreshToken) storeRefreshToken(r, data.refreshToken);
        }
        return data.token as string;
      }
      logout();
      return null;
    })
    .finally(() => { refreshing = null; });
  return refreshing;
}

function getAuthHeaders(roleCheck?: string, role?: string) {
  const token = getToken(role);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (roleCheck) headers['X-Expect-Role'] = roleCheck; // server can enforce role
  return headers;
}

export interface ApiOptions extends RequestInit {
  role?: string; // expected role for server-side validation
  retry?: boolean;
}

export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { role, retry, headers, ...rest } = options;
  const endPoint = getApiBase();
  const authHeaders = getAuthHeaders(role, role);
  const finalHeaders = { ...authHeaders, ...(headers || {}) };
  
  // Debug logging
  console.log('[API-FETCH] Request details:', {
    path,
    role,
    hasToken: !!authHeaders.Authorization,
    tokenPreview: authHeaders.Authorization ? authHeaders.Authorization.substring(0, 30) + '...' : 'none',
    headers: finalHeaders
  });
  
  const res = await fetch(`${endPoint}${path}`, {
    ...rest,
    headers: finalHeaders
  });

  console.log('[API-FETCH] Response status:', res.status);

  if (res.status === 401 && !retry) {
    console.warn('[API-FETCH] 401 Unauthorized - attempting token refresh');
    const newToken = await refreshToken(role);
    if (newToken) {
      console.log('[API-FETCH] Token refreshed, retrying request');
      return apiFetch<T>(path, { ...options, retry: true });
    }
    // final unauthorized
    console.error('[API-FETCH] Token refresh failed, logging out');
    logout(role);
    window.location.href = '/student-login';
    throw new Error('Unauthorized');
  }

  if (res.status === 403) {
    // forbidden; maybe role mismatch
    console.warn('[API-FETCH] 403 Forbidden or role mismatch');
    throw new Error('Forbidden');
  }

  const data = await res.json().catch(() => ({}));
  
  // Check if the response indicates an error
  if (!res.ok) {
    console.error('[API-FETCH] Request failed:', {
      status: res.status,
      statusText: res.statusText,
      data
    });
    throw new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
  }
  
  return data as T;
}

export async function fetchUser(role?: string): Promise<any | null> {
  try {
  const data = await apiFetch('/api/auth/me-enhanced', { method: 'GET', role });
    if (data?.user) return data.user;
    return null;
  } catch {
    return null;
  }
}
