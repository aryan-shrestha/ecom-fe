import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Category name is too long'),
  parent_id: z.string().optional().nullable(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(255, 'Category name is too long')
    .optional(),
  parent_id: z.string().optional().nullable(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
