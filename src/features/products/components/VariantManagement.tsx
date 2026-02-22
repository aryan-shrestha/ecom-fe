"use client";

import { useState } from "react";

import { VariantImageUpload } from "./VariantImageUpload";
import { Badge } from "@/components/ui/badge";
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
  type CreateVariantFormData,
  type Variant,
  VariantStatus,
  createVariantSchema,
} from "@/features/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface VariantManagementProps {
  productId: string;
  variants: Variant[];
  onCreateVariant: (data: CreateVariantFormData) => Promise<void>;
  onDeactivateVariant: (variantId: string) => Promise<void>;
  onAdjustStock: (variantId: string) => void;
  onUploadVariantImage?: (
    variantId: string,
    file: File,
    altText?: string,
  ) => Promise<void>;
}

export function VariantManagement({
  productId,
  variants,
  onCreateVariant,
  onDeactivateVariant,
  onAdjustStock,
  onUploadVariantImage,
}: VariantManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateVariantFormData>({
    resolver: zodResolver(createVariantSchema),
    defaultValues: {
      sku: "",
      barcode: "",
      price_amount: 0,
      price_currency: "USD",
      is_default: variants.length === 0,
      initial_stock: 0,
      allow_backorder: false,
    },
  });

  const handleSubmit = async (data: CreateVariantFormData) => {
    try {
      setError(null);
      setIsPending(true);

      // Auto-fill currency codes for compare and cost prices if amounts are provided
      const submitData = {
        ...data,
        compare_at_price_currency: data.compare_at_price_amount
          ? data.price_currency
          : undefined,
        cost_currency: data.cost_amount ? data.price_currency : undefined,
      };

      await onCreateVariant(submitData);
      setIsCreateOpen(false);
      form.reset();
    } catch (err: any) {
      setError(err?.message || err?.detail || "Failed to create variant");
    } finally {
      setIsPending(false);
    }
  };

  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Variants</CardTitle>
            <CardDescription>Product variants and SKUs</CardDescription>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>Add Variant</Button>
        </div>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <p className="text-sm text-gray-500">
            No variants yet. Add one to enable publishing.
          </p>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{variant.sku}</h4>
                      <Badge
                        variant={
                          variant.status === VariantStatus.ACTIVE
                            ? "default"
                            : "secondary"
                        }
                      >
                        {variant.status}
                      </Badge>
                      {variant.is_default && (
                        <Badge variant="outline">Default</Badge>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Price:</span>{" "}
                        <span className="font-medium">
                          {formatMoney(
                            variant.price.amount,
                            variant.price.currency,
                          )}
                        </span>
                      </div>
                      {variant.compare_at_price && (
                        <div>
                          <span className="text-gray-600">Compare at:</span>{" "}
                          <span className="font-medium line-through">
                            {formatMoney(
                              variant.compare_at_price.amount,
                              variant.compare_at_price.currency,
                            )}
                          </span>
                        </div>
                      )}
                      {variant.barcode && (
                        <div>
                          <span className="text-gray-600">Barcode:</span>{" "}
                          {variant.barcode}
                        </div>
                      )}
                      {variant.weight && (
                        <div>
                          <span className="text-gray-600">Weight:</span>{" "}
                          {variant.weight}g
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {onUploadVariantImage && (
                      <VariantImageUpload
                        variantId={variant.id}
                        variantSku={variant.sku}
                        onUpload={(file, altText) =>
                          onUploadVariantImage(variant.id, file, altText)
                        }
                      />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAdjustStock(variant.id)}
                    >
                      Adjust Stock
                    </Button>
                    {variant.status === VariantStatus.ACTIVE && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeactivateVariant(variant.id)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Variant</DialogTitle>
              <DialogDescription>
                Add a new variant to this product
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input placeholder="PROD-SKU-001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cannot be changed after creation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (cents) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1999"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          In cents (e.g., 1999 = $19.99)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency *</FormLabel>
                        <FormControl>
                          <Input placeholder="USD" maxLength={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="compare_at_price_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compare at Price (cents)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="2999"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="initial_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : 0,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_default"
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
                      <FormLabel className="!mt-0">Default Variant</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allow_backorder"
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
                      <FormLabel className="!mt-0">Allow Backorder</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Variant
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
