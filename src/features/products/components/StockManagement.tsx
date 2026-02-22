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
import { Textarea } from "@/components/ui/textarea";
import {
  type AdjustStockFormData,
  type Inventory,
  type Variant,
  adjustStockSchema,
} from "@/features/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface StockManagementProps {
  variants: Variant[];
  inventory: Record<string, Inventory>;
  selectedVariantId: string | null;
  onAdjustStock: (
    variantId: string,
    data: AdjustStockFormData,
  ) => Promise<void>;
  onClose: () => void;
}

export function StockManagement({
  variants,
  inventory,
  selectedVariantId,
  onAdjustStock,
  onClose,
}: StockManagementProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AdjustStockFormData>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      delta: 0,
      reason: "",
      note: "",
    },
  });

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const selectedInventory = selectedVariantId
    ? inventory[selectedVariantId]
    : null;

  const handleSubmit = async (data: AdjustStockFormData) => {
    if (!selectedVariantId) return;

    try {
      setError(null);
      setIsPending(true);
      await onAdjustStock(selectedVariantId, data);
      onClose();
      form.reset();
    } catch (err: any) {
      setError(err?.message || err?.detail || "Failed to adjust stock");
    } finally {
      setIsPending(false);
    }
  };

  if (!selectedVariant || !selectedInventory) return null;

  return (
    <Dialog open={!!selectedVariantId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Adjust inventory for {selectedVariant.sku}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">On Hand:</span>{" "}
              <span className="font-medium">{selectedInventory.on_hand}</span>
            </div>
            <div>
              <span className="text-gray-600">Reserved:</span>{" "}
              <span className="font-medium">{selectedInventory.reserved}</span>
            </div>
            <div>
              <span className="text-gray-600">Available:</span>{" "}
              <span className="font-medium">{selectedInventory.available}</span>
            </div>
            <div>
              <span className="text-gray-600">Backorder:</span>{" "}
              <span className="font-medium">
                {selectedInventory.allow_backorder ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="delta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50 or -10"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Positive to add stock, negative to remove. Cannot be zero.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="purchase_order, return, damage, correction"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Common values: purchase_order, return, damage, correction,
                    sale
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adjust Stock
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface InventoryDisplayProps {
  variants: Variant[];
  inventory: Record<string, Inventory>;
  onAdjustStock: (variantId: string) => void;
}

export function InventoryDisplay({
  variants,
  inventory,
  onAdjustStock,
}: InventoryDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>Current stock levels</CardDescription>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <p className="text-sm text-gray-500">
            No variants to track inventory for.
          </p>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => {
              const inv = inventory[variant.id];
              if (!inv) return null;

              return (
                <div key={variant.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{variant.sku}</h4>
                      <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">On Hand:</span>{" "}
                          <span className="font-medium">{inv.on_hand}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reserved:</span>{" "}
                          <span className="font-medium">{inv.reserved}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Available:</span>{" "}
                          <span
                            className={`font-medium ${inv.available <= 0 ? "text-red-600" : ""}`}
                          >
                            {inv.available}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Backorder:</span>{" "}
                          <span className="font-medium">
                            {inv.allow_backorder ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAdjustStock(variant.id)}
                    >
                      Adjust
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
