import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name is too long'),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name is too long').optional(),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
