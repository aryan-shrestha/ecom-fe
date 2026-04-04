'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { type Product, type UpdateProductFormData, updateProductSchema } from '@/features/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Label } from '@components/ui/label';

interface ProductEditFormProps {
  product: Product;
  onUpdate: (data: UpdateProductFormData) => Promise<void>;
  isPending?: boolean;
}

export function ProductEditForm({ product, onUpdate, isPending }: ProductEditFormProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(product.tags || []);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();

      const newTag = tagInput.trim();

      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);

        // IMPORTANT: sync with form
        form.setValue('tags', updatedTags);
      }

      setTagInput('');
    }
  };

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description_short: product.description_short || '',
      description_long: product.description_long || '',
      tags: product.tags,
      featured: product.featured,
      sort_order: product.sort_order,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isEditOpen) {
      form.reset({
        name: product.name,
        description_short: product.description_short || '',
        description_long: product.description_long || '',
        tags: product.tags,
        featured: product.featured,
        sort_order: product.sort_order,
      });
      setError(null);
    }
  }, [isEditOpen, product, form]);

  useEffect(() => {
    setTags(product.tags || []);
  }, [product]);

  const handleSubmit = async (data: UpdateProductFormData) => {
    try {
      setError(null);
      await onUpdate(data);
      setIsEditOpen(false);
    } catch (err: any) {
      setError(err?.message || err?.detail || 'Failed to update product');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Basic product details</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Name</h4>
              <p className="mt-1 text-sm">{product.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Slug</h4>
              <p className="mt-1 text-sm">{product.slug}</p>
              <p className="mt-1 text-xs text-gray-500">Cannot be changed after creation</p>
            </div>
            {product.description_short && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Short Description</h4>
                <p className="mt-1 text-sm">{product.description_short}</p>
              </div>
            )}
            {product.description_long && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Long Description</h4>
                <p className="mt-1 whitespace-pre-wrap text-sm">{product.description_long}</p>
              </div>
            )}
            {product.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Tags</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {product.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Featured:</span>{' '}
                <span className="font-medium">{product.featured ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-gray-600">Sort Order:</span>{' '}
                <span className="font-medium">{product.sort_order}</span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>{' '}
                <span className="font-medium">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details (slug cannot be changed)</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <ScrollArea className="h-96">
                <div className="space-y-4">
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

                  <div>
                    <FormLabel>Slug</FormLabel>
                    <Input value={product.slug} disabled className="bg-gray-100" />
                    <p className="mt-1 text-xs text-gray-500">Cannot be changed after creation</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="description_short"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description (max 500 characters)"
                            {...field}
                            rows={3}
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
                          <Textarea placeholder="Full product description" {...field} rows={6} />
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

                        {/* Input */}
                        <FormControl>
                          <Input
                            placeholder="Type tag and press Enter or ,"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                          />
                        </FormControl>

                        {/* Badge display */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <FormDescription>Press Enter or comma to add tags</FormDescription>

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
                </div>
              </ScrollArea>
              {error && <p className="text-sm text-red-600">{error}</p>}

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
