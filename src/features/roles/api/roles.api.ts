import { httpClient } from '@/features/auth/store/auth.store';
import {
  AsignPermissionToRoleRequest,
  CreateRoleRequest,
  RemovePermissionFromRoleRequest,
  Role,
  RoleListResponse,
  UpdateRoleRequest,
} from '../types/role.types';
import { PermissionListResponse } from '@/features/permissions/types/permissions.types';

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

export async function getPermissionsByRole(roleName: string): Promise<PermissionListResponse> {
  return httpClient.get(`/rbac/roles/${roleName}/permissions`);
}

export async function asignPermissionToRole(
  roleName: string,
  payload: AsignPermissionToRoleRequest,
): Promise<void> {
  return httpClient.post(`/rbac/roles/${roleName}/assign-permission/`, payload);
}

export async function removePermissionFromRole(
  roleName: string,
  payload: RemovePermissionFromRoleRequest,
): Promise<void> {
  return httpClient.post(`/rbac/roles/${roleName}/remove-permission/`, payload);
}
