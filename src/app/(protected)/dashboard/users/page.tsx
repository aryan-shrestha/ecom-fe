import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserTable from '@/features/users/components/user-table';
import { Plus } from 'lucide-react';
import React from 'react';

const page = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Users</CardTitle>
          <Button>
            <Plus className="h-4 w-4" /> Add User
          </Button>
        </div>
        <CardDescription>
          Manage your application's users, including their roles and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserTable />
      </CardContent>
    </Card>
  );
};

export default page;
