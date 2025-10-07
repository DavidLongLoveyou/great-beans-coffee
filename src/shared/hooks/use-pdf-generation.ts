/**
 * PDF Generation Hook
 * 
 * Provides React components with easy-to-use PDF generation capabilities
 * Handles loading states, error handling, and download management
 */

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from '@/shared/hooks/use-toast';
import { 
  pdfGenerationService, 
  type PDFGenerationOptions, 
  type PDFTemplateType 
} from '@/infrastructure/services/pdf-generation.service';
import type { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import type { RFQEntity } from '@/domain/entities/rfq.entity';

interface UsePDFGenerationReturn {
  isGenerating: boolean;
  error: string | null;
  generateProductSpecSheet: (product: CoffeeProductEntity, options?: PDFGenerationOptions) => Promise<void>;
  generateRFQDocument: (rfq: RFQEntity, options?: PDFGenerationOptions) => Promise<void>;
  generateFromHTML: (element: HTMLElement, filename: string, options?: PDFGenerationOptions) => Promise<void>;
  clearError: () => void;
}

export function usePDFGeneration(): UsePDFGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('pdf');

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateProductSpecSheet = useCallback(async (
    product: CoffeeProductEntity,
    options: PDFGenerationOptions = {}
  ) => {
    try {
      setIsGenerating(true);
      setError(null);

      toast({
        title: t('generating.title'),
        description: t('generating.productSpec'),
      });

      const pdfBlob = await pdfGenerationService.generateProductSpecSheet(product, {
        ...options,
        language: options.language || 'en',
      });

      const filename = `${product.sku || product.name.en.replace(/\s+/g, '-')}-spec-sheet.pdf`;
      pdfGenerationService.downloadPDF(pdfBlob, filename);

      toast({
        title: t('success.title'),
        description: t('success.productSpec'),
        variant: 'default',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error.unknown');
      setError(errorMessage);
      
      toast({
        title: t('error.title'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [t]);

  const generateRFQDocument = useCallback(async (
    rfq: RFQEntity,
    options: PDFGenerationOptions = {}
  ) => {
    try {
      setIsGenerating(true);
      setError(null);

      toast({
        title: t('generating.title'),
        description: t('generating.rfqDocument'),
      });

      const pdfBlob = await pdfGenerationService.generateRFQDocument(rfq, {
        ...options,
        language: options.language || 'en',
      });

      const filename = `RFQ-${rfq.rfqNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdfGenerationService.downloadPDF(pdfBlob, filename);

      toast({
        title: t('success.title'),
        description: t('success.rfqDocument'),
        variant: 'default',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error.unknown');
      setError(errorMessage);
      
      toast({
        title: t('error.title'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [t]);

  const generateFromHTML = useCallback(async (
    element: HTMLElement,
    filename: string,
    options: PDFGenerationOptions = {}
  ) => {
    try {
      setIsGenerating(true);
      setError(null);

      toast({
        title: t('generating.title'),
        description: t('generating.htmlToPdf'),
      });

      const pdfBlob = await pdfGenerationService.generateFromHTML(element, filename, {
        ...options,
        language: options.language || 'en',
      });

      pdfGenerationService.downloadPDF(pdfBlob, filename);

      toast({
        title: t('success.title'),
        description: t('success.htmlToPdf'),
        variant: 'default',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error.unknown');
      setError(errorMessage);
      
      toast({
        title: t('error.title'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [t]);

  return {
    isGenerating,
    error,
    generateProductSpecSheet,
    generateRFQDocument,
    generateFromHTML,
    clearError,
  };
}

// Utility hook for batch PDF generation
export function useBatchPDFGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('pdf');

  const generateBatch = useCallback(async (
    items: Array<{
      type: PDFTemplateType;
      data: CoffeeProductEntity | RFQEntity;
      filename: string;
      options?: PDFGenerationOptions;
    }>
  ) => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);

      toast({
        title: t('batch.generating.title'),
        description: t('batch.generating.description', { count: items.length }),
      });

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (!item) {
          console.error(`Item at index ${i} is undefined`);
          continue;
        }
        
        try {
          let pdfBlob: Blob;
          
          if (item.type === 'product-spec-sheet' && 'sku' in item.data) {
            pdfBlob = await pdfGenerationService.generateProductSpecSheet(
              item.data as CoffeeProductEntity,
              item.options
            );
          } else if (item.type === 'rfq-document' && 'rfqNumber' in item.data) {
            pdfBlob = await pdfGenerationService.generateRFQDocument(
              item.data as RFQEntity,
              item.options
            );
          } else {
            throw new Error(`Unsupported PDF type: ${item.type}`);
          }

          pdfGenerationService.downloadPDF(pdfBlob, item.filename);
          
          setProgress(((i + 1) / items.length) * 100);
          
          // Small delay to prevent overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (itemError) {
          console.error(`Failed to generate PDF for item ${i}:`, itemError);
          // Continue with other items
        }
      }

      toast({
        title: t('batch.success.title'),
        description: t('batch.success.description'),
        variant: 'default',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error.unknown');
      setError(errorMessage);
      
      toast({
        title: t('batch.error.title'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [t]);

  return {
    isGenerating,
    progress,
    error,
    generateBatch,
    clearError: () => setError(null),
  };
}