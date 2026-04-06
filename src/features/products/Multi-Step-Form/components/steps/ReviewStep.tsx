'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useMultiStepStore } from '../../store/useMultiStepStore';
import { formatPrice } from '../../utils/formatters';
import type { Variant, CreateProductRequest } from '@/features/products/types/products.types';
import { CheckCircle2, Loader2, Rocket, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/routes/paths';

import { useCategoriesListQuery } from '@/features/categories/queries/categories.queries';
import Image from 'next/image';
import { usePublishProductMutation } from '@/features/products/queries/products.queries';

interface ReviewStepProps {
  productId: string;
  productData: CreateProductRequest;
  variants: Variant[];
  onBack: () => void;
}

export function ReviewStep({ productId, productData, variants, onBack }: ReviewStepProps) {
  const router = useRouter();
  const reset = useMultiStepStore((s) => s.reset);
  const images = useMultiStepStore((s) => s.images);

  // Fetch categories to display category name
  const { data: categories = [] } = useCategoriesListQuery();

  // Find selected category name
  const selectedCategory = categories.find((cat) => cat.id === productData.category_id);

  const { mutate: publishProduct, isPending, error, isSuccess } = usePublishProductMutation();

  // Get only successfully uploaded images
  const uploadedImages = Object.values(images).filter((img) => img.status === 'done');

  const handlePublish = () => {
    publishProduct(productId, {
      onSuccess: () => {
        toast.success(`"${productData.name}" published successfully!`);

        reset();
        router.push(ROUTES.PRODUCT_DETAIL(productId));
      },
      onError: (err) => {
        toast.error(err.message ?? 'Failed to publish product');
      },
    });
  };

  if (isSuccess) {
    return (
      <Card className="py-12 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Product Published!</h2>
            <p className="mt-1 text-muted-foreground">
              <span className="font-medium">{productData.name}</span> is now live with{' '}
              {variants.length} variant{variants.length !== 1 ? 's' : ''}.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Summary</CardTitle>
          <CardDescription>Review before publishing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </p>
              <p className="mt-1 font-semibold">{productData.name}</p>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Category
              </p>
              <p className="mt-1 font-semibold">
                {selectedCategory ? selectedCategory.name : 'Uncategorized'}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <Badge variant="secondary" className="mt-1">
                Draft
              </Badge>
            </div>
            {productData.description_short && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Short Description
                </p>
                <p className="mt-1 text-sm">{productData.description_short}</p>
              </div>
            )}
            {productData.tags && productData.tags.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tags
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {productData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Featured
              </p>
              <p className="mt-1 text-sm">{productData.featured ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sort Order
              </p>
              <p className="mt-1 text-sm">{productData.sort_order}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* display product imag */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Product Images
            {uploadedImages.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {uploadedImages.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {uploadedImages.length === 0 ? 'No images uploaded' : 'Successfully uploaded images'}
          </CardDescription>
        </CardHeader>
        {uploadedImages.length > 0 && (
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedImages.map((img) => (
                <div key={img.localId} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg border border-input bg-muted">
                    <Image
                      src={img.preview}
                      alt={img.altText || 'Product image'}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  {img.altText && (
                    <p className="mt-3 truncate text-sm font-medium text-foreground">
                      {img.altText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Variants{' '}
            <Badge variant="secondary" className="ml-1">
              {variants.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {variants.map((variant, i) => (
              <div key={variant.id}>
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="font-mono font-medium">{variant.sku}</span>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    {variant.barcode && <span className="text-xs">{variant.barcode}</span>}
                    <span className="font-semibold text-foreground">
                      {/* FIX: uses shared formatPrice, not a local copy */}
                      {formatPrice(variant.price.amount, variant.price.currency)}
                    </span>
                  </div>
                </div>
                {i < variants.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </p>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
          Back
        </Button>
        <Button type="button" onClick={handlePublish} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing…
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" /> Publish Product
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
