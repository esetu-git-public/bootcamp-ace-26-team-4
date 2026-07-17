
// Temporary frontend-only admin allowlist.
//
// The backend's user model (see backend/auth.py / backend/users.json) has no
// "role" field yet, so there's no real way to know server-side who is an
// admin. Until that's added, we gate the admin-only Feedback view here by
// email. Add teammate emails who should be able to see submitted feedback.
//
// TODO: once the backend adds a `role` field to users.json / the JWT payload,
// replace this with a real check against `user.role === 'admin'`.
export const ADMIN_EMAILS: string[] = [
  'sreejaa3115@gmail.com',
  'mr.siddartha8910@gmail.com',
  'siddenkiprasannalaxmi@gmail.com'
];

export const isAdminUser = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
};