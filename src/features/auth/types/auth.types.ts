export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at?: string;
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  user?: User;
}

export interface RegisterResponse {
  user_id: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
