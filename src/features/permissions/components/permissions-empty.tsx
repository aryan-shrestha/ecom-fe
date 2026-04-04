'use client';
import { CircleAlert, Plus, UserKey } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface PermissionEmptyProps {
  toggleCreateDialog: () => void;
  errorMessage?: string;
}

export function PermissionEmpty({ toggleCreateDialog, errorMessage }: PermissionEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {errorMessage ? (
            <CircleAlert className="h-16 w-16 text-destructive" />
          ) : (
            <UserKey className="h-16 w-16 text-muted-foreground" />
          )}
        </EmptyMedia>
        {errorMessage ? (
          <EmptyTitle className="text-destructive">
            Error occured while fetching permissions
          </EmptyTitle>
        ) : (
          <EmptyTitle>No Permissions Found</EmptyTitle>
        )}
        <EmptyDescription>
          {errorMessage ? (
            <p className="text-destructive">{errorMessage}</p>
          ) : (
            <p>
              You haven&apos;t created any permissions yet. Get started by creating your first
              permission.
            </p>
          )}
        </EmptyDescription>
      </EmptyHeader>
      {errorMessage ? null : (
        <EmptyContent className="flex-row justify-center gap-2">
          <Button onClick={toggleCreateDialog}>
            <Plus />
            Create Permission
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
