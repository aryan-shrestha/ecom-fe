import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { HttpError } from '@/lib/http/errors';
import { toaster } from '@/lib/toaster';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCategoryDetailQuery, useUpdateCategoryMutation } from '../queries/categories.queries';
import { UpdateCategoryFormData, updateCategorySchema } from '../schemas/categories.schemas';
import CategoryFormSkeleton from './category-form-skeleton';

interface CategoryUpdateDialogProps {
  isOpen: boolean;
  toggleDialog: () => void;
  categoryId: string;
}

export default function CategoryUpdateDialog({
  isOpen,
  toggleDialog,
  categoryId,
}: CategoryUpdateDialogProps) {
  const getCategoryQuery = useCategoryDetailQuery(categoryId);
  const updateCategoryMutation = useUpdateCategoryMutation(categoryId);

  const form = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: '',
      parent_id: undefined,
    },
  });

  useEffect(() => {
    if (getCategoryQuery.data) {
      form.reset({
        name: getCategoryQuery.data.name ?? '',
        parent_id: undefined,
      });
    }
  }, [getCategoryQuery.data, form]);

  const onSubmit = async (data: UpdateCategoryFormData) => {
    try {
      await updateCategoryMutation.mutateAsync(data);
      toaster.success('Category updated successfully.');
      toggleDialog();
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        toaster.error('Failed to update category', error);
        return;
      }
      toaster.error('Failed to update category');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent>
        {getCategoryQuery.isPending ? (
          <CategoryFormSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Update Category</DialogTitle>
                <DialogDescription>
                  Fill in the details for your updated category.
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" className="mr-2" onClick={toggleDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateCategoryMutation.isPending}>
                  {updateCategoryMutation.isPending && <Loader className="animate-spin" />}
                  Update
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
