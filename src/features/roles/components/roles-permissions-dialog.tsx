'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePermissionsListQuery } from '@/features/permissions/queries/permissions.queries';
import {
  useAsignPermissionToRoleMutation,
  useGetPermissionsByRoleQuery,
  useRemovePermissionFromRoleMutation,
} from '../queries/roles.queries';
import { Permission } from '@/features/permissions/types/permissions.types';
import { HttpError } from '@/lib/http/errors';
import { toaster } from '@/lib/toaster';
import RolesPermissionSkeletonDialog from './roles-permission-dialog-skeleton';

interface RolesPermissionsDialogProps {
  isOpen: boolean;
  toggleDialog: () => void;
  selectedRoleName: string;
}

const RolesPermissionsDialog = ({
  isOpen,
  toggleDialog,
  selectedRoleName,
}: RolesPermissionsDialogProps) => {
  const permissionListQuery = usePermissionsListQuery();
  const permissionByRoleQuery = useGetPermissionsByRoleQuery(selectedRoleName);
  const assignPermissionToRoleMutation = useAsignPermissionToRoleMutation(selectedRoleName);
  const removePermissionFromRoleMutation = useRemovePermissionFromRoleMutation(selectedRoleName);

  const isPermissionAssignedToRole = (permissionId: string): boolean => {
    if (!permissionByRoleQuery.data) return false;

    return permissionByRoleQuery.data.permissions.some((perm) => perm.id === permissionId);
  };

  const isLoading = permissionListQuery.isPending || permissionByRoleQuery.isPending;
  const error = permissionListQuery.error || permissionByRoleQuery.error;

  const handleTogglePermission = async (permission: Permission) => {
    const isAssigned = isPermissionAssignedToRole(permission.id);

    if (isAssigned) {
      try {
        await removePermissionFromRoleMutation.mutateAsync({ permission });
      } catch (error) {
        if (error instanceof HttpError) {
          console.error('Error removing permission from role:', error.message);
          toaster.error(`Failed to remove permission: ${error.message}`);
        } else {
          console.error('Unexpected error:', error);
          toaster.error('An unexpected error occurred while removing permission.');
        }
      }
    } else {
      try {
        await assignPermissionToRoleMutation.mutateAsync({ permission });
      } catch (error) {
        if (error instanceof HttpError) {
          console.error('Error assigning permission to role:', error.message);
          toaster.error(`Failed to assign permission: ${error.message}`);
        } else {
          console.error('Unexpected error:', error);
          toaster.error('An unexpected error occurred while assigning permission.');
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Permissions assigned to <span className="font-medium">{selectedRoleName}</span>.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96 pr-4">
          {isLoading && <RolesPermissionSkeletonDialog />}

          {error && (
            <p className="text-sm text-destructive">Error loading permissions: {error.message}</p>
          )}

          {!isLoading && !error && permissionListQuery.data && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {permissionListQuery.data.permissions.map((perm) => {
                const switchId = `permission-${perm.id}`;

                return (
                  <div
                    key={perm.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <Label htmlFor={switchId} className="cursor-default">
                      {perm.code}
                    </Label>

                    <Switch
                      id={switchId}
                      checked={isPermissionAssignedToRole(perm.id)}
                      onCheckedChange={(_) => {
                        handleTogglePermission(perm);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RolesPermissionsDialog;
