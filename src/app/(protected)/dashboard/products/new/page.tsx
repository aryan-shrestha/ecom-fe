'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes/paths';
import { ArrowLeft } from 'lucide-react';
import { MultiStepProductForm } from '@/features/products/components/MultiStepProductForm';

export default function NewProductPage() {
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
      <MultiStepProductForm />
    </div>
  );
}
