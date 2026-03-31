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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCategoryMutation } from '../queries/categories.queries';
import { CreateCategoryFormData, createCategorySchema } from '../schemas/categories.schemas';

interface CategoryCreateDialogProps {
  isOpen: boolean;
  toggleDialog: () => void;
}

export default function CategoryCreateDialog({ isOpen, toggleDialog }: CategoryCreateDialogProps) {
  const createCategoryMutation = useCreateCategoryMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      parent_id: undefined,
    },
  });

  const onsubmit = async (data: CreateCategoryFormData) => {
    try {
      setIsSubmitting(true);
      await createCategoryMutation.mutateAsync(data);
      toaster.success('Category created successfully.');
      toggleDialog();
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        toaster.error('Failed to create category', error);
        return;
      }
      toaster.error('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>Fill in the details for your new category.</DialogDescription>
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
            {/* <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent</FormLabel>
                  <FormControl>
                    <Input placeholder="Parent Category" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => toggleDialog()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader className="animate-spin" />}
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
