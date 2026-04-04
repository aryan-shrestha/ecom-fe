import { z } from 'zod';

export const createPermissionSchema = z.object({
  code: z.string().min(1, 'Permission code is required').max(50, 'Permission code is too long'),
});

export type CreatePermissionFormData = z.infer<typeof createPermissionSchema>;
