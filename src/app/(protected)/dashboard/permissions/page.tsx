'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PermissionCreateDialog from '@/features/permissions/components/permissions-create-dialog';
import PermissionsDeleteDialog from '@/features/permissions/components/permissions-delete-dialog';
import PermissionTable from '@/features/permissions/components/permissions-table';
import { Plus } from 'lucide-react';
import React from 'react';

const page = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedPermissionCode, setSelectedPermissionCode] = React.useState<string | null>(null);

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prev) => !prev);
  };

  const handleSetSelectedPermissionCode = (permissionCode: string) => {
    setSelectedPermissionCode(permissionCode);
    toggleDeleteDialog();
  };

  const toggleCreateDialog = () => {
    setIsCreateDialogOpen((prev) => !prev);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <h1 className="text-xl font-semibold">Permissions</h1>
            </CardTitle>
            <Button onClick={toggleCreateDialog}>
              <Plus /> Add Permission
            </Button>
          </div>
          <CardDescription>Manage your user permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionTable
            toggleCreateDialog={toggleCreateDialog}
            setSelectedPermissionCode={handleSetSelectedPermissionCode}
          />
        </CardContent>
      </Card>
      <PermissionCreateDialog isOpen={isCreateDialogOpen} toggleDialog={toggleCreateDialog} />
      <PermissionsDeleteDialog
        permissionCode={selectedPermissionCode ?? ''}
        isOpen={isDeleteDialogOpen}
        toggleDialog={toggleDeleteDialog}
      />
    </>
  );
};

export default page;
