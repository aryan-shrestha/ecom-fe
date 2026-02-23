'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { type CreateProductFormData, useCreateProductMutation } from '@/features/products';
import { ProductForm } from '@/features/products/components/ProductForm';
import { ROUTES } from '@/lib/routes/paths';
import { ArrowLeft } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const createProductMutation = useCreateProductMutation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateProductFormData) => {
    try {
      setError(null);
      const product = await createProductMutation.mutateAsync(data);
      router.push(`${ROUTES.PRODUCTS}/${product.id}`);
    } catch (err: any) {
      setError(err?.message || err?.detail || 'Failed to create product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Product</h1>
          <p className="mt-2 text-gray-600">Add a new product to your catalog</p>
        </div>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isPending={createProductMutation.isPending}
        error={error}
      />
    </div>
  );
}
