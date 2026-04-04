import { useMutation } from '@tanstack/react-query';
import { createVariant } from '@/features/products/api/products.api';
import type { CreateVariantRequest } from '@/features/products/types/products.types';

export function useCreateVariant() {
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateVariantRequest }) =>
      createVariant(productId, data),
  });
}
