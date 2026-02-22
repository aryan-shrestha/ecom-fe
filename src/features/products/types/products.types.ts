// Product Management Types

export interface Money {
  amount: number;
  currency: string;
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum VariantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Product {
  id: string;
  status: ProductStatus;
  name: string;
  slug: string;
  description_short: string | null;
  description_long: string | null;
  tags: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Variant {
  id: string;
  product_id: string;
  sku: string;
  barcode: string | null;
  status: VariantStatus;
  price: Money;
  compare_at_price: Money | null;
  cost: Money | null;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  variant_id: string;
  on_hand: number;
  reserved: number;
  allow_backorder: boolean;
  available: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  position: number;
  created_at: string;
  provider?: string;
  provider_public_id?: string;
  bytes_size?: number;
  width?: number;
  height?: number;
  format?: string;
}

export interface VariantImage {
  id: string;
  variant_id: string;
  url: string;
  alt_text: string | null;
  position: number;
  created_at: string;
  provider?: string;
  provider_public_id?: string;
  bytes_size?: number;
  width?: number;
  height?: number;
  format?: string;
}

export interface StockMovement {
  id: string;
  variant_id: string;
  delta: number;
  reason: string;
  note: string | null;
  created_at: string;
  created_by: string | null;
}

// Request types
export interface CreateProductRequest {
  name: string;
  slug: string;
  description_short?: string;
  description_long?: string;
  tags?: string[];
  featured?: boolean;
  sort_order?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description_short?: string;
  description_long?: string;
  tags?: string[];
  featured?: boolean;
  sort_order?: number;
}

export interface CreateVariantRequest {
  sku: string;
  barcode?: string;
  price_amount: number;
  price_currency: string;
  compare_at_price_amount?: number;
  compare_at_price_currency?: string;
  cost_amount?: number;
  cost_currency?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  is_default?: boolean;
  initial_stock?: number;
  allow_backorder?: boolean;
}

export interface UpdateVariantRequest {
  barcode?: string;
  status?: VariantStatus;
  price_amount?: number;
  price_currency?: string;
  compare_at_price_amount?: number;
  compare_at_price_currency?: string;
  cost_amount?: number;
  cost_currency?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface AdjustStockRequest {
  delta: number;
  reason: string;
  note?: string;
}

export interface AddProductImageRequest {
  url: string;
  alt_text?: string;
}

export interface UploadProductImageRequest {
  file: File;
  alt_text?: string;
  position?: number;
}

export interface UploadVariantImageRequest {
  file: File;
  alt_text?: string;
  position?: number;
}

export interface ReorderImagesRequest {
  image_positions: Record<string, number>;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  parent_id?: string;
}

export interface AssignCategoriesRequest {
  category_ids: string[];
}

// Response types
export interface ProductDetailResponse {
  product: Product;
  variants: Variant[];
  images: ProductImage[];
  categories: Category[];
  inventory: Record<string, Inventory>;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  offset: number;
  limit: number;
}

export interface ProductListFilters {
  offset?: number;
  limit?: number;
  status?: ProductStatus;
  category_id?: string;
  tag?: string;
  featured?: boolean;
  sort_by?: 'created_at' | 'sort_order';
  sort_desc?: boolean;
}
