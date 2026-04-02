import { COOKIE_NAMES } from '@/config/constants';

/**
 * Read CSRF token from cookies on the client-side
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAMES.CSRF_TOKEN) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

/**
 * Check if refresh token cookie exists (for client-side checks)
 */
export function hasRefreshToken(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const cookies = document.cookie.split(';');
  return cookies.some((cookie) => {
    const [name] = cookie.trim().split('=');
    return name === COOKIE_NAMES.REFRESH_TOKEN;
  });
}
