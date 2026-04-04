'use client';

import { useState, useCallback } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, X, ArrowRight } from 'lucide-react';

import { StepIndicator } from './StepIndicator';
import { VariantStep } from './VariantStep';
import { ReviewStep } from './ReviewStep';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { type CreateProductFormData, createProductSchema } from '@/features/products';
import type { Variant } from '@/features/products';

type SubStep = 'info' | 'settings';

export function MultiStepProductForm() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [subStep, setSubStep] = useState<SubStep>('info');
  const [productId, setProductId] = useState<string | null>(null);
  const [productData, setProductData] = useState<CreateProductFormData | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description_short: '',
      description_long: '',
      tags: [],
      featured: false,
      sort_order: 0,
    },
    mode: 'onTouched',
  });

  const { mutate: createProduct, isPending, error: createError } = useCreateProduct();

  const handleInfoNext = useCallback(async () => {
    const valid = await form.trigger(['name', 'description_short', 'description_long']);
    if (valid) setSubStep('settings');
  }, [form]);

  const handleSettingsNext = useCallback(
    (data: CreateProductFormData) => {
      // Duplicate creation guard
      if (productId) {
        setProductData(data);
        setCurrentStep(2);
        return;
      }
      createProduct(data, {
        onSuccess: (product) => {
          setProductId(product.id);
          setProductData(data);
          setCurrentStep(2);
        },
      });
    },
    [productId, createProduct],
  );

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        const next = [...tags, newTag];
        setTags(next);
        form.setValue('tags', next);
      }
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    form.setValue('tags', next);
  };

  const handleVariantAdded = useCallback((v: Variant) => setVariants((p) => [...p, v]), []);
  const handleVariantRemoved = useCallback(
    (id: string) => setVariants((p) => p.filter((v) => v.id !== id)),
    [],
  );
  const handlePublished = useCallback((_id: string) => {
    // router.push('/admin/products')
  }, []);

  return (
    <div className="py-8">
      <StepIndicator currentStep={currentStep} />
      {currentStep === 1 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSettingsNext)} className="space-y-6">
            {/* ── Sub-step 1a: Product Information ── */}
            {subStep === 'info' && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>Basic information about the product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_short"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description (max 500 characters)"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_long"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Long Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Full product description" rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Next Step button — validates info fields only */}
                  <div className="flex justify-end pt-2">
                    <Button type="button" onClick={handleInfoNext}>
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Sub-step 1b: Product Settings ── */}
            {subStep === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Settings</CardTitle>
                  <CardDescription>Additional product configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="electronics, wireless, headphones"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                          />
                        </FormControl>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              onClick={() => removeTag(tag)}
                              className="cursor-pointer"
                            >
                              {tag}
                              <X className="ml-2 h-4 w-4" />
                            </Badge>
                          ))}
                        </div>
                        <FormDescription>Press Enter or comma to add a tag</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Featured Product</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Display order (lower numbers appear first)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {createError && (
                    <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {createError.message}
                    </p>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubStep('info')}
                      disabled={isPending}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      )}

      {/* ── Step 2: Variants ── */}
      {currentStep === 2 && productId && (
        <VariantStep
          productId={productId}
          variants={variants}
          onVariantAdded={handleVariantAdded}
          onVariantRemoved={handleVariantRemoved}
          onBack={() => {
            setCurrentStep(1);
            setSubStep('settings');
          }}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {/* ── Step 3: Review & Publish ── */}
      {currentStep === 3 && productId && productData && (
        <ReviewStep
          productId={productId}
          productData={productData}
          variants={variants}
          onBack={() => setCurrentStep(2)}
          onPublished={handlePublished}
        />
      )}
    </div>
  );
}
