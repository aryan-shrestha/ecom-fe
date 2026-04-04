import { useMutation } from '@tanstack/react-query';
import { createProduct } from '@/features/products/api/products.api';
import type { CreateProductFormData } from '@/features/products';

export function useCreateProduct() {
  return useMutation({
    mutationFn: (data: CreateProductFormData) => createProduct(data),
  });
}
