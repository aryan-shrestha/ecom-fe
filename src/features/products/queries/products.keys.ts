import type { ProductListFilters } from "../types/products.types";

export const productsKeys = {
  all: ["products"] as const,
  lists: () => [...productsKeys.all, "list"] as const,
  list: (filters?: ProductListFilters) =>
    [...productsKeys.lists(), filters] as const,
  details: () => [...productsKeys.all, "detail"] as const,
  detail: (productId: string) =>
    [...productsKeys.details(), productId] as const,
  categories: ["categories"] as const,
} as const;
