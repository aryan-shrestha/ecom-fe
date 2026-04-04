export interface Permission {
  id: string;
  code: string;
}

export interface PermissionListResponse {
  permissions: Permission[];
  total: Number;
  offset: Number;
  limit: Number;
}

export interface CreatePermissionRequest {
  code: string;
}
