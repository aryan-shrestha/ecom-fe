import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProductImage } from '@/features/products/api/products.api';
import type { UploadProductImageRequest } from '@/features/products/types/products.types';
import { productsKeys } from '@/features/products/queries/products.keys';

export function useUploadProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UploadProductImageRequest }) =>
      uploadProductImage(productId, data),
    onSuccess: (_data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(productId) });
    },
  });
}
