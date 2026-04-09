'use client';

import { Button } from '@/components/ui/button';
import {
  useUploadProductImageMutation as useUploadProductImage,
  useRemoveProductImageMutation as useRemoveProductImage,
} from '@/features/products/queries/products.queries';
import { useMultiStepStore } from '@/features/products/multi-step-form/store/useMultiStepStore';
import { ArrowRight, ImagePlus, Loader, Trash2 } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { HttpError } from '@/lib/http/errors';
import { toaster } from '@/lib/toaster';

interface ImageUploadStepProps {
  productId: string;
  onBack: () => void;
  onNext: () => void;
}

export function ImageUploadStep({ productId, onBack, onNext }: ImageUploadStepProps) {
  const { images, addImage, removeImage } = useMultiStepStore();
  const deleteUploadedImageMutation = useRemoveProductImage();
  const uploadImageMutation = useUploadProductImage();

  const inputRef = useRef<HTMLInputElement>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [uploadingImageCount, setUploadingImageCount] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setUploadingImageCount((count) => count + files.length);
    files.forEach(async (file) => {
      try {
        const response = await uploadImageMutation.mutateAsync({
          productId,
          data: { file, alt_text: '' },
        });
        addImage(response);
      } catch (err) {
        if (err instanceof HttpError) {
          toaster.error('Image upload failed', err);
        }
        console.error('Upload failed', err);
      } finally {
        setUploadingImageCount(0);
      }
    });

    e.target.value = '';
  };

  const handleDeleteImage = (imageId: string) => {
    setImageToDelete(imageId);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      try {
        deleteUploadedImageMutation.mutate({ productId, imageId: imageToDelete });
        setImageToDelete(null);
        removeImage(imageToDelete);
      } catch (err) {
        if (err instanceof HttpError) {
          toaster.error('Failed to delete image', err);
        }
        console.error('Delete failed', err);
      }
    }
  };

  return (
    <div className="space-y-6">
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
        onChange={handleFileUpload}
      />

      {/* Uploaded images and skeletons */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <Image
              src={image.url}
              alt={image.alt_text || 'Product Image'}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => handleDeleteImage(image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {uploadingImageCount > 0 && (
          <>
            {Array.from({ length: uploadingImageCount }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="animate-pulse rounded-lg"
                style={{ width: 120, height: 120 }}
              />
            ))}
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={onNext}>
            Next Step <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

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
              disabled={deleteUploadedImageMutation.isPending}
            >
              {deleteUploadedImageMutation.isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
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
