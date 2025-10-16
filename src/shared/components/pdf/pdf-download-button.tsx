'use client';

import {  Download, FileText, Loader2  } from '@/components/ui/dynamic-icons';
import { useTranslations } from 'next-intl';
import React from 'react';

import { downloadPDF } from '@/shared/utils/download';

import type {
  CoffeeProduct,
  CoffeeProductEntity,
} from '@/domain/entities/coffee-product.entity';
import type { RFQ, RFQEntity } from '@/domain/entities/rfq.entity';
import { Button } from '@/presentation/components/ui/button';
import { usePDFGeneration } from '@/shared/hooks/use-pdf-generation';
import { cn } from '@/shared/utils';

export type PDFType =
  | 'productSpec'
  | 'rfqDocument'
  | 'marketReport'
  | 'certificate';

interface PDFDownloadButtonProps {
  type: PDFType;
  entityId: string;
  entityData?: CoffeeProduct | RFQ | Record<string, unknown>;
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
    error: _error,
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
          await generateProductSpecSheet(
            entityData as unknown as CoffeeProductEntity,
            {
              ...options,
              language: locale || 'en',
            }
          );
          break;
        case 'rfqDocument':
          if (!entityData) {
            throw new Error(
              'RFQ data is required for RFQ document PDF generation'
            );
          }
          await generateRFQDocument(entityData as unknown as RFQEntity, {
            ...options,
            language: locale || 'en',
          });
          break;
        case 'marketReport':
          if (!entityData) {
            throw new Error('Market report data is required');
          }
          // Create a temporary HTML element for market report
          const marketReportElement = document.createElement('div');
          marketReportElement.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
              <h1>Market Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <pre>${JSON.stringify(entityData, null, 2)}</pre>
            </div>
          `;
          document.body.appendChild(marketReportElement);
          try {
            await generateFromHTML(
              marketReportElement,
              `market-report-${new Date().toISOString().split('T')[0]}.pdf`
            );
          } finally {
            document.body.removeChild(marketReportElement);
          }
          break;

        case 'certificate':
          if (!entityData) {
            throw new Error('Certificate data is required');
          }
          // Create a temporary HTML element for certificate
          const certificateElement = document.createElement('div');
          certificateElement.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
              <h1>Certificate</h1>
              <p>This certifies that the following information is accurate:</p>
              <div style="margin: 20px 0; text-align: left;">
                <pre>${JSON.stringify(entityData, null, 2)}</pre>
              </div>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
          `;
          document.body.appendChild(certificateElement);
          try {
            await generateFromHTML(
              certificateElement,
              `certificate-${new Date().toISOString().split('T')[0]}.pdf`
            );
          } finally {
            document.body.removeChild(certificateElement);
          }
          break;
        default:
          throw new Error(`Unsupported PDF type: ${type}`);
      }

      onSuccess?.(`${type}-${entityId}.pdf`);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Unknown error occurred');
      onError?.(error);
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
    entityData?: CoffeeProduct | RFQ | Record<string, unknown>;
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
        downloadPDF(blob, filename);

        filenames.push(filename);
        setProgress(((i + 1) / items.length) * 100);
      }

      onSuccess?.(filenames);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Batch download failed');
      onError?.(error);
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
