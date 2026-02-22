"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type AddProductImageFormData,
  type ProductImage,
  addProductImageSchema,
} from "@/features/products";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useForm } from "react-hook-form";

interface ImageManagementProps {
  productId: string;
  images: ProductImage[];
  onAddImage: (data: AddProductImageFormData) => Promise<void>;
  onUploadImage: (file: File, altText?: string) => Promise<void>;
  onRemoveImage: (imageId: string) => Promise<void>;
}

export function ImageManagement({
  productId,
  images,
  onAddImage,
  onUploadImage,
  onRemoveImage,
}: ImageManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadAltText, setUploadAltText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AddProductImageFormData>({
    resolver: zodResolver(addProductImageSchema),
    defaultValues: {
      url: "",
      alt_text: "",
    },
  });

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

  const handleSubmit = async (data: AddProductImageFormData) => {
    try {
      setError(null);
      setIsPending(true);
      await onAddImage(data);
      setIsAddOpen(false);
      form.reset();
    } catch (err: any) {
      setError(err?.message || err?.detail || "Failed to add image");
    } finally {
      setIsPending(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    try {
      setError(null);
      setIsPending(true);
      await onUploadImage(selectedFile, uploadAltText || undefined);
      setIsAddOpen(false);
      setSelectedFile(null);
      setFilePreview(null);
      setUploadAltText("");
    } catch (err: any) {
      setError(err?.message || err?.detail || "Failed to upload image");
    } finally {
      setIsPending(false);
    }
  };

  const handleRemove = async (imageId: string) => {
    if (!confirm("Are you sure you want to remove this image?")) return;

    try {
      setRemovingId(imageId);
      await onRemoveImage(imageId);
    } catch (err: any) {
      alert(err?.message || err?.detail || "Failed to remove image");
    } finally {
      setRemovingId(null);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddOpen(open);
    if (!open) {
      setSelectedFile(null);
      setFilePreview(null);
      setUploadAltText("");
      setError(null);
      form.reset();
    }
  };

  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Images</CardTitle>
            <CardDescription>Product images in display order</CardDescription>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedImages.length === 0 ? (
          <div className="py-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No images yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {sortedImages.map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg border"
              >
                <div className="flex aspect-square items-center justify-center bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.alt_text || "Product image"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="bg-white p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      Position: {image.position}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleRemove(image.id)}
                      disabled={removingId === image.id}
                    >
                      {removingId === image.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 text-red-600" />
                      )}
                    </Button>
                  </div>
                  {image.alt_text && (
                    <p
                      className="mt-1 truncate text-xs text-gray-600"
                      title={image.alt_text}
                    >
                      {image.alt_text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isAddOpen} onOpenChange={handleDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
              <DialogDescription>
                Upload an image file or provide an image URL
              </DialogDescription>
            </DialogHeader>

            {/* Mode selector */}
            <div className="mb-4 flex gap-2">
              <Button
                type="button"
                variant={uploadMode === "file" ? "default" : "outline"}
                onClick={() => setUploadMode("file")}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              <Button
                type="button"
                variant={uploadMode === "url" ? "default" : "outline"}
                onClick={() => setUploadMode("url")}
                className="flex-1"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Image URL
              </Button>
            </div>

            {uploadMode === "file" ? (
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
                  <label className="mb-2 block text-sm font-medium">
                    Alt Text
                  </label>
                  <Input
                    placeholder="Description for accessibility"
                    value={uploadAltText}
                    onChange={(e) => setUploadAltText(e.target.value)}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Accessibility description (recommended)
                  </p>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

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
                    onClick={handleUploadSubmit}
                    disabled={isPending || !selectedFile}
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Upload Image
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://cdn.example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Full URL to the image file
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alt_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Description for accessibility"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Accessibility description (recommended)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDialogClose(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Add Image
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
