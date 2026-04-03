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
import { useDeleteRoleMutation } from '../queries/roles.queries';
import { toaster } from '@/lib/toaster';
import { HttpError } from '@/lib/http/errors';

interface RolesDeleteDialogProps {
  roleName: string;
  isOpen: boolean;
  toggleDialog: () => void;
}

export default function RolesDeleteDialog({
  roleName,
  isOpen,
  toggleDialog,
}: RolesDeleteDialogProps) {
  const deleteRoleMutation = useDeleteRoleMutation(roleName);

  const onDelete = async () => {
    try {
      await deleteRoleMutation.mutateAsync();
      toaster.success('Role deleted successfully');
      toggleDialog();
    } catch (error) {
      if (error instanceof HttpError) {
        toaster.error('Failed to delete role', error);
        return;
      }
      toaster.error('Failed to delete role');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={toggleDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this role. Are you sure you want to continue?
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
