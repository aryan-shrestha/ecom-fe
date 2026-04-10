'use client';

import { useMultiStepStore } from '@/features/products/multi-step-form/store/useMultiStepStore';
import { StepIndicator } from '@/features/products/multi-step-form/components/StepIndicator';
import { ProductInfoStep } from '@/features/products/multi-step-form/components/steps/ProductInfoStep';
import { ImageUploadStep } from '@/features/products/multi-step-form/components/steps/ImageUploadStep';
import { VariantStep } from '@/features/products/multi-step-form/components/steps/VariantStep';
import { ReviewStep } from '@/features/products/multi-step-form/components/steps/ReviewStep';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEffect } from 'react';

export function MultiStepProductForm() {
  const {
    currentStep,
    productId,
    productData,
    variants,
    setStep,
    setSubStep,
    setProductId,
    addVariant,
    removeVariant,
  } = useMultiStepStore();

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Product Creation</h2>
          <p className="text-sm text-muted-foreground">
            Follow the steps to add a new product to your catalog
          </p>
        </CardHeader>
        <CardContent>
          <StepIndicator currentStep={currentStep} />

          {currentStep === 1 && <ProductInfoStep />}

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
        </CardContent>
      </Card>
    </div>
  );
}
