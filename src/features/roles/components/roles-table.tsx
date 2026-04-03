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
import { Pen, Trash2 } from 'lucide-react';
import RolesTableSkeleton from './roles-table-skeleton';
import { RoleEmpty } from './roles-empty';

interface RoleTableProps {
  toggleCreateDialog: () => void;
  setSelectedRoleName: (name: string) => void;
}

const RoleTable = ({ toggleCreateDialog, setSelectedRoleName }: RoleTableProps) => {
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
              <TableHead className="border-b px-4 py-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="border-b px-4 py-4">{role.id}</TableCell>
                <TableCell className="border-b px-4 py-4">{role.name}</TableCell>
                <TableCell className="space-x-2 border-b px-4 py-4">
                  <Button variant="outline" size="icon">
                    <Pen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedRoleName(role.name);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
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

export default RoleTable;
