import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVariant } from '@/features/products/api/products.api';
import type { CreateVariantRequest } from '@/features/products/types/products.types';
import { productsKeys } from '@/features/products/queries/products.keys';

export function useCreateVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateVariantRequest }) =>
      createVariant(productId, data),
    onSuccess: (_data, { productId }) => {
      // Invalidate the product detail so variant list is fresh
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(productId) });
    },
  });
}
