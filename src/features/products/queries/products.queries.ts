import * as productsApi from '../api/products.api';
import type {
  AddProductImageRequest,
  AdjustStockRequest,
  AssignCategoriesRequest,
  CreateCategoryRequest,
  CreateProductRequest,
  CreateVariantRequest,
  ProductListFilters,
  ReorderImagesRequest,
  UpdateProductRequest,
  UpdateVariantRequest,
  UploadProductImageRequest,
  UploadVariantImageRequest,
} from '../types/products.types';
import { productsKeys } from './products.keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query hooks
export function useProductsListQuery(filters?: ProductListFilters) {
  return useQuery({
    queryKey: productsKeys.list(filters),
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProductDetailQuery(productId: string) {
  return useQuery({
    queryKey: productsKeys.detail(productId),
    queryFn: () => productsApi.getProductDetail(productId),
    enabled: !!productId,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 0,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: productsKeys.categories,
    queryFn: productsApi.getCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Product mutations
export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateProductRequest }) =>
      productsApi.updateProduct(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}

export function usePublishProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productsApi.publishProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(productId),
      });
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}

export function useArchiveProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productsApi.archiveProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(productId),
      });
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}

// Variant mutations
export function useCreateVariantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateVariantRequest }) =>
      productsApi.createVariant(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

export function useUpdateVariantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      productId,
      data,
    }: {
      variantId: string;
      productId: string;
      data: UpdateVariantRequest;
    }) => productsApi.updateVariant(variantId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

export function useDeactivateVariantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, productId }: { variantId: string; productId: string }) =>
      productsApi.deactivateVariant(variantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

// Inventory mutations
export function useAdjustStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      productId,
      data,
    }: {
      variantId: string;
      productId: string;
      data: AdjustStockRequest;
    }) => productsApi.adjustStock(variantId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

// Image mutations
export function useAddProductImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: AddProductImageRequest }) =>
      productsApi.addProductImage(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

export function useUploadProductImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UploadProductImageRequest }) =>
      productsApi.uploadProductImage(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

export function useUploadVariantImageMutation() {
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
    }) => productsApi.uploadVariantImage(variantId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

export function useRemoveProductImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      productsApi.removeProductImage(productId, imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

export function useReorderProductImagesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ReorderImagesRequest }) =>
      productsApi.reorderProductImages(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}

// Category mutations
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => productsApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.categories });
    },
  });
}

export function useAssignCategoriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: AssignCategoriesRequest }) =>
      productsApi.assignCategories(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.productId),
      });
    },
  });
}
