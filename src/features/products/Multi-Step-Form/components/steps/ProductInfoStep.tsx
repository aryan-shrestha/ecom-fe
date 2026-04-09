import { Button } from '@/components/ui/button';
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

import { ArrowRight, Loader, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, z } from 'zod';
import { useCategoriesListQuery } from '@/features/categories/queries/categories.queries';
import {
  CreateProductFormData,
  createProductSchema,
} from '@/features/products/schemas/products.schemas';
import { useState } from 'react';
import { useCreateProductMutation } from '@/features/products/queries/products.queries';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toaster } from '@/lib/toaster';
import { HttpError } from '@/lib/http/errors';
import { useMultiStepStore } from '../../store/useMultiStepStore';

const infoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description_short: z.string().max(500).optional(),
  description_long: z.string().optional(),
  category_id: z.string().optional(),
});

type InfoFields = z.infer<typeof infoSchema>;

export function ProductInfoStep() {
  const { data: categories = [], isPending: categoriesLoading } = useCategoriesListQuery();

  const createProductMutation = useCreateProductMutation();
  const { productData: defaultValues, setStep, setProductId, setProductData } = useMultiStepStore();
  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description_short: defaultValues?.description_short ?? '',
      description_long: defaultValues?.description_long ?? '',
      tags: defaultValues?.tags ?? [],
      featured: defaultValues?.featured ?? false,
      sort_order: defaultValues?.sort_order ?? 0,
    },
  });

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

  const handleSubmit = async (data: CreateProductFormData) => {
    try {
      const response = await createProductMutation.mutateAsync(data);
      setProductData(data);
      setProductId(response.id ?? null);
      setStep(2);
    } catch (error) {
      if (error instanceof HttpError) {
        toaster.error('Failed to create product', error);
      }
      console.error('Failed to create product: ', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <ScrollArea className="h-100">
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-lg text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product name"
                      {...field}
                      disabled={createProductMutation.isPending}
                    />
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
                  <FormLabel>
                    Short Description <span className="text-lg text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description (max 500 characters)"
                      rows={3}
                      {...field}
                      disabled={createProductMutation.isPending}
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
                    <Textarea
                      placeholder="Full product description"
                      rows={6}
                      {...field}
                      disabled={createProductMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          onClick={() => removeTag(tag)}
                          className="cursor-pointer"
                        >
                          {tag}
                          <X className="ml-2 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  )}

                  <FormControl>
                    <Input
                      placeholder="Press Enter or comma to add"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      disabled={createProductMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>Tags for categorization and filtering</FormDescription>

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
                      disabled={createProductMutation.isPending}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Featured Product</FormLabel>
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
                      disabled={createProductMutation.isPending}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Lower numbers appear first</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Dropdown */}
            {/* <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                disabled={categoriesLoading}
                onValueChange={field.onChange}
                defaultValue={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No categories available
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-8">
          <Button type="submit" disabled={createProductMutation.isPending}>
            {createProductMutation.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Next Step <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
