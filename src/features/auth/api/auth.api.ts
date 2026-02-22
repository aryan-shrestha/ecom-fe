import { httpClient } from "../store/auth.store";
import type {
  ChangePasswordRequest,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  RegisterCredentials,
  RegisterResponse,
  User,
} from "../types/auth.types";

/**
 * Fetch current user from /auth/me
 */
export async function fetchMe(): Promise<User> {
  return httpClient.get<User>("/auth/me");
}

/**
 * Login user - POST /auth/login
 * Returns access token and sets refresh_token + csrf_token cookies
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return httpClient.post<LoginResponse>("/auth/login", credentials);
}

/**
 * Register user - POST /auth/register
 */
export async function register(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  return httpClient.post<RegisterResponse>("/auth/register", credentials);
}

/**
 * Refresh access token - POST /auth/refresh
 * Requires refresh_token cookie and CSRF header
 */
export async function refreshAccessToken(): Promise<RefreshResponse> {
  return httpClient.post<RefreshResponse>("/auth/refresh", undefined, {
    requiresCsrf: true,
    skipAuth: true,
    skipRefresh: true,
  });
}

/**
 * Logout current session - POST /auth/logout
 * Requires refresh_token cookie and CSRF header
 */
export async function logout(): Promise<void> {
  return httpClient.post<void>("/auth/logout", undefined, {
    requiresCsrf: true,
  });
}

/**
 * Logout all sessions - POST /auth/logout-all
 * Requires access token
 */
export async function logoutAll(): Promise<void> {
  return httpClient.post<void>("/auth/logout-all");
}

/**
 * Change password - POST /auth/change-password
 * Requires access token
 */
export async function changePassword(
  data: ChangePasswordRequest,
): Promise<void> {
  return httpClient.post<void>("/auth/change-password", data);
}
