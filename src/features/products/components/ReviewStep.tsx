'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// import directly from types  not from the hook
import type { Variant } from '@/features/products/types/products.types';
import { usePublishProductMutation, type CreateProductFormData } from '@/features/products';
import { CheckCircle2, Loader2, Rocket } from 'lucide-react';

interface ReviewStepProps {
  productId: string;
  productData: CreateProductFormData;
  variants: Variant[];
  onBack: () => void;
  onPublished: (productId: string) => void;
}

// Variant.price is Money { amount, currency }
function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-NP', { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function ReviewStep({
  productId,
  productData,
  variants,
  onBack,
  onPublished,
}: ReviewStepProps) {
  const { mutate: publishProduct, isPending, error, isSuccess } = usePublishProductMutation();

  const handlePublish = () => {
    publishProduct(productId, {
      onSuccess: () => {
        onPublished(productId);
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
      {/* Product summary */}
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

            {productData.description_long && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Long Description
                </p>
                <p className="mt-1 line-clamp-4 text-sm text-muted-foreground">
                  {productData.description_long}
                </p>
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

      {/* Variants summary */}
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
                  {/* SKU as primary identifier */}
                  <span className="font-mono font-medium">{variant.sku}</span>

                  <div className="flex items-center gap-4 text-muted-foreground">
                    {variant.barcode && <span className="text-xs">{variant.barcode}</span>}
                    {/* price is Money { amount, currency } */}
                    <span className="font-semibold text-foreground">
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

      {/* Publish error */}
      {error && (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
          Back
        </Button>
        <Button type="button" onClick={handlePublish} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing…
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Publish Product
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
