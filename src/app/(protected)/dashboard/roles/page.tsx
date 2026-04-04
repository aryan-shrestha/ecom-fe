'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RoleCreateDialog from '@/features/roles/components/roles-create-dialog';
import RolesDeleteDialog from '@/features/roles/components/roles-delete-dialog';
import RoleTable from '@/features/roles/components/roles-table';
import { Plus } from 'lucide-react';
import React from 'react';

const page = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedRoleName, setSelectedRoleName] = React.useState<string>('');

  const toggleCreateDialog = () => {
    setIsCreateDialogOpen((prev) => !prev);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prev) => !prev);
  };

  const handleSetSelectedRoleName = (name: string) => {
    setSelectedRoleName(name);
    toggleDeleteDialog();
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
    </>
  );
};

export default page;
