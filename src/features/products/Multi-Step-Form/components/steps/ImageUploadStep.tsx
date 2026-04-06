'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useUploadProductImageMutation as useUploadProductImage,
  useRemoveProductImageMutation as useRemoveProductImage,
} from '@/features/products/queries/products.queries';
import { useMultiStepStore } from '@/features/products/Multi-Step-Form/store/useMultiStepStore';
import { ArrowRight, ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ImageUploadStepProps {
  productId: string;
  onBack: () => void;
  onNext: () => void;
}

export function ImageUploadStep({ productId, onBack, onNext }: ImageUploadStepProps) {
  const { images, addImage, setImageAltText, setImageStatus, removeImage } = useMultiStepStore();
  const { mutateAsync: uploadImage } = useUploadProductImage();
  const { mutate: deleteImage, isPending: isDeleting } = useRemoveProductImage();

  const inputRef = useRef<HTMLInputElement>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

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

  const handleDeleteImage = (localId: string) => {
    // Check if image is already uploaded (has an uploaded.id)
    const img = images[localId];
    if (img?.uploaded?.id) {
      // If uploaded to server, show confirmation
      setImageToDelete(localId);
    } else {
      // If not uploaded yet, just remove from local store
      removeImage(localId);
    }
  };

  const confirmDelete = () => {
    if (!imageToDelete) return;

    const img = images[imageToDelete];
    if (!img?.uploaded?.id) {
      removeImage(imageToDelete);
      setImageToDelete(null);
      return;
    }

    // Delete from API
    setDeletingImageId(imageToDelete);
    deleteImage(
      { productId, imageId: img.uploaded.id },
      {
        onSuccess: () => {
          removeImage(imageToDelete);
          setImageToDelete(null);
          setDeletingImageId(null);
        },
        onError: (error: any) => {
          console.error('Failed to delete image:', error);
          setDeletingImageId(null);
          // You could show a toast error here
        },
      },
    );
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
            <div className="lg:grid-cols-3\4 grid grid-cols-1 gap-4 sm:grid-cols-6">
              {imageList.map((img) => (
                <div key={img.localId} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg border border-input bg-muted">
                    <Image
                      src={img.preview}
                      alt={img.altText || 'preview'}
                      fill
                      className="object-cover"
                    />

                    {/* Loading overlay */}
                    {img.status === 'uploading' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}

                    {/* Error overlay */}
                    {img.status === 'error' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
                        <span className="text-xs font-semibold text-destructive">Error</span>
                      </div>
                    )}

                    {/* Hover overlay with actions */}
                    {img.status !== 'uploading' && (
                      <div className="absolute inset-0 hidden flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:flex group-hover:opacity-100">
                        {img.status === 'done' && (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteImage(img.localId)}
                            disabled={isDeleting && deletingImageId === img.localId}
                          >
                            {isDeleting && deletingImageId === img.localId ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Deleting…
                              </>
                            ) : (
                              <>
                                <Trash2 className="mr-1 h-3 w-3" />
                                Delete
                              </>
                            )}
                          </Button>
                        )}
                        {img.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => removeImage(img.localId)}
                            className="rounded-full bg-destructive p-1.5 text-destructive-foreground hover:bg-destructive/90"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Alt text input (for pending images) */}
                  {img.status === 'pending' && (
                    <input
                      type="text"
                      placeholder="Alt text"
                      value={img.altText}
                      onChange={(e) => setImageAltText(img.localId, e.target.value)}
                      className="mt-2 w-full rounded border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  )}

                  {/* Status badge */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {img.status === 'pending' && 'Pending upload'}
                      {img.status === 'uploading' && 'Uploading...'}
                      {img.status === 'done' && '✓ Uploaded'}
                      {img.status === 'error' && '✗ Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <Button onClick={handleUploadAll}>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upload {pendingCount} Image{pendingCount !== 1 ? 's' : ''}
                </Button>
              )}
              <Button onClick={onNext} disabled={!allDoneOrEmpty}>
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
