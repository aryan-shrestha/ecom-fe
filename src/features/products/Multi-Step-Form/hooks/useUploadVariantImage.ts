import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadVariantImage } from '@/features/products/api/products.api';
import type { UploadVariantImageRequest } from '@/features/products/types/products.types';
import { productsKeys } from '@/features/products/queries/products.keys';

export function useUploadVariantImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      productId,
      data,
    }: {
      variantId: string;
      productId: string;
      data: UploadVariantImageRequest;
    }) => uploadVariantImage(variantId, data),
    onSuccess: (_data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(productId) });
    },
  });
}
