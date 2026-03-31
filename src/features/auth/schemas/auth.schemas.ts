import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .regex(/^[A-Za-z]+$/, 'First name must contain only letters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .regex(/^[A-Za-z]+$/, 'Last name must contain only letters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must include a special character'),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must include a special character'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
