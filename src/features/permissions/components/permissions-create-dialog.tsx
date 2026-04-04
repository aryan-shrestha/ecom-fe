'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toaster } from '@/lib/toaster';
import { HttpError } from '@/lib/http/errors';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useCreatePermissionMutation } from '../queries/permissions.queries';
import { CreatePermissionFormData, createPermissionSchema } from '../schemas/permissions.schemas';

interface PermissionCreateDialogProps {
  isOpen: boolean;
  toggleDialog: () => void;
}

const PermissionCreateDialog = ({ isOpen, toggleDialog }: PermissionCreateDialogProps) => {
  const createPermissionMutation = useCreatePermissionMutation();

  const form = useForm<CreatePermissionFormData>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: CreatePermissionFormData) => {
    try {
      await createPermissionMutation.mutateAsync(data);
      toggleDialog();
      toaster.success('Permission created successfully');
    } catch (error) {
      if (error instanceof HttpError) {
        toaster.error('Failed to create permission', error);
        return;
      }
      toaster.error('Failed to create permission');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create Permission</DialogTitle>
              <DialogDescription>Create a new permission.</DialogDescription>
            </DialogHeader>
            <div>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Permission code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => toggleDialog()}
                disabled={createPermissionMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createPermissionMutation.isPending}>
                {createPermissionMutation.isPending && <Loader className="animate-spin" />}
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionCreateDialog;
