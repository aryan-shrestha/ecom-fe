'use client';

import { create } from 'zustand';
import type { CreateProductRequest, ProductImage } from '@/features/products/types/products.types';
import type { Variant } from '@/features/products/types/products.types';

export type TopStep = 1 | 2 | 3 | 4;
export type SubStep = 'info' | 'settings';

export interface UploadedImage {
  preview: string;
  altText: string;
  uploaded?: ProductImage;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export interface VariantImage {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

interface MultiStepState {
  currentStep: TopStep;
  subStep: SubStep;

  productId: string | null;

  productData: CreateProductRequest | null;
  variants: Variant[];

  /** Stored as an ordered array */
  images: ProductImage[];

  /** Keyed by the server-assigned variant id returned from the API */
  variantImages: Record<string, VariantImage>;

  setStep: (step: TopStep) => void;
  setSubStep: (sub: SubStep) => void;
  setProductId: (id: string) => void;
  setProductData: (data: CreateProductRequest) => void;

  addVariant: (variant: Variant) => void;
  removeVariant: (id: string) => void;

  // Product image actions
  addImage: (image: ProductImage) => void;
  removeImage: (imageId: string) => void;

  // Variant image actions
  setVariantImage: (variantId: string, file: File, preview: string) => void;
  setVariantImageStatus: (variantId: string, status: VariantImage['status']) => void;
  removeVariantImage: (variantId: string) => void;

  reset: () => void;
}

const initialState: Pick<
  MultiStepState,
  'currentStep' | 'subStep' | 'productId' | 'productData' | 'variants' | 'images' | 'variantImages'
> = {
  currentStep: 1,
  subStep: 'info',
  productId: null,
  productData: null,
  variants: [],
  images: [],
  variantImages: {},
};

export const useMultiStepStore = create<MultiStepState>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  setSubStep: (sub) => set({ subStep: sub }),
  setProductId: (id) => set({ productId: id }),
  setProductData: (data) => set({ productData: data }),

  addVariant: (variant) => set((s) => ({ variants: [...s.variants, variant] })),
  removeVariant: (id) => set((s) => ({ variants: s.variants.filter((v) => v.id !== id) })),

  addImage: (image) =>
    set((s) => ({
      images: [...s.images, image],
    })),

  removeImage: (imageId) =>
    set((s) => ({
      images: s.images.filter((img) => img.id !== imageId),
    })),

  setVariantImage: (variantId, file, preview) =>
    set((s) => ({
      variantImages: {
        ...s.variantImages,
        [variantId]: { file, preview, status: 'pending' },
      },
    })),

  setVariantImageStatus: (variantId, status) =>
    set((s) => {
      const current = s.variantImages[variantId];
      if (!current) return s;

      return {
        variantImages: {
          ...s.variantImages,
          [variantId]: { ...current, status },
        },
      };
    }),

  removeVariantImage: (variantId) =>
    set((s) => {
      const next = { ...s.variantImages };
      if (next[variantId]?.preview) URL.revokeObjectURL(next[variantId].preview);
      delete next[variantId];
      return { variantImages: next };
    }),

  reset: () =>
    set((s) => {
      Object.values(s.variantImages).forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });

      return {
        ...initialState,
        variants: [],
        images: [],
        variantImages: {},
      };
    }),
}));
