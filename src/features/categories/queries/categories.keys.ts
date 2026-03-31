export const categoriesKeys = {
  all: ['categories'] as const,
  list: () => [...categoriesKeys.all, 'list'] as const,
  categrories: () => [...categoriesKeys.list(), 'categories'] as const,
  details: () => [...categoriesKeys.all, 'detail'] as const,
  detail: (categoryId: string) => [...categoriesKeys.details(), categoryId] as const,
};
