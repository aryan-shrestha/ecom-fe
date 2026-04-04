import { httpClient } from '@/features/auth/store/auth.store';
import {
  Permission,
  PermissionListResponse,
  CreatePermissionRequest,
} from '../types/permissions.types';

export async function getPermissions(): Promise<PermissionListResponse> {
  return httpClient.get('/rbac/permissions');
}

export async function createPermission(payload: CreatePermissionRequest): Promise<Permission> {
  return httpClient.post('/rbac/permissions', payload);
}

export async function deletePermission(permissionCode: string): Promise<void> {
  return httpClient.delete(`/rbac/permissions/${permissionCode}`);
}
