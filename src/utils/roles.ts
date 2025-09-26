// Central place for role-based path helpers
export const STUDENT_ROLE = 'student';
export const LECTURER_ROLE = 'lecturer';

export function loginPath(role?: string) {
  if (!role) return '/student-login';
  return role === LECTURER_ROLE ? '/lecturer-login' : '/student-login';
}

export function dashboardPath(role?: string) {
  if (!role) return '/student-login';
  return role === LECTURER_ROLE ? '/lecturer-dashboard' : '/dashboard';
}

export function normalizeRole(r?: string | null) {
  return (r || '').toLowerCase() === LECTURER_ROLE ? LECTURER_ROLE : STUDENT_ROLE;
}
