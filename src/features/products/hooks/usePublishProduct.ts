import { useMutation } from '@tanstack/react-query';
import { publishProduct } from '@/features/products/api/products.api';

export function usePublishProduct() {
  return useMutation({
    mutationFn: (productId: string) => publishProduct(productId),
  });
}
