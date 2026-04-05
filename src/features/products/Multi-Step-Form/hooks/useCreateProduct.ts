import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '@/features/products/api/products.api';
import type { CreateProductRequest } from '@/features/products/types/products.types';
import { productsKeys } from '@/features/products/queries/products.keys';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    //runs after api succeeds
    onSuccess: () => {
      // Invalidate product list so the new draft appears immediately
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}
