'use client';
import { Loader, Trash2Icon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toaster } from '@/lib/toaster';
import { HttpError } from '@/lib/http/errors';
import { useDeletePermissionMutation } from '../queries/permissions.queries';

interface PermissionsDeleteDialogProps {
  permissionCode: string;
  isOpen: boolean;
  toggleDialog: () => void;
}

export default function PermissionsDeleteDialog({
  permissionCode,
  isOpen,
  toggleDialog,
}: PermissionsDeleteDialogProps) {
  const deleteRoleMutation = useDeletePermissionMutation(permissionCode);

  const onDelete = async () => {
    try {
      await deleteRoleMutation.mutateAsync();
      toaster.success('Permission deleted successfully');
      toggleDialog();
    } catch (error) {
      if (error instanceof HttpError) {
        toaster.error('Failed to delete permission', error);
        return;
      }
      toaster.error('Failed to delete permission');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={toggleDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Permission?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this permission. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            size="sm"
            disabled={deleteRoleMutation.isPending}
            onClick={toggleDialog}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size={'sm'}
            onClick={onDelete}
            disabled={deleteRoleMutation.isPending}
          >
            {deleteRoleMutation.isPending && <Loader className="animate-spin" />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
