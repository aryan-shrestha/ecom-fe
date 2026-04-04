'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RoleCreateDialog from '@/features/roles/components/roles-create-dialog';
import RolesDeleteDialog from '@/features/roles/components/roles-delete-dialog';
import RolesPermissionsDialog from '@/features/roles/components/roles-permissions-dialog';
import RoleTable from '@/features/roles/components/roles-table';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

const page = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState<string>('');

  const toggleCreateDialog = () => {
    setIsCreateDialogOpen((prev) => !prev);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prev) => !prev);
  };

  const handleSetSelectedRoleName = (name: string) => {
    setSelectedRoleName(name);
  };

  const togglePermissionsDialog = () => {
    setIsPermissionsDialogOpen((prev) => !prev);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Roles</CardTitle>
            <Button onClick={toggleCreateDialog}>
              <Plus className="h-4 w-4" /> Add Role
            </Button>
          </div>
          <CardDescription>
            Manage your application's roles, including their permissions and access levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleTable
            toggleCreateDialog={toggleCreateDialog}
            toggleDeleteDialog={toggleDeleteDialog}
            togglePermissionsDialog={togglePermissionsDialog}
            setSelectedRoleName={handleSetSelectedRoleName}
          />
        </CardContent>
      </Card>
      <RoleCreateDialog isOpen={isCreateDialogOpen} toggleDialog={toggleCreateDialog} />
      <RolesDeleteDialog
        isOpen={isDeleteDialogOpen}
        toggleDialog={toggleDeleteDialog}
        roleName={selectedRoleName}
      />
      <RolesPermissionsDialog
        isOpen={isPermissionsDialogOpen}
        toggleDialog={togglePermissionsDialog}
        selectedRoleName={selectedRoleName}
      />
    </>
  );
};

export default page;
