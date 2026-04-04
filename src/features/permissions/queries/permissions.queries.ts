import * as PermissionApi from '../api/permissions.api';
import { CreatePermissionRequest } from '../types/permissions.types';
import { permissionKeys } from './permissions.keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePermissionsListQuery() {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: () => PermissionApi.getPermissions(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreatePermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) => PermissionApi.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
  });
}

export function useDeletePermissionMutation(permissionCode: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PermissionApi.deletePermission(permissionCode),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: permissionKeys.detail(permissionCode),
      });
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
  });
}
