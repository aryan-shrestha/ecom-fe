'use client';
import React from 'react';
import { useRolesListQuery } from '../queries/roles.queries';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, Pen, Trash2, UserKey } from 'lucide-react';
import RolesTableSkeleton from './roles-table-skeleton';
import { RoleEmpty } from './roles-empty';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RoleTableProps {
  toggleCreateDialog: () => void;
  toggleDeleteDialog: () => void;
  togglePermissionsDialog: () => void;
  setSelectedRoleName: (name: string) => void;
}

const RoleTable = ({
  toggleCreateDialog,
  toggleDeleteDialog,
  togglePermissionsDialog,
  setSelectedRoleName,
}: RoleTableProps) => {
  const { data, isPending, error } = useRolesListQuery();

  if (isPending) {
    return <RolesTableSkeleton />;
  }

  if (error) {
    return <p>Error loading roles: {error.message}</p>;
  }

  if (data?.roles.length === 0) {
    return <RoleEmpty toggleCreateDialog={toggleCreateDialog} />;
  }

  if (data) {
    return (
      <ScrollArea className="h-100">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="border-b px-4 py-4">ID</TableHead>
              <TableHead className="border-b px-4 py-4">Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="border-b px-4 py-4">{role.id}</TableCell>
                <TableCell className="border-b px-4 py-4">{role.name}</TableCell>
                <TableCell className="space-x-2 border-b px-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="sm">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRoleName(role.name);
                          toggleDeleteDialog();
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRoleName(role.name);
                          togglePermissionsDialog();
                        }}
                      >
                        <UserKey className="mr-2 h-4 w-4" />
                        Manage Permissions
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  }
};

export default RoleTable;
