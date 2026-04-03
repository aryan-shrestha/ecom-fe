import * as RoleApi from '../api/roles.api';
import { CreateRoleRequest } from '../types/role.types';
import { rolesKeys } from './roles.keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useRolesListQuery() {
  return useQuery({
    queryKey: rolesKeys.list(),
    queryFn: () => RoleApi.getRoles(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRoleDetailQuery(roleId: string) {
  return useQuery({
    queryKey: rolesKeys.detail(roleId),
    queryFn: () => RoleApi.getRoleById(roleId),
    enabled: !!roleId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => RoleApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: CreateRoleRequest }) =>
      RoleApi.updateRole(roleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.detail(variables.roleId),
      });
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });
}

export function useDeleteRoleMutation(roleName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return RoleApi.deleteRole(roleName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.detail(roleName),
      });
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });
}
