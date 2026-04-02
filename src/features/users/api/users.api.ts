import { httpClient } from '@/features/auth/store/auth.store';
import { UserListResponse } from '../types/user';
import { User } from '@/features/auth';

export async function getUsers(): Promise<UserListResponse> {
  return httpClient.get<UserListResponse>('/admin/users');
}

export async function getUserById(userId: string): Promise<User> {
  return httpClient.get<User>(`/admin/users/${userId}`);
}
