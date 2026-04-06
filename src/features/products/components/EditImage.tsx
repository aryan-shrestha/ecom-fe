'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductImage } from '@/features/products/types/products.types';
import { Image as ImageIcon, Loader2, Plus, Trash2, Upload } from 'lucide-react';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { productsKeys } from '@/features/products/queries/products.keys';

interface EditImageProps {
  productId: string;
  images: ProductImage[];
  onUploadImage: (file: File, altText?: string) => Promise<void>;
  onRemoveImage: (imageId: string) => Promise<void>;
}

export function EditImage({ productId, images, onUploadImage, onRemoveImage }: EditImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeImages = Array.isArray(images) ? images : [];
  const sortedImages = [...safeImages].sort((a, b) => a.position - b.position);

  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size: 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      setError(null);
      await onUploadImage(selectedFile, altText || undefined);
      setSelectedFile(null);
      setPreview(null);
      setAltText('');
    } catch (err: any) {
      setError(err?.message || err?.detail || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (imageId: string) => {
    if (!confirm('Remove this image?')) return;
    try {
      setRemovingId(imageId);
      await onRemoveImage(imageId);
    } catch (err: any) {
      alert(err?.message || 'Failed to remove image');
    } finally {
      setRemovingId(null);
    }
  };

  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setAltText('');
    setError(null);
  };

  useEffect(() => {
    // Force fresh fetch on mount so images uploaded during wizard appear immediately
    queryClient.refetchQueries({
      queryKey: productsKeys.detail(productId),
    });
  }, [productId]);

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Images</CardTitle>
            <CardDescription>Product images in display order</CardDescription>
          </div>
          {!selectedFile && (
            <Button size="sm" onClick={() => inputRef.current?.click()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Upload preview panel */}
        {selectedFile && (
          <div className="space-y-3 rounded-lg border border-dashed border-primary p-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-40 rounded object-contain"
              />
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Alt text (optional)
              </label>
              <input
                type="text"
                placeholder="Describe the image"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpload} disabled={isUploading} className="flex-1">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-3 w-3" /> Upload
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isUploading}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Error outside upload flow */}
        {error && !selectedFile && <p className="text-xs text-destructive">{error}</p>}

        {/* Image grid */}
        {sortedImages.length === 0 ? (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input py-10 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="h-10 w-10" />
            <p className="text-sm">Click to upload your first image</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg border border-input"
              >
                <div className="aspect-square bg-muted">
                  <img
                    src={image.url}
                    alt={image.alt_text || 'Product image'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Hover overlay with remove button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleRemove(image.id)}
                    disabled={removingId === image.id}
                  >
                    {removingId === image.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Position + alt text footer */}
                <div className="bg-card px-2 py-1">
                  <p className="text-xs text-muted-foreground">
                    #{image.position}
                    {image.alt_text && <span className="ml-1 truncate"> · {image.alt_text}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
