'use client';

import { useState, useCallback } from 'react';

export interface UseMultiStepFormReturn<T> {
  currentStep: number;
  formData: T;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateFormData: (data: Partial<T>) => void;
  resetForm: () => void;
  progress: number;
}

/**
 * Hook for managing multi-step form state and navigation
 */
export function useMultiStepForm<T>(
  initialData: T,
  totalSteps: number
): UseMultiStepFormReturn<T> {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialData);
  }, [initialData]);

  return {
    currentStep,
    formData,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    resetForm,
    progress,
  };
}
