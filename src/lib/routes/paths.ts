export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ACCOUNT: '/account',
  PRODUCTS: '/dashboard/products',
  PRODUCTS_NEW: '/dashboard/products/new',
  CATEGORIES: '/dashboard/categories',
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.ACCOUNT,
  ROUTES.PRODUCTS,
  ROUTES.PRODUCTS_NEW,
] as const;
