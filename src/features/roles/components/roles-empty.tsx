import { ArrowUpRightIcon, Plus, ShieldUser } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface RoleEmptyProps {
  toggleCreateDialog: () => void;
}

export function RoleEmpty({ toggleCreateDialog }: RoleEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldUser className="h-16 w-16 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No Roles Found</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any roles yet. Get started by creating your first role.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={toggleCreateDialog}>
          <Plus />
          Create Role
        </Button>
      </EmptyContent>
      <Button variant="link" asChild className="text-muted-foreground" size="sm">
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  );
}
