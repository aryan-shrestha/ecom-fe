'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

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
import {
  type Product,
  type ProductImage,
  type UpdateProductFormData,
  updateProductSchema,
} from '@/features/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, ImagePlus, Loader2, Trash2, X, ZoomIn } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProductInfoWithImagesProps {
  product: Product;
  images: ProductImage[];
  onUpdate: (data: UpdateProductFormData) => Promise<void>;
  onUploadImage: (file: File, altText?: string) => Promise<void>;
  onRemoveImage: (imageId: string) => Promise<void>;
  isPending?: boolean;
  isUploadingImage?: boolean;
  isRemovingImage?: boolean;
}

export function ProductInfoWithImages({
  product,
  images,
  onUpdate,
  onUploadImage,
  onRemoveImage,
  isPending,
  isUploadingImage,
  isRemovingImage,
}: ProductInfoWithImagesProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(product.tags || []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxImage, setLightboxImage] = useState<ProductImage | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [uploadingAltText, setUploadingAltText] = useState('');

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

  // Reset form + tags when dialog opens
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
      setTags(product.tags || []);
      setEditError(null);
    }
  }, [isEditOpen, product, form]);

  // Keep tags in sync when product updates externally
  useEffect(() => {
    setTags(product.tags || []);
  }, [product]);

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

  const handleSubmit = async (data: UpdateProductFormData) => {
    try {
      setEditError(null);
      await onUpdate(data);
      setIsEditOpen(false);
    } catch (err: any) {
      setEditError(err?.message || err?.detail || 'Failed to update product');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUploadImage(file, uploadingAltText || undefined);
    setUploadingAltText('');
    e.target.value = '';
  };

  const handleRemove = async (imageId: string) => {
    setRemovingId(imageId);
    try {
      await onRemoveImage(imageId);
    } finally {
      setRemovingId(null);
    }
  };

  // Sort images by position ascending
  const sortedImages = [...images].sort((a, b) => a.position - b.position);

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
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                <p className="mt-1 text-sm">{product.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Slug</h4>
                <p className="mt-1 text-sm">{product.slug}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Cannot be changed after creation
                </p>
              </div>
              {product.description_short && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Short Description</h4>
                  <p className="mt-1 text-sm">{product.description_short}</p>
                </div>
              )}
              {product.description_long && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Long Description</h4>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{product.description_long}</p>
                </div>
              )}
              {product.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
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
                  <span className="text-muted-foreground">Featured:</span>{' '}
                  <span className="font-medium">{product.featured ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sort Order:</span>{' '}
                  <span className="font-medium">{product.sort_order}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>{' '}
                  <span className="font-medium">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* ── DIVIDER (visible only on lg+) ────────────────────────────── */}
            <div className="hidden w-px self-stretch bg-border lg:block" />

            {/* ── RIGHT: image gallery ─────────────────────────────────────── */}
            <div className="w-full lg:w-72 xl:w-80">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Product Images
                  {sortedImages.length > 0 && (
                    <span className="ml-1.5 tabular-nums text-muted-foreground/60">
                      ({sortedImages.length})
                    </span>
                  )}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <ImagePlus className="h-3 w-3" />
                  )}
                  {isUploadingImage ? 'Uploading…' : 'Add Image'}
                </Button>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {sortedImages.length === 0 ? (
                /*
                 * Empty state — clickable dashed area so the user can
                 * immediately start uploading without hunting for the button.
                 */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input py-10 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                >
                  <ImagePlus className="h-7 w-7" />
                  <span>Click to upload images</span>
                  <span className="text-xs">PNG, JPG, WEBP</span>
                </button>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {sortedImages.map((img) => (
                    <div key={img.id} className="group relative aspect-square">
                      <div className="relative h-full w-full overflow-hidden rounded-md border border-input bg-muted">
                        <Image
                          src={img.url}
                          alt={img.alt_text || product.name}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                          sizes="(max-width: 1024px) 30vw, 96px"
                        />

                        {/* Overlay shown on hover */}
                        <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          {/* Zoom */}
                          <button
                            type="button"
                            onClick={() => setLightboxImage(img)}
                            className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
                            title="View full size"
                          >
                            <ZoomIn className="h-3.5 w-3.5" />
                          </button>
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => handleRemove(img.id)}
                            disabled={removingId === img.id || isRemovingImage}
                            className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-500/80 disabled:opacity-50"
                            title="Remove image"
                          >
                            {removingId === img.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Alt text tooltip below thumbnail */}
                      {img.alt_text && (
                        <p className="mt-0.5 truncate text-center text-[10px] text-muted-foreground">
                          {img.alt_text}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* "+ Add more" cell always at the end of the grid */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="aspect-square rounded-md border-2 border-dashed border-input text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                    title="Add another image"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    ) : (
                      <ImagePlus className="mx-auto h-5 w-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Lightbox ──────────────────────────────────────────────────────────── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* We use a regular <img> here because we don't know the dimensions */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.alt_text || product.name}
              className="block max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
            {lightboxImage.alt_text && (
              <p className="mt-2 text-center text-sm text-white/70">{lightboxImage.alt_text}</p>
            )}
          </div>
        </div>
      )}

      {/* ── Edit product dialog (unchanged from ProductEditForm) ──────────────── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details (slug cannot be changed)</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
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
                    <Input value={product.slug} disabled className="bg-muted" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Cannot be changed after creation
                    </p>
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

                  <FormField
                    control={form.control}
                    name="tags"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type tag and press Enter or ,"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                          />
                        </FormControl>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => removeTag(tag)}
                            >
                              {tag}
                              <X className="ml-1.5 h-3 w-3" />
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

              {editError && <p className="pt-2 text-sm text-destructive">{editError}</p>}

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
