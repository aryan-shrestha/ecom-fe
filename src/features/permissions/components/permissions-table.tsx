'use client';
import React from 'react';
import { usePermissionsListQuery } from '../queries/permissions.queries';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { PermissionEmpty } from './permissions-empty';
import PermissionsTableSkeleton from './permissions-table-skeleton';

interface PermissionTableProps {
  toggleCreateDialog: () => void;
  setSelectedPermissionCode: (permissionCode: string) => void;
}

const PermissionTable = ({
  toggleCreateDialog,
  setSelectedPermissionCode,
}: PermissionTableProps) => {
  const { data, isPending, error } = usePermissionsListQuery();

  if (isPending) {
    return <PermissionsTableSkeleton />;
  }

  if (error) {
    return <PermissionEmpty toggleCreateDialog={toggleCreateDialog} errorMessage={error.message} />;
  }

  if (data?.permissions.length === 0) {
    return <PermissionEmpty toggleCreateDialog={toggleCreateDialog} />;
  }

  if (data) {
    return (
      <ScrollArea className="h-120">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-20 border-b bg-background px-4 py-4">
                ID
              </TableHead>
              <TableHead className="sticky top-0 z-20 border-b bg-background px-4 py-4">
                Code
              </TableHead>
              <TableHead className="sticky top-0 z-20 border-b bg-background px-4 py-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="px-4 py-4">{permission.id}</TableCell>
                <TableCell className="px-4 py-4">{permission.code}</TableCell>
                <TableCell className="space-x-2 px-4 py-4">
                  <Button
                    variant={'destructive'}
                    size={'icon'}
                    onClick={() => setSelectedPermissionCode(permission.code)}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  }
};

export default PermissionTable;
