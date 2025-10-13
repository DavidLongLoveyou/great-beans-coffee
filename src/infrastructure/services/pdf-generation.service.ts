/**
 * PDF Generation Service
 *
 * Provides comprehensive PDF generation capabilities for:
 * - Coffee product specification sheets
 * - RFQ (Request for Quote) documents
 * - Market reports
 * - Certificates and compliance documents
 *
 * Supports both client-side (jsPDF) and server-side (Puppeteer) generation
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { RFQEntity } from '@/domain/entities/rfq.entity';
import { createScopedLogger } from '@/shared/utils/logger';

const logger = createScopedLogger('PDFGenerationService');

// PDF Generation Options
export interface PDFGenerationOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  includeWatermark?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
  language?: string;
}

// PDF Template Types
export type PDFTemplateType =
  | 'product-spec-sheet'
  | 'rfq-document'
  | 'market-report'
  | 'certificate'
  | 'quote-response';

// Company Branding Configuration
interface CompanyBranding {
  logo: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export class PDFGenerationService {
  private readonly companyBranding: CompanyBranding = {
    logo: '/images/logo/great-beans-logo.png',
    companyName: 'The Great Beans Coffee Export',
    address: 'Ho Chi Minh City, Vietnam',
    phone: '+84 (0) 270 123 4567',
    email: 'info@greatbeans.com',
    website: 'www.greatbeans.com',
    colors: {
      primary: '#8B4513', // Coffee brown
      secondary: '#D4AF37', // Gold
      accent: '#F5F5DC', // Beige
    },
  };

  /**
   * Generate Product Specification Sheet PDF
   */
  async generateProductSpecSheet(
    product: CoffeeProductEntity,
    options: PDFGenerationOptions = {}
  ): Promise<Blob> {
    try {
      // Infrastructure layer logging removed for production

      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'A4',
      });

      // Add company header
      this.addHeader(pdf, 'Coffee Product Specification Sheet');

      // Add product information
      this.addProductDetails(pdf, product);

      // Add specifications table
      this.addSpecificationsTable(pdf, product);

      // Add certifications and quality info
      this.addCertifications(pdf, product);

      // Add footer
      this.addFooter(pdf);

      // Add watermark if requested
      if (options.includeWatermark) {
        this.addWatermark(pdf);
      }

      return pdf.output('blob');
    } catch (error) {
      // Infrastructure layer error logging removed for production
      throw new Error('PDF generation failed');
    }
  }

  /**
   * Generate RFQ Document PDF
   */
  async generateRFQDocument(
    rfq: RFQEntity,
    options: PDFGenerationOptions = {}
  ): Promise<Blob> {
    try {
      // Infrastructure layer logging removed for production

      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'A4',
      });

      // Add company header
      this.addHeader(pdf, 'Request for Quote');

      // Add RFQ details
      this.addRFQDetails(pdf, rfq);

      // Add product requirements
      this.addRFQRequirements(pdf, rfq);

      // Add shipping and logistics
      this.addRFQLogistics(pdf, rfq);

      // Add terms and conditions
      this.addRFQTerms(pdf);

      // Add footer
      this.addFooter(pdf);

      return pdf.output('blob');
    } catch (error) {
      // Infrastructure layer error logging removed for production
      throw new Error('RFQ PDF generation failed');
    }
  }

  /**
   * Generate PDF from HTML Element (for complex layouts)
   */
  async generateFromHTML(
    element: HTMLElement,
    filename: string,
    options: PDFGenerationOptions = {}
  ): Promise<Blob> {
    try {
      // Infrastructure layer logging removed for production

      const canvas = await html2canvas(element, {
        scale: options.quality || 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'A4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf.output('blob');
    } catch (error) {
      // Infrastructure layer error logging removed for production
      throw new Error('HTML to PDF conversion failed');
    }
  }

  /**
   * Add company header to PDF
   */
  private addHeader(pdf: jsPDF, title: string): void {
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Add logo (placeholder - would need actual logo implementation)
    pdf.setFillColor(139, 69, 19); // Coffee brown
    pdf.rect(20, 10, 15, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text('LOGO', 25, 20);

    // Add company name
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(this.companyBranding.companyName, 40, 18);

    // Add document title
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(title, 40, 25);

    // Add contact info
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const contactInfo = `${this.companyBranding.phone} | ${this.companyBranding.email} | ${this.companyBranding.website}`;
    pdf.text(contactInfo, pageWidth - 20, 15, { align: 'right' });

    // Add separator line
    pdf.setDrawColor(139, 69, 19);
    pdf.setLineWidth(0.5);
    pdf.line(20, 30, pageWidth - 20, 30);
  }

  /**
   * Add product details section
   */
  private addProductDetails(pdf: jsPDF, product: CoffeeProductEntity): void {
    let yPosition = 45;

    // Product name
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(product.getLocalizedName('en'), 20, yPosition);
    yPosition += 10;

    // Product description
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const description =
      product.getLocalizedDescription('en') ||
      'Premium Vietnamese coffee product';
    const splitDescription = pdf.splitTextToSize(description, 170);
    pdf.text(splitDescription, 20, yPosition);
    yPosition += splitDescription.length * 5 + 5;

    // Basic product info
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Product Information:', 20, yPosition);
    yPosition += 8;

    const productInfo = [
      ['Product Code:', product.sku || 'N/A'],
      ['Origin:', product.origin?.region || 'Vietnam'],
      ['Type:', product.type || 'Robusta'],
      ['Processing:', product.processingMethod || 'Washed'],
      ['Grade:', product.grade || 'Premium'],
    ];

    pdf.setFont('helvetica', 'normal');
    productInfo.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.text(value, 70, yPosition);
      yPosition += 6;
    });
  }

  /**
   * Add specifications table
   */
  private addSpecificationsTable(
    pdf: jsPDF,
    product: CoffeeProductEntity
  ): void {
    let yPosition = 120;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Technical Specifications:', 20, yPosition);
    yPosition += 10;

    // Table headers
    pdf.setFillColor(139, 69, 19);
    pdf.rect(20, yPosition, 170, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Parameter', 25, yPosition + 5);
    pdf.text('Specification', 100, yPosition + 5);
    yPosition += 8;

    // Table rows
    const specs = product.specifications;
    const specRows = [
      ['Moisture Content', `${specs.moisture}% max` || '12.5% max'],
      ['Screen Size', specs.screenSize || '16+ (85% min)'],
      ['Defect Rate', `${specs.defectRate}%` || '5% max'],
      [
        'Cupping Score',
        specs.cuppingScore ? `${specs.cuppingScore}/100` : 'N/A',
      ],
      ['Density', specs.density ? `${specs.density} g/ml` : '650-700 g/L'],
      ['Acidity', specs.acidity || 'Low'],
      ['Body', specs.body || 'Full'],
      ['Flavor Notes', specs.flavor || 'Earthy, nutty'],
    ];

    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    specRows.forEach(([param, spec], index) => {
      const bgColor = index % 2 === 0 ? 245 : 255;
      pdf.setFillColor(bgColor, bgColor, bgColor);
      pdf.rect(20, yPosition, 170, 6, 'F');

      pdf.text(param, 25, yPosition + 4);
      pdf.text(spec, 100, yPosition + 4);
      yPosition += 6;
    });
  }

  /**
   * Add certifications section
   */
  private addCertifications(pdf: jsPDF, product: CoffeeProductEntity): void {
    let yPosition = 200;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Certifications & Quality Assurance:', 20, yPosition);
    yPosition += 10;

    const certifications =
      product.certifications.length > 0
        ? product.certifications.map(cert => {
            // Convert enum values to readable names
            switch (cert) {
              case 'ORGANIC':
                return 'Organic Certified';
              case 'FAIR_TRADE':
                return 'Fair Trade Certified';
              case 'RAINFOREST_ALLIANCE':
                return 'Rainforest Alliance Certified';
              case 'UTZ':
                return 'UTZ Certified';
              case 'C_CAFE':
                return 'C.A.F.E. Practices';
              case 'ISO_22000':
                return 'ISO 22000:2018 Food Safety Management';
              case 'HACCP':
                return 'HACCP Certified';
              case 'KOSHER':
                return 'Kosher Certified';
              case 'HALAL':
                return 'Halal Certified';
              default:
                return cert;
            }
          })
        : [
            'ISO 22000:2018 Food Safety Management',
            'HACCP Certified',
            'Vietnam Good Agricultural Practices (VietGAP)',
            'Rainforest Alliance Certified',
          ];

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    certifications.forEach(cert => {
      pdf.text('• ' + cert, 25, yPosition);
      yPosition += 6;
    });
  }

  /**
   * Add RFQ details section
   */
  private addRFQDetails(pdf: jsPDF, rfq: RFQEntity): void {
    let yPosition = 45;

    // RFQ header info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RFQ Details:', 20, yPosition);
    yPosition += 10;

    const rfqInfo = [
      ['RFQ Number:', rfq.rfqNumber],
      ['Date:', new Date(rfq.submittedAt).toLocaleDateString()],
      ['Status:', rfq.status],
      ['Priority:', rfq.priority],
      ['Client:', rfq.companyInfo.companyName],
    ];

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    rfqInfo.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.text(value, 70, yPosition);
      yPosition += 6;
    });
  }

  /**
   * Add RFQ requirements section
   */
  private addRFQRequirements(pdf: jsPDF, rfq: RFQEntity): void {
    let yPosition = 100;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Product Requirements:', 20, yPosition);
    yPosition += 10;

    // Add requirements details
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const requirements = [
      ['Coffee Type:', rfq.productRequirements.coffeeType],
      ['Grade:', rfq.productRequirements.grade || 'N/A'],
      ['Processing:', rfq.productRequirements.processingMethod || 'N/A'],
      [
        'Quantity:',
        `${rfq.quantityRequirements.quantity} ${rfq.quantityRequirements.unit}`,
      ],
      ['Origin:', rfq.productRequirements.origin || 'Vietnam'],
    ];

    requirements.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.text(value, 80, yPosition);
      yPosition += 6;
    });
  }

  /**
   * Add RFQ logistics section
   */
  private addRFQLogistics(pdf: jsPDF, rfq: RFQEntity): void {
    let yPosition = pdf.internal.pageSize.height - 120;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Shipping & Logistics:', 20, yPosition);
    yPosition += 10;

    const logisticsInfo = [
      ['Delivery Terms:', rfq.deliveryRequirements.incoterms || 'FOB'],
      ['Destination:', rfq.deliveryRequirements.destinationPort || 'TBD'],
      [
        'Destination Country:',
        rfq.deliveryRequirements.destinationCountry || 'TBD',
      ],
      [
        'Preferred Delivery:',
        rfq.deliveryRequirements.preferredDeliveryDate
          ? new Date(
              rfq.deliveryRequirements.preferredDeliveryDate
            ).toLocaleDateString()
          : 'TBD',
      ],
      [
        'Latest Delivery:',
        rfq.deliveryRequirements.latestDeliveryDate
          ? new Date(
              rfq.deliveryRequirements.latestDeliveryDate
            ).toLocaleDateString()
          : 'TBD',
      ],
      ['Packaging:', rfq.deliveryRequirements.packaging || 'Standard'],
    ];

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    logisticsInfo.forEach(([label, value]) => {
      pdf.text(label, 25, yPosition);
      pdf.text(value, 80, yPosition);
      yPosition += 6;
    });
  }

  /**
   * Add RFQ terms and conditions
   */
  private addRFQTerms(pdf: jsPDF): void {
    let yPosition = 220;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Terms & Conditions:', 20, yPosition);
    yPosition += 10;

    const terms = [
      '• This quote is valid for 30 days from the date of issue',
      '• Prices are subject to change based on market conditions',
      '• Payment terms: 30% advance, 70% against shipping documents',
      '• Quality specifications as per agreed standards',
      '• Force majeure conditions apply',
    ];

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    terms.forEach(term => {
      pdf.text(term, 20, yPosition);
      yPosition += 5;
    });
  }

  /**
   * Add footer to PDF
   */
  private addFooter(pdf: jsPDF): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Add separator line
    pdf.setDrawColor(139, 69, 19);
    pdf.setLineWidth(0.5);
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

    // Add footer text
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(this.companyBranding.companyName, 20, pageHeight - 12);
    pdf.text(this.companyBranding.address, 20, pageHeight - 8);

    // Add page number
    pdf.text(`Page 1`, pageWidth - 20, pageHeight - 8, { align: 'right' });

    // Add generation date
    const generatedDate = `Generated: ${new Date().toLocaleDateString()}`;
    pdf.text(generatedDate, pageWidth - 20, pageHeight - 12, {
      align: 'right',
    });
  }

  /**
   * Add watermark to PDF
   */
  private addWatermark(pdf: jsPDF): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(50);
    pdf.setFont('helvetica', 'bold');

    // Rotate and add watermark text
    pdf.text('CONFIDENTIAL', pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: 'center',
    });
  }

  /**
   * Server-side PDF generation methods for API routes
   */

  /**
   * Generate Product Specification Sheet PDF (Server-side)
   */
  async generateProductSpecPDF(
    product: CoffeeProductEntity,
    locale: string = 'en',
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    try {
      const blob = await this.generateProductSpecSheet(product, {
        ...options,
        language: locale,
      });

      // Convert Blob to Buffer for server-side usage
      const arrayBuffer = await blob.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      // Infrastructure layer error logging removed for production
      throw new Error('Server-side PDF generation failed');
    }
  }

  /**
   * Generate RFQ Document PDF (Server-side)
   */
  async generateRFQDocumentPDF(
    rfq: RFQEntity,
    products: CoffeeProductEntity[],
    locale: string = 'en',
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    try {
      const blob = await this.generateRFQDocument(rfq, {
        ...options,
        language: locale,
      });

      // Convert Blob to Buffer for server-side usage
      const arrayBuffer = await blob.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      // Infrastructure layer error logging removed for production
      throw new Error('Server-side RFQ PDF generation failed');
    }
  }

  /**
   * Download PDF file
   */
  downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const pdfGenerationService = new PDFGenerationService();
