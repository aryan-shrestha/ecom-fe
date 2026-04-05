'use client';

import { useMultiStepStore } from '@features/products/Multi-Step-Form/store/useMultiStepStore';
import { StepIndicator } from '@features/products/Multi-Step-Form/components/StepIndicator';
import { ProductInfoStep } from '@features/products/Multi-Step-Form/components/steps/ProductInfoStep';
import { ProductSettingsStep } from '@features/products/Multi-Step-Form/components/steps/ProductSettingsStep';
import { ImageUploadStep } from '@features/products/Multi-Step-Form/components/steps/ImageUploadStep';
import { VariantStep } from '@features/products/Multi-Step-Form/components/steps/VariantStep';
import { ReviewStep } from '@features/products/Multi-Step-Form/components/steps/ReviewStep';
import { useCreateProduct } from '@features/products/Multi-Step-Form/hooks/useCreateProduct';
import type { CreateProductRequest } from '@/features/products/types/products.types';

export function MultiStepProductForm() {
  const {
    currentStep,
    subStep,
    productId,
    productData,
    variants,
    setStep,
    setSubStep,
    setProductId,
    setProductData,
    addVariant,
    removeVariant,
  } = useMultiStepStore();

  const { mutate: createProduct, isPending, error: createError } = useCreateProduct();

  const handleInfoNext = (infoData: Partial<CreateProductRequest>) => {
    setProductData({ ...(productData ?? {}), ...infoData } as CreateProductRequest);
    setSubStep('settings');
  };

  const handleSettingsNext = (settingsData: Partial<CreateProductRequest>) => {
    const merged: CreateProductRequest = {
      ...(productData ?? {}),
      ...settingsData,
    } as CreateProductRequest;
    setProductData(merged);

    if (productId) {
      setStep(2);
      return;
    }

    createProduct(merged, {
      onSuccess: (product) => {
        setProductId(product.id);
        setStep(2);
      },
    });
  };

  return (
    <div className="py-8">
      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && subStep === 'info' && (
        <ProductInfoStep defaultValues={productData ?? undefined} onNext={handleInfoNext} />
      )}

      {currentStep === 1 && subStep === 'settings' && (
        <ProductSettingsStep
          defaultValues={productData ?? undefined}
          isPending={isPending}
          error={createError?.message ?? null}
          onBack={() => setSubStep('info')}
          onNext={handleSettingsNext}
        />
      )}

      {currentStep === 2 && productId && (
        <ImageUploadStep
          productId={productId}
          onBack={() => {
            setStep(1);
            setSubStep('settings');
          }}
          onNext={() => setStep(3)}
        />
      )}

      {currentStep === 3 && productId && (
        <VariantStep
          productId={productId}
          variants={variants}
          onVariantAdded={addVariant}
          onVariantRemoved={removeVariant}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {currentStep === 4 && productId && productData && (
        <ReviewStep
          productId={productId}
          productData={productData}
          variants={variants}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
}
