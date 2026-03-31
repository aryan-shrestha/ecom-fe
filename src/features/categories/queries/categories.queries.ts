import * as categoriesApi from '../api/categories.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesKeys } from './categories.keys';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types/categories.types';

export function useCategoriesListQuery() {
  return useQuery({
    queryKey: categoriesKeys.categrories(),
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCategoryDetailQuery(categoryId: string) {
  return useQuery({
    queryKey: categoriesKeys.detail(categoryId),
    queryFn: () =>
      categoriesApi
        .getCategories()
        .then((categories) => categories.find((cat) => cat.id === categoryId)),
    enabled: !!categoryId,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.list() });
    },
  });
}

export function useUpdateCategoryMutation(categoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoriesApi.updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.list() });
    },
  });
}
