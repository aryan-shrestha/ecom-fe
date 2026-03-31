import { useCategoriesListQuery } from '../queries/categories.queries';
import CategoryEmpty from './categories-empty';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Pencil, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import CategoryListSkeleton from './category-list-skeleton';

interface CategoryListProps {
  toggleCreateDialog: () => void;
  setSelectedCategory: (categoryId: string) => void;
}

export default function CategoryList({
  toggleCreateDialog,
  setSelectedCategory,
}: CategoryListProps) {
  const { data: categories, isPending: isPending } = useCategoriesListQuery();

  if (isPending) {
    return <CategoryListSkeleton />;
  }

  if (!categories || categories.length === 0) {
    return <CategoryEmpty setOpenCreateDialog={toggleCreateDialog} />;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Categories</h1>
            <Button onClick={toggleCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </div>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium capitalize">{category.name}</TableCell>
                  <TableCell align="right">
                    <div className="space-x-2">
                      <Button
                        variant={'outline'}
                        size="icon"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Pencil />
                      </Button>
                      <Button variant={'destructive'} size="icon">
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
