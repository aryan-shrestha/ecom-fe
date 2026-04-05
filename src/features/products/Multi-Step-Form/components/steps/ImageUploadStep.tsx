'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUploadProductImage } from '@/features/products/Multi-Step-Form/hooks/useUploadProductImage';
import { useMultiStepStore } from '@/features/products/Multi-Step-Form/store/useMultiStepStore';
import { ArrowRight, ImagePlus, Loader2, X } from 'lucide-react';
import { useRef } from 'react';
import Image from 'next/image';

interface ImageUploadStepProps {
  productId: string;
  onBack: () => void;
  onNext: () => void;
}

export function ImageUploadStep({ productId, onBack, onNext }: ImageUploadStepProps) {
  const { images, addImage, setImageAltText, setImageStatus, removeImage } = useMultiStepStore();
  const { mutateAsync: uploadImage } = useUploadProductImage();
  const inputRef = useRef<HTMLInputElement>(null);

  const imageList = Object.values(images);
  const pendingCount = imageList.filter((i) => i.status === 'pending').length;
  const allDoneOrEmpty = imageList.length === 0 || imageList.every((i) => i.status === 'done');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const localId = `${file.name}-${Date.now()}-${Math.random()}`;
      const preview = URL.createObjectURL(file);
      addImage(localId, file, preview, '');
    });
    e.target.value = '';
  };

  const handleUploadAll = async () => {
    const pending = imageList.filter((i) => i.status === 'pending');
    for (const img of pending) {
      setImageStatus(img.localId, 'uploading');
      try {
        const uploaded = await uploadImage({
          productId,
          data: { file: img.file, alt_text: img.altText || undefined },
        });
        setImageStatus(img.localId, 'done', uploaded);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setImageStatus(img.localId, 'error', undefined, message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Product Images
          </CardTitle>
          <CardDescription>
            Upload images for this product. You can skip and add images later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input py-10 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ImagePlus className="h-8 w-8" />
            <span>Click to select images</span>
            <span className="text-xs">PNG, JPG, WEBP up to 10MB</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Preview grid */}
          {imageList.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {imageList.map((img) => (
                <div key={img.localId} className="group relative">
                  <div className="relative aspect-square overflow-hidden rounded-md border border-input bg-muted">
                    <Image
                      src={img.preview}
                      alt={img.altText || 'preview'}
                      fill
                      className="object-cover"
                    />
                    {img.status === 'uploading' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    {img.status === 'done' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                        <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                          Uploaded
                        </span>
                      </div>
                    )}
                    {img.status === 'error' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
                        <span className="rounded-full bg-destructive px-2 py-0.5 text-xs text-white">
                          Failed
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Alt text */}
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={img.altText}
                    disabled={img.status !== 'pending'}
                    onChange={(e) => setImageAltText(img.localId, e.target.value)}
                    className="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                  />

                  {/* Remove — only for pending */}
                  {img.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => removeImage(img.localId)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {pendingCount > 0 && (
            <Button type="button" variant="secondary" onClick={handleUploadAll} className="w-full">
              Upload {pendingCount} image{pendingCount !== 1 ? 's' : ''}
            </Button>
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
          disabled={pendingCount > 0}
          title={pendingCount > 0 ? 'Upload pending images first' : undefined}
        >
          Continue to Variants <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
