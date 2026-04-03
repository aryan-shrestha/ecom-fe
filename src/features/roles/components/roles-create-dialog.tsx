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
import { useCreateRoleMutation } from '../queries/roles.queries';
import { useForm } from 'react-hook-form';
import { CreateRoleFormData, createRoleSchema } from '../schemas/roles.schemas';
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

interface RoleCreateDialogProps {
  isOpen: boolean;
  toggleDialog: () => void;
}

const RoleCreateDialog = ({ isOpen, toggleDialog }: RoleCreateDialogProps) => {
  const createRoleMutation = useCreateRoleMutation();

  const form = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: CreateRoleFormData) => {
    try {
      await createRoleMutation.mutateAsync(data);
      toggleDialog();
      toaster.success('Role created successfully');
    } catch (error) {
      if (error instanceof HttpError) {
        toaster.error('Failed to create role', error);
        return;
      }
      toaster.error('Failed to create role');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
              <DialogDescription>Create a new role.</DialogDescription>
            </DialogHeader>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Role name" {...field} />
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
                disabled={createRoleMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createRoleMutation.isPending}>
                {createRoleMutation.isPending && <Loader className="animate-spin" />}
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleCreateDialog;
