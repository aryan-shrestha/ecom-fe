import * as RoleApi from '../api/roles.api';
import { CreateRoleRequest } from '../types/role.types';
import { rolesKeys } from './roles.keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Permission } from '@/features/permissions/types/permissions.types';

type RolePermissionsResponse = {
  permissions: Permission[];
};

export function useRolesListQuery() {
  return useQuery({
    queryKey: rolesKeys.list(),
    queryFn: () => RoleApi.getRoles(),
    staleTime: 1000 * 60 * 5,
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

// probably should be renamed to useUpdateRoleMutation
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

export function useGetPermissionsByRoleQuery(roleName: string) {
  return useQuery({
    queryKey: rolesKeys.permissions(roleName),
    queryFn: () => RoleApi.getPermissionsByRole(roleName),
    enabled: !!roleName,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDeleteRoleMutation(roleName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => RoleApi.deleteRole(roleName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.detail(roleName),
      });
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });
}

export function useAsignPermissionToRoleMutation(roleName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ permission }: { permission: Permission }) =>
      RoleApi.asignPermissionToRole(roleName, {
        permission_code: permission.code,
      }),

    onMutate: async ({ permission }) => {
      await queryClient.cancelQueries({
        queryKey: rolesKeys.permissions(roleName),
      });

      const previousPermissions = queryClient.getQueryData<RolePermissionsResponse>(
        rolesKeys.permissions(roleName),
      );

      queryClient.setQueryData<RolePermissionsResponse>(rolesKeys.permissions(roleName), (old) => {
        if (!old) {
          return { permissions: [permission] };
        }

        const alreadyExists = old.permissions.some((p) => p.id === permission.id);
        if (alreadyExists) return old;

        return {
          ...old,
          permissions: [...old.permissions, permission],
        };
      });

      return { previousPermissions };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousPermissions) {
        queryClient.setQueryData(rolesKeys.permissions(roleName), context.previousPermissions);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.permissions(roleName),
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.detail(roleName),
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.lists(),
      });
    },
  });
}

export function useRemovePermissionFromRoleMutation(roleName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ permission }: { permission: Permission }) =>
      RoleApi.removePermissionFromRole(roleName, {
        permission_code: permission.code,
      }),

    onMutate: async ({ permission }) => {
      await queryClient.cancelQueries({
        queryKey: rolesKeys.permissions(roleName),
      });

      const previousPermissions = queryClient.getQueryData<RolePermissionsResponse>(
        rolesKeys.permissions(roleName),
      );

      queryClient.setQueryData<RolePermissionsResponse>(rolesKeys.permissions(roleName), (old) => {
        if (!old) return old;

        return {
          ...old,
          permissions: old.permissions.filter((p) => p.id !== permission.id),
        };
      });

      return { previousPermissions };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousPermissions) {
        queryClient.setQueryData(rolesKeys.permissions(roleName), context.previousPermissions);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.permissions(roleName),
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.detail(roleName),
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.lists(),
      });
    },
  });
}
