'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Variant, CreateVariantRequest } from '@/features/products/types/products.types';
import { CheckCircle2, Loader2, PackagePlus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateVariantMutation } from '../queries/products.queries';

const CURRENCY = 'NPR';

// price_currency excluded from schema — injected at submit time
const variantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  price_amount: z.coerce.number().positive('Price must be greater than 0'),
  compare_at_price_amount: z.coerce.number().nonnegative().optional(),
  cost_amount: z.coerce.number().nonnegative().optional(),
  weight: z.coerce.number().nonnegative().optional(),
  initial_stock: z.coerce.number().int().nonnegative().optional(),
  is_default: z.boolean().optional(),
  allow_backorder: z.boolean().optional(),
});

type VariantFields = z.infer<typeof variantSchema>;

// API returns variant.price as Money { amount, currency }
function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-NP', { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

interface VariantStepProps {
  productId: string;
  variants: Variant[];
  onVariantAdded: (variant: Variant) => void;
  onVariantRemoved: (variantId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function VariantStep({
  productId,
  variants,
  onVariantAdded,
  onVariantRemoved,
  onBack,
  onNext,
}: VariantStepProps) {
  const {
    mutate: createVariant,
    isPending,
    error,
    reset: resetMutation,
  } = useCreateVariantMutation();
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<VariantFields>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      sku: '',
      barcode: '',
      price_amount: undefined,
      compare_at_price_amount: undefined,
      cost_amount: undefined,
      weight: undefined,
      initial_stock: undefined,
      is_default: false,
      allow_backorder: false,
    },
  });

  const onAddVariant = (data: VariantFields) => {
    resetMutation();

    // Inject currency here — never touches RHF or DOM
    const payload: CreateVariantRequest = {
      ...data,
      price_currency: CURRENCY,
      compare_at_price_currency: CURRENCY,
      cost_currency: CURRENCY,
    };

    createVariant(
      { productId, data: payload },
      {
        onSuccess: (variant) => {
          onVariantAdded(variant);
          setLastAdded(variant.id);
          resetForm();
          setTimeout(() => setLastAdded(null), 2000);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" />
            Add Variant
          </CardTitle>
          <CardDescription>
            Define SKU, pricing, and stock. Add as many variants as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onAddVariant)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* SKU */}
              <div className="space-y-1">
                <Label htmlFor="sku">
                  SKU <span className="text-destructive">*</span>
                </Label>
                <Input id="sku" placeholder="PROD-001-S" {...register('sku')} />
                {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
              </div>

              {/* Barcode */}
              <div className="space-y-1">
                <Label htmlFor="barcode">Barcode</Label>
                <Input id="barcode" placeholder="012345678901" {...register('barcode')} />
              </div>

              {/* Price with NPR prefix */}
              <div className="space-y-1">
                <Label htmlFor="price_amount">
                  Price <span className="text-destructive">*</span>
                </Label>
                <div className="flex overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                  <span className="flex shrink-0 items-center border-r border-input bg-muted px-3 text-sm text-muted-foreground">
                    NPR
                  </span>
                  <Input
                    id="price_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="400"
                    className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...register('price_amount')}
                  />
                </div>
                {errors.price_amount && (
                  <p className="text-xs text-destructive">{errors.price_amount.message}</p>
                )}
              </div>

              {/* Compare-at price */}
              <div className="space-y-1">
                <Label htmlFor="compare_at_price_amount">Compare-at Price</Label>
                <div className="flex overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                  <span className="flex shrink-0 items-center border-r border-input bg-muted px-3 text-sm text-muted-foreground">
                    NPR
                  </span>
                  <Input
                    id="compare_at_price_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="500"
                    className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...register('compare_at_price_amount')}
                  />
                </div>
              </div>

              {/* Cost */}
              <div className="space-y-1">
                <Label htmlFor="cost_amount">Cost per Item</Label>
                <div className="flex overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                  <span className="flex shrink-0 items-center border-r border-input bg-muted px-3 text-sm text-muted-foreground">
                    NPR
                  </span>
                  <Input
                    id="cost_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="120"
                    className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...register('cost_amount')}
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                  <Input
                    id="weight"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.500"
                    className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...register('weight')}
                  />
                  <span className="flex shrink-0 items-center border-l border-input bg-muted px-3 text-sm text-muted-foreground">
                    kg
                  </span>
                </div>
              </div>

              {/* Initial stock */}
              <div className="space-y-1">
                <Label htmlFor="initial_stock">Initial Stock</Label>
                <Input
                  id="initial_stock"
                  type="number"
                  min="0"
                  placeholder="100"
                  {...register('initial_stock')}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4" {...register('is_default')} />
                Default variant
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4" {...register('allow_backorder')} />
                Allow backorders
              </label>
            </div>

            {error && (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message}
              </p>
            )}

            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding variant…
                </>
              ) : (
                'Add Variant'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Variants table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Added Variants{' '}
            <Badge variant="secondary" className="ml-2">
              {variants.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            {variants.length === 0
              ? 'No variants yet. Add at least one variant above.'
              : 'Review variants below before continuing.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && variants.length === 0 ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : variants.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No variants added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Barcode</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow
                      key={variant.id}
                      className={lastAdded === variant.id ? 'bg-green-50 dark:bg-green-950' : ''}
                    >
                      <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {variant.barcode || '—'}
                      </TableCell>
                      {/* API returns price as Money { amount, currency } */}
                      <TableCell className="text-right">
                        {formatPrice(variant.price.amount, variant.price.currency)}
                      </TableCell>
                      <TableCell>
                        {lastAdded === variant.id ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => onVariantRemoved(variant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={variants.length === 0}
          title={variants.length === 0 ? 'Add at least one variant to continue' : undefined}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
}
