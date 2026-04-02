'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { LoadingBlock } from '@/components/common/LoadingBlock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  type AddProductImageFormData,
  type AdjustStockFormData,
  type CreateVariantFormData,
  ProductStatus,
  type UpdateProductFormData,
  useAddProductImageMutation,
  useAdjustStockMutation,
  useArchiveProductMutation,
  useAssignCategoriesMutation,
  useCreateVariantMutation,
  useDeactivateVariantMutation,
  useProductDetailQuery,
  usePublishProductMutation,
  useRemoveProductImageMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useUploadVariantImageMutation,
} from '@/features/products';
import { CategoryManagement } from '@/features/products/components/CategoryManagement';
import { ImageManagement } from '@/features/products/components/ImageManagement';
import { ProductEditForm } from '@/features/products/components/ProductEditForm';
import { InventoryDisplay, StockManagement } from '@/features/products/components/StockManagement';
import { VariantManagement } from '@/features/products/components/VariantManagement';
import { ROUTES } from '@/lib/routes/paths';
import { Archive, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;

  const [selectedVariantForStock, setSelectedVariantForStock] = useState<string | null>(null);

  const { data, isLoading, error } = useProductDetailQuery(productId);
  const updateProductMutation = useUpdateProductMutation();
  const publishProductMutation = usePublishProductMutation();
  const archiveProductMutation = useArchiveProductMutation();
  const createVariantMutation = useCreateVariantMutation();
  const deactivateVariantMutation = useDeactivateVariantMutation();
  const adjustStockMutation = useAdjustStockMutation();
  const addImageMutation = useAddProductImageMutation();
  const uploadImageMutation = useUploadProductImageMutation();
  const uploadVariantImageMutation = useUploadVariantImageMutation();
  const removeImageMutation = useRemoveProductImageMutation();
  const assignCategoriesMutation = useAssignCategoriesMutation();

  if (isLoading) {
    return <LoadingBlock />;
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">
            Error loading product: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { product, variants, images, categories, inventory } = data;

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this product?')) return;

    try {
      await publishProductMutation.mutateAsync(productId);
    } catch (err: any) {
      alert(
        err?.message ||
          err?.detail ||
          'Failed to publish product. Check that all requirements are met.',
      );
    }
  };

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this product?')) return;

    try {
      await archiveProductMutation.mutateAsync(productId);
    } catch (err: any) {
      alert(err?.message || err?.detail || 'Failed to archive product');
    }
  };

  const handleUpdateProduct = async (productData: UpdateProductFormData) => {
    await updateProductMutation.mutateAsync({ productId, data: productData });
  };

  const handleCreateVariant = async (variantData: CreateVariantFormData) => {
    await createVariantMutation.mutateAsync({ productId, data: variantData });
  };

  const handleDeactivateVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to deactivate this variant?')) return;
    await deactivateVariantMutation.mutateAsync({ variantId, productId });
  };

  const handleAdjustStock = async (variantId: string, stockData: AdjustStockFormData) => {
    await adjustStockMutation.mutateAsync({
      variantId,
      productId,
      data: stockData,
    });
  };

  const handleAddImage = async (imageData: AddProductImageFormData) => {
    await addImageMutation.mutateAsync({ productId, data: imageData });
  };

  const handleUploadImage = async (file: File, altText?: string) => {
    await uploadImageMutation.mutateAsync({
      productId,
      data: { file, alt_text: altText },
    });
  };

  const handleUploadVariantImage = async (variantId: string, file: File, altText?: string) => {
    await uploadVariantImageMutation.mutateAsync({
      variantId,
      productId,
      data: { file, alt_text: altText },
    });
  };

  const handleRemoveImage = async (imageId: string) => {
    await removeImageMutation.mutateAsync({ productId, imageId });
  };

  const handleAssignCategories = async (categoryIds: string[]) => {
    await assignCategoriesMutation.mutateAsync({
      productId,
      data: { category_ids: categoryIds },
    });
  };

  const getStatusBadge = (status: ProductStatus) => {
    const variants = {
      [ProductStatus.DRAFT]: { variant: 'secondary' as const, label: 'Draft' },
      [ProductStatus.PUBLISHED]: {
        variant: 'default' as const,
        label: 'Published',
      },
      [ProductStatus.ARCHIVED]: {
        variant: 'outline' as const,
        label: 'Archived',
      },
    };

    const config = variants[status] || variants[ProductStatus.DRAFT];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const canPublish = product.status === ProductStatus.DRAFT;
  const canArchive = product.status === ProductStatus.PUBLISHED;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {getStatusBadge(product.status)}
            {product.featured && <Badge variant="outline">Featured</Badge>}
          </div>
          <p className="mt-2 text-gray-600">Slug: {product.slug}</p>
        </div>
        <div className="flex gap-2">
          {canPublish && (
            <Button onClick={handlePublish} disabled={publishProductMutation.isPending}>
              {publishProductMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Publish
            </Button>
          )}
          {canArchive && (
            <Button
              variant="outline"
              onClick={handleArchive}
              disabled={archiveProductMutation.isPending}
            >
              {archiveProductMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Archive className="mr-2 h-4 w-4" />
              )}
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <ProductEditForm
        product={product}
        onUpdate={handleUpdateProduct}
        isPending={updateProductMutation.isPending}
      />

      {/* Variants */}
      <VariantManagement
        productId={productId}
        variants={variants}
        onCreateVariant={handleCreateVariant}
        onDeactivateVariant={handleDeactivateVariant}
        onAdjustStock={(variantId) => setSelectedVariantForStock(variantId)}
        onUploadVariantImage={handleUploadVariantImage}
      />

      {/* Inventory */}
      <InventoryDisplay
        variants={variants}
        inventory={inventory}
        onAdjustStock={(variantId) => setSelectedVariantForStock(variantId)}
      />

      {/* Stock Management Dialog */}
      <StockManagement
        variants={variants}
        inventory={inventory}
        selectedVariantId={selectedVariantForStock}
        onAdjustStock={handleAdjustStock}
        onClose={() => setSelectedVariantForStock(null)}
      />

      {/* Images */}
      {/* <ImageManagement
        productId={productId}
        images={images}
        onAddImage={handleAddImage}
        onUploadImage={handleUploadImage}
        onRemoveImage={handleRemoveImage}
      /> */}

      {/* Categories */}
      <CategoryManagement
        productId={productId}
        assignedCategories={categories}
        onAssignCategories={handleAssignCategories}
      />
    </div>
  );
}
