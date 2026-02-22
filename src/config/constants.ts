export const APP_NAME = 'E-Commerce';
export const APP_DESCRIPTION = 'Modern E-Commerce Platform';

export const QUERY_STALE_TIME = 1000 * 60 * 5; // 5 minutes
export const QUERY_CACHE_TIME = 1000 * 60 * 30; // 30 minutes

export const COOKIE_NAMES = {
  REFRESH_TOKEN: 'refresh_token',
  CSRF_TOKEN: 'csrf_token',
} as const;
