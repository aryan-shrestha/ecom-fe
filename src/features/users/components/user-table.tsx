'use client';
import React from 'react';
import { useUsersListQuery } from '../queries/users.queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, Menu, Plus, Scroll } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import UserTableSkeleton from './user-table-skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const UserTable = () => {
  const { data, isPending, error } = useUsersListQuery();

  if (isPending) {
    return <UserTableSkeleton />;
  }

  if (error) {
    return <p>Error loading users: {error.message}</p>;
  }

  if (!data) {
    return <p>No users found.</p>;
  }

  if (data) {
    return (
      <ScrollArea className="h-100">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="border-b px-4 py-4">ID</TableHead>
              <TableHead className="border-b px-4 py-4">Email</TableHead>
              <TableHead className="border-b px-4 py-4">First Name</TableHead>
              <TableHead className="border-b px-4 py-4">Last Name</TableHead>
              <TableHead className="border-b px-4 py-4">Active</TableHead>
              <TableHead className="border-b px-4 py-4">Verified</TableHead>
              <TableHead className="border-b px-4 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="border-b px-4 py-4">{user.id}</TableCell>
                <TableCell className="border-b px-4 py-4">{user.email}</TableCell>
                <TableCell className="border-b px-4 py-4">{user.first_name}</TableCell>
                <TableCell className="border-b px-4 py-4">{user.last_name}</TableCell>
                <TableCell className="border-b px-4 py-4">
                  {user.is_active ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>}
                </TableCell>
                <TableCell className="border-b px-4 py-4">
                  {user.is_verified ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>}
                </TableCell>
                <TableCell className="border-b px-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
                      <DropdownMenuItem>Disable</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
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

export default UserTable;
