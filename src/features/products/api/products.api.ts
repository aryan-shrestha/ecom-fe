import type {
  AddProductImageRequest,
  AdjustStockRequest,
  AssignCategoriesRequest,
  Category,
  CreateCategoryRequest,
  CreateProductRequest,
  CreateVariantRequest,
  Product,
  ProductDetailResponse,
  ProductImage,
  ProductListFilters,
  ProductListResponse,
  ReorderImagesRequest,
  StockMovement,
  UpdateProductRequest,
  UpdateVariantRequest,
  UploadProductImageRequest,
  UploadVariantImageRequest,
  Variant,
  VariantImage,
} from "../types/products.types";
import { httpClient } from "@/features/auth/store/auth.store";

// Product endpoints
export async function createProduct(
  data: CreateProductRequest,
): Promise<Product> {
  return httpClient.post<Product>("/admin/products", data);
}

export async function getProducts(
  filters?: ProductListFilters,
): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (filters?.offset !== undefined)
    params.append("offset", filters.offset.toString());
  if (filters?.limit !== undefined)
    params.append("limit", filters.limit.toString());
  if (filters?.status) params.append("status", filters.status);
  if (filters?.category_id) params.append("category_id", filters.category_id);
  if (filters?.tag) params.append("tag", filters.tag);
  if (filters?.featured !== undefined)
    params.append("featured", filters.featured.toString());
  if (filters?.sort_by) params.append("sort_by", filters.sort_by);
  if (filters?.sort_desc !== undefined)
    params.append("sort_desc", filters.sort_desc.toString());

  const queryString = params.toString();
  const path = `/admin/products${queryString ? `?${queryString}` : ""}`;
  return httpClient.get<ProductListResponse>(path);
}

export async function getProductDetail(
  productId: string,
): Promise<ProductDetailResponse> {
  return httpClient.get<ProductDetailResponse>(`/admin/products/${productId}`);
}

export async function updateProduct(
  productId: string,
  data: UpdateProductRequest,
): Promise<Product> {
  return httpClient.patch<Product>(`/admin/products/${productId}`, data);
}

export async function publishProduct(productId: string): Promise<Product> {
  return httpClient.post<Product>(`/admin/products/${productId}/publish`);
}

export async function archiveProduct(productId: string): Promise<Product> {
  return httpClient.post<Product>(`/admin/products/${productId}/archive`);
}

// Variant endpoints
export async function createVariant(
  productId: string,
  data: CreateVariantRequest,
): Promise<Variant> {
  return httpClient.post<Variant>(
    `/admin/products/${productId}/variants`,
    data,
  );
}

export async function updateVariant(
  variantId: string,
  data: UpdateVariantRequest,
): Promise<Variant> {
  return httpClient.patch<Variant>(
    `/admin/products/variants/${variantId}`,
    data,
  );
}

export async function deactivateVariant(variantId: string): Promise<Variant> {
  return httpClient.post<Variant>(
    `/admin/products/variants/${variantId}/deactivate`,
  );
}

// Inventory endpoints
export async function adjustStock(
  variantId: string,
  data: AdjustStockRequest,
): Promise<StockMovement> {
  return httpClient.post<StockMovement>(
    `/admin/products/variants/${variantId}/stock-adjustments`,
    data,
  );
}

// Image endpoints
export async function addProductImage(
  productId: string,
  data: AddProductImageRequest,
): Promise<ProductImage> {
  return httpClient.post<ProductImage>(
    `/admin/products/${productId}/images`,
    data,
  );
}

export async function uploadProductImage(
  productId: string,
  data: UploadProductImageRequest,
): Promise<ProductImage> {
  const formData = new FormData();
  formData.append("file", data.file);
  if (data.alt_text) formData.append("alt_text", data.alt_text);
  if (data.position !== undefined)
    formData.append("position", data.position.toString());

  return httpClient.post<ProductImage>(
    `/admin/products/${productId}/images/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export async function uploadVariantImage(
  variantId: string,
  data: UploadVariantImageRequest,
): Promise<VariantImage> {
  const formData = new FormData();
  formData.append("file", data.file);
  if (data.alt_text) formData.append("alt_text", data.alt_text);
  if (data.position !== undefined)
    formData.append("position", data.position.toString());

  return httpClient.post<VariantImage>(
    `/admin/products/variants/${variantId}/images/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export async function removeProductImage(
  productId: string,
  imageId: string,
): Promise<void> {
  return httpClient.delete<void>(
    `/admin/products/${productId}/images/${imageId}`,
  );
}

export async function reorderProductImages(
  productId: string,
  data: ReorderImagesRequest,
): Promise<{ message: string }> {
  return httpClient.post<{ message: string }>(
    `/admin/products/${productId}/images/reorder`,
    data,
  );
}

// Category endpoints
export async function createCategory(
  data: CreateCategoryRequest,
): Promise<Category> {
  return httpClient.post<Category>("/admin/categories", data);
}

export async function getCategories(): Promise<Category[]> {
  return httpClient.get<Category[]>("/admin/categories");
}

export async function assignCategories(
  productId: string,
  data: AssignCategoriesRequest,
): Promise<{ message: string }> {
  return httpClient.post<{ message: string }>(
    `/admin/products/${productId}/categories`,
    data,
  );
}
