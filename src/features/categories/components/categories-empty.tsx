'use client';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Grid2x2Plus, Plus } from 'lucide-react';

interface CategoryEmptyProps {
  setOpenCreateDialog: () => void;
}

export default function CategoryEmpty({ setOpenCreateDialog }: CategoryEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Grid2x2Plus />
        </EmptyMedia>
        <EmptyTitle>No Categories Found</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any categories yet. Get started by creating your first category.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={setOpenCreateDialog}>
          <Plus />
          Create Category
        </Button>
      </EmptyContent>
      <Button variant="link" className="text-muted-foreground" size="sm" />
    </Empty>
  );
}
