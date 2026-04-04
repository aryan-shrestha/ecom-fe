import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const RolesPermissionSkeletonDialog = () => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: 16 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between rounded-md border p-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
          </div>

          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default RolesPermissionSkeletonDialog;
