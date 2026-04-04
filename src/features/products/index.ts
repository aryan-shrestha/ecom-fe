// Export all products feature modules
export * from './types/products.types';
export * from './schemas/products.schemas';
export * from './api/products.api';
export * from './queries/products.keys';
export * from './queries/products.queries';

// Multi-step form
export { MultiStepProductForm } from './components/MultiStepProductForm';
export { StepIndicator } from './components/StepIndicator';
export { VariantStep } from './components/VariantStep';
export { ReviewStep } from './components/ReviewStep';

// Hooks
export { useCreateProduct } from './hooks/useCreateProduct';
export { useCreateVariant } from './hooks/useCreateVariant';
export { usePublishProduct } from './hooks/usePublishProduct';
