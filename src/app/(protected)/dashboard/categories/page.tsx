'use client';

import {
  CategoryCreateDialog,
  CategoryList,
  CategoryUpdateDialog,
} from '@/features/categories/components';
import { Category } from '@/features/products/types/products.types';
import { useState } from 'react';

export default function CategoriesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const toggleCreateDialog = () => {
    setIsCreateDialogOpen(!isCreateDialogOpen);
  };

  const toggleUpdateDialog = () => {
    setIsUpdateDialogOpen(!isUpdateDialogOpen);
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    toggleUpdateDialog();
  };

  console.log('Selected Category ID:', selectedCategoryId);

  return (
    <>
      <CategoryList toggleCreateDialog={toggleCreateDialog} setSelectedCategory={selectCategory} />
      <CategoryCreateDialog isOpen={isCreateDialogOpen} toggleDialog={toggleCreateDialog} />
      {selectedCategoryId && (
        <CategoryUpdateDialog
          isOpen={isUpdateDialogOpen}
          toggleDialog={toggleUpdateDialog}
          categoryId={selectedCategoryId}
        />
      )}
    </>
  );
}
