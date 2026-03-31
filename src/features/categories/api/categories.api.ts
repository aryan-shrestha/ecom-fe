import { httpClient } from '@/features/auth/store/auth.store';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types/categories.types';

export async function createCategory(data: CreateCategoryRequest): Promise<Category> {
  return httpClient.post<Category>('/admin/categories', data);
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryRequest,
): Promise<Category> {
  return httpClient.put<Category>(`/admin/categories/${categoryId}`, data);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await httpClient.delete(`/admin/categories/${categoryId}`);
}

export async function getCategories(): Promise<Category[]> {
  return httpClient.get<Category[]>('/admin/categories');
}
