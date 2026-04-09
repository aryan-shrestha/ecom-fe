'use client';

import { useState } from 'react';

import Link from 'next/link';

import EmptyProductList from './EmptyProductList';
import { LoadingBlock } from '@/components/common/LoadingBlock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProductsListQuery } from '@/features/products';
import { type ProductListFilters, ProductStatus } from '@/features/products';
import { ROUTES } from '@/lib/routes/paths';
import { Plus, Search } from 'lucide-react';

export function ProductList() {
  const [filters, setFilters] = useState<ProductListFilters>({
    offset: 0,
    limit: 20,
    sort_by: 'created_at',
    sort_desc: true,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useProductsListQuery(filters);

  const handleStatusFilter = (status?: ProductStatus) => {
    setFilters((prev) => ({ ...prev, status, offset: 0 }));
  };

  const handleFeaturedFilter = (featured?: boolean) => {
    setFilters((prev) => ({ ...prev, featured, offset: 0 }));
  };

  const handleTagFilter = (tag: string) => {
    setFilters((prev) => ({ ...prev, tag: tag || undefined, offset: 0 }));
  };

  const getStatusBadge = (status: ProductStatus) => {
    const variants = {
      [ProductStatus.DRAFT]: 'warning',
      [ProductStatus.PUBLISHED]: 'success',
      [ProductStatus.ARCHIVED]: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status] || 'secondary'} className="mr-2 lowercase">
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <LoadingBlock />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">
            Error loading products: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const products = data?.products || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>
        <Link href={ROUTES.PRODUCTS_NEW}>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Create Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-0 p-0">
        <CardContent className="space-y-4 p-0">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!filters.status ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(undefined)}
            >
              All
            </Button>
            <Button
              variant={filters.status === ProductStatus.DRAFT ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(ProductStatus.DRAFT)}
            >
              Draft
            </Button>
            <Button
              variant={filters.status === ProductStatus.PUBLISHED ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(ProductStatus.PUBLISHED)}
            >
              Published
            </Button>
            <Button
              variant={filters.status === ProductStatus.ARCHIVED ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(ProductStatus.ARCHIVED)}
            >
              Archived
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.featured === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFeaturedFilter(undefined)}
            >
              All Products
            </Button>
            <Button
              variant={filters.featured === true ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFeaturedFilter(true)}
            >
              Featured Only
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Filter by tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTagFilter(searchTerm);
                  }
                }}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleTagFilter(searchTerm)}>Search</Button>
            {filters.tag && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  handleTagFilter('');
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products List */}

      {products.length === 0 ? (
        <EmptyProductList />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product) => (
            <Link key={product.id} href={`${ROUTES.PRODUCTS}/${product.id}`} className="block">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{product.name}</CardTitle>
                  <CardDescription>{product.description_short || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <div>
                    {getStatusBadge(product.status)}
                    {product.featured && <Badge className="mr-2">Featured</Badge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > filters.limit! && (
        <div className="mt-6 flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            disabled={filters.offset === 0}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                offset: Math.max(0, prev.offset! - prev.limit!),
              }))
            }
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Showing {filters.offset! + 1} - {Math.min(filters.offset! + filters.limit!, total)} of{' '}
            {total}
          </span>
          <Button
            variant="outline"
            disabled={filters.offset! + filters.limit! >= total}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                offset: prev.offset! + prev.limit!,
              }))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
