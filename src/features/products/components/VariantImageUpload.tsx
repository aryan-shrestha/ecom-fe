"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";

interface VariantImageUploadProps {
  variantId: string;
  variantSku: string;
  onUpload: (file: File, altText?: string) => Promise<void>;
}

export function VariantImageUpload({
  variantId,
  variantSku,
  onUpload,
}: VariantImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Allowed: JPEG, PNG, WebP");
        return;
      }
      if (file.size > 5242880) {
        // 5MB
        setError("File too large. Maximum size: 5MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    try {
      setError(null);
      setIsPending(true);
      await onUpload(selectedFile, altText || undefined);
      setIsOpen(false);
      setSelectedFile(null);
      setFilePreview(null);
      setAltText("");
    } catch (err: any) {
      setError(err?.message || err?.detail || "Failed to upload image");
    } finally {
      setIsPending(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedFile(null);
      setFilePreview(null);
      setAltText("");
      setError(null);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Upload className="mr-2 h-4 w-4" />
        Upload Image
      </Button>

      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Variant Image</DialogTitle>
            <DialogDescription>
              Upload an image for variant: {variantSku}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Image File *
              </label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                JPEG, PNG, or WebP. Max 5MB.
              </p>
            </div>

            {filePreview && (
              <div className="rounded-lg border p-2">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="mx-auto max-h-48"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">Alt Text</label>
              <Input
                placeholder="Description for accessibility"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                Accessibility description (recommended)
              </p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !selectedFile}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
