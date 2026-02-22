"use client";

import { useState } from "react";

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
import { type Category, useCategoriesQuery } from "@/features/products";
import { Loader2 } from "lucide-react";

interface CategoryManagementProps {
  productId: string;
  assignedCategories: Category[];
  onAssignCategories: (categoryIds: string[]) => Promise<void>;
}

export function CategoryManagement({
  productId,
  assignedCategories,
  onAssignCategories,
}: CategoryManagementProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    assignedCategories.map((c) => c.id),
  );
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: allCategories, isLoading } = useCategoriesQuery();

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsPending(true);
      await onAssignCategories(selectedIds);
      setIsEditOpen(false);
    } catch (err: any) {
      setError(err?.message || err?.detail || "Failed to assign categories");
    } finally {
      setIsPending(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Product categories for organization
            </CardDescription>
          </div>
          <Button onClick={() => setIsEditOpen(true)}>Manage Categories</Button>
        </div>
      </CardHeader>
      <CardContent>
        {assignedCategories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories assigned</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignedCategories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Categories</DialogTitle>
              <DialogDescription>
                Select categories for this product
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : allCategories && allCategories.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No categories available. Create categories in the admin panel.
                </p>
              ) : (
                <div className="space-y-2">
                  {allCategories?.map((category) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-gray-500">
                        ({category.slug})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedIds(assignedCategories.map((c) => c.id));
                  setIsEditOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
