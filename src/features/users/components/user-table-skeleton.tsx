'use client';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';

const UserTableSkeleton = () => {
  return (
    <Table className="w-full table-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="border-b px-4 py-4">ID</TableHead>
          <TableHead className="border-b px-4 py-4">Email</TableHead>
          <TableHead className="border-b px-4 py-4">First Name</TableHead>
          <TableHead className="border-b px-4 py-4">Last Name</TableHead>
          <TableHead className="border-b px-4 py-4">Active</TableHead>
          <TableHead className="border-b px-4 py-4">Verified</TableHead>
          <TableHead className="border-b px-4 py-4">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className="border-b px-4 py-4">
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell className="border-b px-4 py-4">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="border-b px-4 py-4">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="border-b px-4 py-4">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="border-b px-4 py-4">
              <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell className="border-b px-4 py-4">
              <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell className="border-b px-4 py-4">
              <Skeleton className="h-4 w-32" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTableSkeleton;
