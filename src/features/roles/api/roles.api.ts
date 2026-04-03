import { httpClient } from '@/features/auth/store/auth.store';
import { CreateRoleRequest, Role, RoleListResponse, UpdateRoleRequest } from '../types/role.types';

export async function getRoles(): Promise<RoleListResponse> {
  return httpClient.get<RoleListResponse>('/rbac/roles');
}

export async function getRoleById(roleId: string): Promise<Role> {
  return httpClient.get(`/rbac/roles/${roleId}`);
}

export async function createRole(data: CreateRoleRequest): Promise<Role> {
  return httpClient.post('/rbac/roles', data);
}

export async function updateRole(roleId: string, data: UpdateRoleRequest): Promise<Role> {
  return httpClient.patch(`/rbac/roles/${roleId}`, data);
}

export async function deleteRole(roleName: string): Promise<void> {
  return httpClient.delete(`/rbac/roles/${roleName}`);
}
