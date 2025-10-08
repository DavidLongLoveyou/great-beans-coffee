'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/presentation/components/ui/button';
import { usePDFGeneration } from '@/shared/hooks/use-pdf-generation';
import { Download, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';

export type PDFType =
  | 'productSpec'
  | 'rfqDocument'
  | 'marketReport'
  | 'certificate';

interface PDFDownloadButtonProps {
  type: PDFType;
  entityId: string;
  entityData?: any;
  locale?: string;
  options?: {
    format?: 'A4' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
    quality?: number;
    includeWatermark?: boolean;
    includeHeader?: boolean;
    includeFooter?: boolean;
  };
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  disabled?: boolean;
  onSuccess?: (filename: string) => void;
  onError?: (error: Error) => void;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  type,
  entityId,
  entityData,
  locale,
  options = {},
  variant = 'default',
  size = 'default',
  className,
  children,
  showIcon = true,
  disabled = false,
  onSuccess,
  onError,
}) => {
  const t = useTranslations('pdf.buttons');
  const {
    generateProductSpecSheet,
    generateRFQDocument,
    generateFromHTML,
    isGenerating,
    error,
  } = usePDFGeneration();

  const getButtonText = () => {
    if (isGenerating) {
      return t('downloading');
    }

    switch (type) {
      case 'productSpec':
        return children || t('downloadSpec');
      case 'rfqDocument':
        return children || t('downloadRfq');
      case 'marketReport':
        return children || t('downloadReport');
      case 'certificate':
        return children || t('downloadCertificate');
      default:
        return children || t('generatePdf');
    }
  };

  const handleDownload = async () => {
    try {
      switch (type) {
        case 'productSpec':
          if (!entityData) {
            throw new Error(
              'Product data is required for product spec PDF generation'
            );
          }
          await generateProductSpecSheet(entityData, {
            ...options,
            language: locale || 'en',
          });
          break;
        case 'rfqDocument':
          if (!entityData) {
            throw new Error(
              'RFQ data is required for RFQ document PDF generation'
            );
          }
          await generateRFQDocument(entityData, {
            ...options,
            language: locale || 'en',
          });
          break;
        case 'marketReport':
        case 'certificate':
          if (!entityData) {
            throw new Error(
              'Entity data is required for HTML-based PDF generation'
            );
          }
          await generateFromHTML(entityData, `${type}-${entityId}`, {
            ...options,
            language: locale || 'en',
          });
          break;
        default:
          throw new Error(`Unsupported PDF type: ${type}`);
      }

      onSuccess?.(`${type}-${entityId}.pdf`);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Unknown error occurred');
      onError?.(error);
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'relative',
        isGenerating && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || isGenerating}
      onClick={handleDownload}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {getButtonText()}
        </>
      ) : (
        <>
          {showIcon && <Download className="mr-2 h-4 w-4" />}
          {getButtonText()}
        </>
      )}
    </Button>
  );
};

// Specialized components for common use cases
export const ProductSpecDownloadButton: React.FC<
  Omit<PDFDownloadButtonProps, 'type' | 'entityId'> & { productId: string }
> = ({ productId, ...props }) => (
  <PDFDownloadButton type="productSpec" entityId={productId} {...props} />
);

export const RFQDocumentDownloadButton: React.FC<
  Omit<PDFDownloadButtonProps, 'type' | 'entityId'> & { rfqId: string }
> = ({ rfqId, ...props }) => (
  <PDFDownloadButton type="rfqDocument" entityId={rfqId} {...props} />
);

// Batch download component for multiple PDFs
interface BatchPDFDownloadButtonProps {
  items: Array<{
    type: PDFType;
    entityId: string;
    entityData?: any;
    filename?: string;
  }>;
  locale?: string;
  options?: PDFDownloadButtonProps['options'];
  variant?: PDFDownloadButtonProps['variant'];
  size?: PDFDownloadButtonProps['size'];
  className?: string;
  children?: React.ReactNode;
  onSuccess?: (filenames: string[]) => void;
  onError?: (error: Error) => void;
}

export const BatchPDFDownloadButton: React.FC<BatchPDFDownloadButtonProps> = ({
  items,
  locale,
  options = {},
  variant = 'default',
  size = 'default',
  className,
  children,
  onSuccess,
  onError,
}) => {
  const t = useTranslations('pdf.buttons');
  const tBatch = useTranslations('pdf.batch');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleBatchDownload = async () => {
    if (items.length === 0) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      const filenames: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;

        // Generate PDF based on type
        const response = await fetch(`/api/pdf/${item.type}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [`${item.type === 'productSpec' ? 'productId' : 'rfqId'}`]:
              item.entityId,
            locale,
            options,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate PDF for ${item.entityId}`);
        }

        const blob = await response.blob();
        const filename =
          item.filename || `${item.type}-${item.entityId}-${Date.now()}.pdf`;

        // Download the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        filenames.push(filename);
        setProgress(((i + 1) / items.length) * 100);
      }

      onSuccess?.(filenames);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Batch download failed');
      onError?.(error);
      console.error('Batch PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'relative',
        isGenerating && 'cursor-not-allowed',
        className
      )}
      disabled={isGenerating || items.length === 0}
      onClick={handleBatchDownload}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {tBatch('generating.description', { count: items.length })}
          {progress > 0 && (
            <span className="ml-2 text-xs">({Math.round(progress)}%)</span>
          )}
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          {children || `${t('generatePdf')} (${items.length})`}
        </>
      )}
    </Button>
  );
};

export default PDFDownloadButton;
