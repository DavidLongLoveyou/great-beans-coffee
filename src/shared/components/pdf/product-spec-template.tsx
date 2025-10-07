import React from 'react';
import { useTranslations } from 'next-intl';
import { CoffeeProduct } from '@/domain/entities/coffee-product.entity';

interface ProductSpecTemplateProps {
  product: CoffeeProduct;
  locale: string;
  includeWatermark?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
}

export const ProductSpecTemplate: React.FC<ProductSpecTemplateProps> = ({
  product,
  locale,
  includeWatermark = true,
  includeHeader = true,
  includeFooter = true,
}) => {
  const t = useTranslations('pdf.templates.productSpec');
  const tCommon = useTranslations('common');
  const tProducts = useTranslations('products');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="pdf-template bg-white text-black min-h-screen p-8 font-sans">
      {/* Watermark */}
      {includeWatermark && (
        <div className="fixed inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
          <div className="text-6xl font-bold transform rotate-45 text-gray-400">
            THE GREAT BEANS
          </div>
        </div>
      )}

      {/* Header */}
      {includeHeader && (
        <header className="border-b-2 border-amber-600 pb-6 mb-8 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-amber-800 mb-2">
                THE GREAT BEANS
              </h1>
              <p className="text-gray-600">Premium Vietnamese Coffee Exports</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Generated: {formatDate(new Date())}</p>
              <p>Document Type: {t('title')}</p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {/* Product Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {product.name[locale as keyof typeof product.name] || product.name.en}
          </h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Product Overview */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tProducts('overview')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tProducts('basicInfo')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('variety')}:</span>
                  <span className="font-medium">{product.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('origin')}:</span>
                  <span className="font-medium">{product.origin.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('processing')}:</span>
                  <span className="font-medium">{product.processingMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('grade')}:</span>
                  <span className="font-medium">{product.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('cropYear')}:</span>
                  <span className="font-medium">{product.availability.harvestSeason}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tProducts('pricing')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('pricePerKg')}:</span>
                  <span className="font-medium">${product.pricing.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('minimumOrder')}:</span>
                  <span className="font-medium">{product.pricing.minimumOrder} {product.pricing.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('availability')}:</span>
                  <span className="font-medium">{product.availability.stockQuantity} {product.pricing.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tProducts('technicalSpecs')}
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tProducts('physicalProperties')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('moisture')}:</span>
                  <span className="font-medium">{product.specifications.moisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('beanSize')}:</span>
                  <span className="font-medium">{product.specifications.screenSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('density')}:</span>
                  <span className="font-medium">{product.specifications.density || 'N/A'} g/ml</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tProducts('qualityMetrics')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('defects')}:</span>
                  <span className="font-medium">{product.specifications.defectRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('screenSize')}:</span>
                  <span className="font-medium">{product.specifications.screenSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('cuppingScore')}:</span>
                  <span className="font-medium">{product.specifications.cuppingScore || 'N/A'}/100</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tProducts('packaging')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('bagSize')}:</span>
                  <span className="font-medium">60 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('bagType')}:</span>
                  <span className="font-medium">Jute/GrainPro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tProducts('palletSize')}:</span>
                  <span className="font-medium">20 bags</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tasting Notes */}
        {product.specifications.flavor && (
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
              {tProducts('tastingNotes')}
            </h3>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{product.specifications.flavor}</p>
            </div>
          </section>
        )}

        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
              {tProducts('certifications')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {product.certifications.map((cert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700">
                    {cert.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {tProducts(`certification.${cert.toLowerCase()}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Storage & Handling */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tProducts('storageHandling')}
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Store in cool, dry place (temperature: 15-20°C, humidity: &lt;65%)</li>
              <li>• Keep away from direct sunlight and strong odors</li>
              <li>• Use within 12 months of production date for optimal quality</li>
              <li>• Handle with care to prevent damage to beans</li>
              <li>• Ensure proper ventilation during storage</li>
            </ul>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tCommon('contactUs')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Sales Department</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Email: sales@thegreatbeans.com</p>
                <p>Phone: +84 28 1234 5678</p>
                <p>WhatsApp: +84 901 234 567</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Quality Assurance</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Email: quality@thegreatbeans.com</p>
                <p>Phone: +84 28 1234 5679</p>
                <p>Lab: +84 28 1234 5680</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {includeFooter && (
        <footer className="border-t-2 border-amber-600 pt-6 mt-8 relative z-10">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <p>&copy; 2024 The Great Beans. All rights reserved.</p>
              <p>Ho Chi Minh City, Vietnam</p>
            </div>
            <div className="text-right">
              <p>www.thegreatbeans.com</p>
              <p>Connecting Vietnam's finest coffee to the world</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ProductSpecTemplate;