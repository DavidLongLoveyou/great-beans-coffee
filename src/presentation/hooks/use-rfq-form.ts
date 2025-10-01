'use client';

import { useState, useCallback } from 'react';

import { SubmitRfqRequest } from '@/application/use-cases/rfq-management';
import { RfqEntity } from '@/domain/entities/rfq.entity';
import { submitRfqUseCase } from '@/infrastructure/di/container';

interface UseRfqFormState {
  loading: boolean;
  error: string | null;
  success: boolean;
  submittedRfq: RfqEntity | null;
  rfqNumber: string | null;
}

export function useRfqForm() {
  const [state, setState] = useState<UseRfqFormState>({
    loading: false,
    error: null,
    success: false,
    submittedRfq: null,
    rfqNumber: null,
  });

  const submitRfq = useCallback(async (rfqData: SubmitRfqRequest) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const response = await submitRfqUseCase.execute(rfqData);

      setState(prev => ({
        ...prev,
        loading: false,
        success: true,
        submittedRfq: response.rfq,
        rfqNumber: response.rfqNumber,
      }));

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to submit RFQ';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false,
      }));

      throw error;
    }
  }, []);

  const resetForm = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      submittedRfq: null,
      rfqNumber: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    submitRfq,
    resetForm,
    clearError,
  };
}

// Hook for managing multi-step form state
export function useMultiStepForm<T>(initialData: T, totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<T>(initialData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const updateFormData = useCallback((stepData: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const markStepComplete = useCallback((step: number) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  }, []);

  const isStepComplete = useCallback(
    (step: number) => {
      return completedSteps.has(step);
    },
    [completedSteps]
  );

  const canGoToStep = useCallback(
    (step: number) => {
      // Can go to current step, previous steps, or next step if current is complete
      return (
        step <= currentStep ||
        (step === currentStep + 1 && isStepComplete(currentStep))
      );
    },
    [currentStep, isStepComplete]
  );

  const progress = (currentStep / totalSteps) * 100;

  const reset = useCallback(() => {
    setCurrentStep(1);
    setFormData(initialData);
    setCompletedSteps(new Set());
  }, [initialData]);

  return {
    currentStep,
    formData,
    completedSteps,
    progress,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    markStepComplete,
    isStepComplete,
    canGoToStep,
    reset,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
}

// Hook for form validation
export function useFormValidation<T>(
  validationSchema: (data: T) => Record<string, string | undefined>
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (data: T): boolean => {
      const validationErrors = validationSchema(data);
      const filteredErrors = Object.entries(validationErrors)
        .filter(([, error]) => error !== undefined)
        .reduce((acc, [key, error]) => ({ ...acc, [key]: error }), {});

      setErrors(filteredErrors);
      return Object.keys(filteredErrors).length === 0;
    },
    [validationSchema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}
