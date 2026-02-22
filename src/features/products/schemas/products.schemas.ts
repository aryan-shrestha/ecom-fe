import { z } from "zod";

// Product schemas
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and URL-safe"),
  description_short: z
    .string()
    .max(500, "Short description is too long")
    .optional(),
  description_long: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  sort_order: z.number().min(0, "Sort order must be non-negative").optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name is too long")
    .optional(),
  description_short: z
    .string()
    .max(500, "Short description is too long")
    .optional(),
  description_long: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  sort_order: z.number().min(0, "Sort order must be non-negative").optional(),
});

// Variant schemas
export const createVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(100, "SKU is too long"),
  barcode: z.string().max(100, "Barcode is too long").optional(),
  price_amount: z.number().min(1, "Price must be greater than 0"),
  price_currency: z.string().length(3, "Currency must be 3 characters"),
  compare_at_price_amount: z.number().min(0).optional(),
  compare_at_price_currency: z.string().length(3).optional(),
  cost_amount: z.number().min(0).optional(),
  cost_currency: z.string().length(3).optional(),
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  is_default: z.boolean().optional(),
  initial_stock: z.number().min(0).optional(),
  allow_backorder: z.boolean().optional(),
});

export const updateVariantSchema = z.object({
  barcode: z.string().max(100, "Barcode is too long").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  price_amount: z.number().min(1, "Price must be greater than 0").optional(),
  price_currency: z
    .string()
    .length(3, "Currency must be 3 characters")
    .optional(),
  compare_at_price_amount: z.number().min(0).optional(),
  compare_at_price_currency: z.string().length(3).optional(),
  cost_amount: z.number().min(0).optional(),
  cost_currency: z.string().length(3).optional(),
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
});

// Stock adjustment schema
export const adjustStockSchema = z.object({
  delta: z.number().refine((val) => val !== 0, "Delta cannot be zero"),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(100, "Reason is too long"),
  note: z.string().max(500, "Note is too long").optional(),
});

// Image schemas
export const addProductImageSchema = z.object({
  url: z.string().url("Invalid URL").max(1000, "URL is too long"),
  alt_text: z.string().max(255, "Alt text is too long").optional(),
});

// Category schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and URL-safe"),
  parent_id: z.string().uuid().optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type CreateVariantFormData = z.infer<typeof createVariantSchema>;
export type UpdateVariantFormData = z.infer<typeof updateVariantSchema>;
export type AdjustStockFormData = z.infer<typeof adjustStockSchema>;
export type AddProductImageFormData = z.infer<typeof addProductImageSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
