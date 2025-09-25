// Auth utility helpers with dual-session namespacing support
// Namespacing strategy: token_<role>, user_<role>, refreshToken_<role>
// active role per tab stored in sessionStorage: activeRole

export type UserLike = { role?: string; [k: string]: any } | null;

const roleKey = (role: string, base: string) => `${base}_${role.toLowerCase()}`;

export const getActiveRole = (): string | null => {
  try { return sessionStorage.getItem('activeRole'); } catch { return null; }
};

export const setActiveRole = (role: string) => {
  try { sessionStorage.setItem('activeRole', role.toLowerCase()); } catch {}
};

export const getUser = (role?: string): UserLike => {
  try {
    const r = (role || getActiveRole() || '')?.toLowerCase();
    if (r) {
      const raw = localStorage.getItem(roleKey(r, 'user'));
      if (raw) return JSON.parse(raw);
    }
    // fallback legacy single-user storage
    const legacy = localStorage.getItem('user');
    return legacy ? JSON.parse(legacy) : null;
  } catch { return null; }
};

export const storeUser = (role: string, user: any) => {
  try { localStorage.setItem(roleKey(role, 'user'), JSON.stringify(user)); } catch {}
};

export const getToken = (role?: string): string | null => {
  const r = (role || getActiveRole() || '')?.toLowerCase();
  if (r) {
    const v = localStorage.getItem(roleKey(r, 'token'));
    if (v) return v;
  }
  return localStorage.getItem('token'); // legacy fallback
};

export const storeToken = (role: string, token: string) => {
  try { localStorage.setItem(roleKey(role, 'token'), token); } catch {}
};

export const getRefreshToken = (role?: string): string | null => {
  const r = (role || getActiveRole() || '')?.toLowerCase();
  if (r) {
    const v = localStorage.getItem(roleKey(r, 'refreshToken'));
    if (v) return v;
  }
  return localStorage.getItem('refreshToken');
};

export const storeRefreshToken = (role: string, token: string) => {
  try { localStorage.setItem(roleKey(role, 'refreshToken'), token); } catch {}
};

export const getRole = (role?: string): string => {
  const u = getUser(role);
  return (u?.role || '').toLowerCase();
};

export const isAuthenticated = (role?: string) => !!getToken(role);

export const logout = (role?: string) => {
  try {
    if (role) {
      const r = role.toLowerCase();
      ['token','user','refreshToken'].forEach(k => localStorage.removeItem(roleKey(r, k)));
      const active = getActiveRole();
      if (active === r) sessionStorage.removeItem('activeRole');
    } else {
      // legacy clear all
      ['student','lecturer'].forEach(r => ['token','user','refreshToken'].forEach(k => localStorage.removeItem(roleKey(r,k))));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('activeRole');
    }
  } catch {}
};

export const enforceRole = (required: string, role?: string) => {
  const r = getRole(role);
  return r === required.toLowerCase();
};
