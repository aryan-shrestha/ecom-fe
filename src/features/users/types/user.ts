import { Role } from '@/features/roles/types/role.types';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[] | null;
}

export interface UserListResponse {
  users: User[];
  total: number;
  offset: number;
  limit: number;
}
