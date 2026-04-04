export interface Role {
  id: string;
  name: string;
}

export interface RoleListResponse {
  roles: Role[];
  total: Number;
  offset: Number;
  limit: Number;
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest extends CreateRoleRequest {}

export interface AsignPermissionToRoleRequest {
  permission_code: string;
}

export interface RemovePermissionFromRoleRequest {
  permission_code: string;
}
