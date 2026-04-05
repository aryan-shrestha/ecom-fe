'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { useCreateVariant } from '../../hooks/useCreateVariant';
import { useUploadVariantImage } from '../../hooks/useUploadVariantImage';
import { useMultiStepStore } from '../../store/useMultiStepStore';
import { formatPrice } from '../../utils/formatters';
import type { Variant, CreateVariantRequest } from '@/features/products/types/products.types';
import { CheckCircle2, ImagePlus, Loader2, PackagePlus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

interface VariantStepProps {
  productId: string;
  variants: Variant[];

  currency?: string;
  onVariantAdded: (variant: Variant) => void;
  onVariantRemoved: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function VariantStep({
  productId,
  variants,
  currency = 'NPR',
  onVariantAdded,
  onVariantRemoved,
  onBack,
  onNext,
}: VariantStepProps) {
  const { mutate: createVariant, isPending, error, reset: resetMutation } = useCreateVariant();
  const { mutateAsync: uploadVariantImg } = useUploadVariantImage();

  const { variantImages, setVariantImage, setVariantImageStatus, removeVariantImage } =
    useMultiStepStore();

  // FIX: Track the last-added ID in a ref for the timer so we can cancel it
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const lastAddedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FIX: Cancel the timer when the component unmounts to prevent setState
  // being called on an unmounted component.
  useEffect(() => {
    return () => {
      if (lastAddedTimerRef.current) clearTimeout(lastAddedTimerRef.current);
    };
  }, []);

  const form = useForm<VariantFields>({
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
    const payload: CreateVariantRequest = {
      ...data,
      price_currency: currency,
      compare_at_price_currency: currency,
      cost_currency: currency,
    };
    createVariant(
      { productId, data: payload },
      {
        onSuccess: (variant) => {
          onVariantAdded(variant);
          setLastAdded(variant.id);
          form.reset();
          // Store the timer ref so we can cancel it on unmount
          lastAddedTimerRef.current = setTimeout(() => setLastAdded(null), 2000);
        },
      },
    );
  };

  const handleUploadVariantImage = async (variantId: string) => {
    const img = variantImages[variantId];
    if (!img || img.status !== 'pending') return;
    setVariantImageStatus(variantId, 'uploading');
    try {
      await uploadVariantImg({ variantId, productId, data: { file: img.file } });
      setVariantImageStatus(variantId, 'done');
    } catch {
      setVariantImageStatus(variantId, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Variant form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" /> Add Variant
          </CardTitle>
          <CardDescription>
            Define SKU, pricing, and stock. Add as many variants as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddVariant)} className="space-y-4">
              <fieldset disabled={isPending} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          SKU <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="PROD-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input placeholder="012345678901" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Price <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                            <span className="flex shrink-0 items-center border-r border-input bg-muted px-3 text-sm text-muted-foreground">
                              {currency}
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="400"
                              className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="compare_at_price_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compare-at Price</FormLabel>
                        <FormControl>
                          <div className="flex overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                            <span className="flex shrink-0 items-center border-r border-input bg-muted px-3 text-sm text-muted-foreground">
                              {currency}
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="500"
                              className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cost_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost per Item</FormLabel>
                        <FormControl>
                          <div className="flex overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                            <span className="flex shrink-0 items-center border-r border-input bg-muted px-3 text-sm text-muted-foreground">
                              {currency}
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="120"
                              className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <div className="flex overflow-hidden rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                            <Input
                              type="number"
                              step="0.001"
                              min="0"
                              placeholder="0.500"
                              className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                            <span className="flex shrink-0 items-center border-l border-input bg-muted px-3 text-sm text-muted-foreground">
                              gram
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="initial_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-wrap gap-6 pt-1">
                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer">Default variant</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allow_backorder"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer">Allow backorders</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>

              {error && (
                <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error.message}
                </p>
              )}

              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding…
                  </>
                ) : (
                  'Add Variant'
                )}
              </Button>
            </form>
          </Form>
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
              ? 'No variants yet. Add at least one above.'
              : 'You can attach an image to each variant.'}
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
                    {/* <TableHead>Image</TableHead> */}
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => {
                    // const vImg = variantImages[variant.id];
                    return (
                      <TableRow
                        key={variant.id}
                        className={lastAdded === variant.id ? 'bg-green-50 dark:bg-green-950' : ''}
                      >
                        <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {variant.barcode || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(variant.price.amount, variant.price.currency)}
                        </TableCell>
                        <TableCell>
                          {/* <VariantImageCell
                            variantId={variant.id}
                            productId={productId}
                            vImg={vImg}
                            onImageSelected={(file, preview) =>
                              setVariantImage(variant.id, file, preview)
                            }
                            onUpload={() => handleUploadVariantImage(variant.id)}
                            onRemove={() => removeVariantImage(variant.id)}
                          /> */}
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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

interface VariantImageCellProps {
  variantId: string;
  productId: string;
  vImg:
    | { file: File; preview: string; status: 'pending' | 'uploading' | 'done' | 'error' }
    | undefined;
  onImageSelected: (file: File, preview: string) => void;
  onUpload: () => void;
  onRemove: () => void;
}

function VariantImageCell({ vImg, onImageSelected, onUpload, onRemove }: VariantImageCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImageSelected(file, URL.createObjectURL(file));
    e.target.value = '';
  };

  return (
    <>
      {/* Each row's own hidden file input — no shared state needed */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!vImg ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-3 w-3" /> Add
        </Button>
      ) : vImg.status === 'pending' ? (
        <div className="flex items-center gap-1">
          <img src={vImg.preview} alt="" className="h-7 w-7 rounded object-cover" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={onUpload}
          >
            Upload
          </Button>
          <button type="button" onClick={onRemove}>
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      ) : vImg.status === 'uploading' ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : vImg.status === 'done' ? (
        <div className="flex items-center gap-1">
          <img src={vImg.preview} alt="" className="h-7 w-7 rounded object-cover" />
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </div>
      ) : (
        <span className="text-xs text-destructive">Failed</span>
      )}
    </>
  );
}
