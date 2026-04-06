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

  /** Keyed by a stable local id so insertion order is preserved */
  images: Record<string, UploadedImage & { file: File; localId: string }>;

  /** Keyed by the server-assigned variant id returned from the API */
  variantImages: Record<string, VariantImage>;

  setStep: (step: TopStep) => void;
  setSubStep: (sub: SubStep) => void;
  setProductId: (id: string) => void;
  setProductData: (data: CreateProductRequest) => void;

  addVariant: (variant: Variant) => void;
  removeVariant: (id: string) => void;

  // Product image actions
  /** Add a new pending image to the store */
  addImage: (localId: string, file: File, preview: string, altText: string) => void;
  /** Update alt text before upload */
  setImageAltText: (localId: string, altText: string) => void;
  /** Update status + optional uploaded result */
  setImageStatus: (
    localId: string,
    status: UploadedImage['status'],
    uploaded?: ProductImage,
    error?: string,
  ) => void;
  removeImage: (localId: string) => void;

  // Variant image actions
  setVariantImage: (variantId: string, file: File, preview: string) => void;
  setVariantImageStatus: (variantId: string, status: VariantImage['status']) => void;
  removeVariantImage: (variantId: string) => void;

  reset: () => void;
}

const initialState = {
  currentStep: 1 as TopStep,
  subStep: 'info' as SubStep,
  productId: null,
  productData: null,
  variants: [],
  images: {},
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

  addImage: (localId, file, preview, altText) =>
    set((s) => ({
      images: {
        ...s.images,
        [localId]: { localId, file, preview, altText, status: 'pending' },
      },
    })),

  setImageAltText: (localId, altText) =>
    set((s) => ({
      images: { ...s.images, [localId]: { ...s.images[localId], altText } },
    })),

  setImageStatus: (localId, status, uploaded, error) =>
    set((s) => ({
      images: { ...s.images, [localId]: { ...s.images[localId], status, uploaded, error } },
    })),

  removeImage: (localId) =>
    set((s) => {
      const next = { ...s.images };
      // Revoke the object URL to avoid memory leaks
      if (next[localId]?.preview) URL.revokeObjectURL(next[localId].preview);
      delete next[localId];
      return { images: next };
    }),

  setVariantImage: (variantId, file, preview) =>
    set((s) => ({
      variantImages: {
        ...s.variantImages,
        [variantId]: { file, preview, status: 'pending' },
      },
    })),

  setVariantImageStatus: (variantId, status) =>
    set((s) => ({
      variantImages: {
        ...s.variantImages,
        [variantId]: { ...s.variantImages[variantId], status },
      },
    })),

  removeVariantImage: (variantId) =>
    set((s) => {
      const next = { ...s.variantImages };
      if (next[variantId]?.preview) URL.revokeObjectURL(next[variantId].preview);
      delete next[variantId];
      return { variantImages: next };
    }),

  reset: () =>
    set((s) => {
      Object.values(s.images).forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
      Object.values(s.variantImages).forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
      return initialState;
    }),
}));
