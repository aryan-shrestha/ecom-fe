import { useMutation, useQueryClient } from '@tanstack/react-query';
import { publishProduct } from '@/features/products/api/products.api';
import { productsKeys } from '@/features/products/queries/products.keys';

export function usePublishProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => publishProduct(productId),
    onSuccess: (_data, productId) => {
      // Invalidate both the list and this product's detail cache
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(productId) });
    },
  });
}
