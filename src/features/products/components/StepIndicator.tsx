'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = [{ label: 'Product Info' }, { label: 'Variants' }, { label: 'Review & Publish' }];

interface StepIndicatorProps {
  currentStep: number; // 1-indexed
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step.label} className="flex items-center gap-3">
              {/* Circle + label */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200',
                    isCompleted || isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    'whitespace-nowrap text-sm font-medium transition-colors duration-200',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector — not after last step */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-px w-8 shrink-0 transition-colors duration-300',
                    isCompleted ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 border-b border-border" />
    </div>
  );
}
