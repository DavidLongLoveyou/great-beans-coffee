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
