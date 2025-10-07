import React from 'react';
import { useTranslations } from 'next-intl';
import { RFQ } from '@/domain/clients/rfq.entity';
import { CoffeeProduct } from '@/domain/products/coffee-product.entity';

interface RFQDocumentTemplateProps {
  rfq: RFQ;
  products: CoffeeProduct[];
  locale: string;
  includeWatermark?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
}

export const RFQDocumentTemplate: React.FC<RFQDocumentTemplateProps> = ({
  rfq,
  products,
  locale,
  includeWatermark = true,
  includeHeader = true,
  includeFooter = true,
}) => {
  const t = useTranslations('pdf.templates.rfqDocument');
  const tCommon = useTranslations('common');
  const tRfq = useTranslations('rfq');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateTotalValue = () => {
    return rfq.items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.pricePerKg * item.quantityKg : 0);
    }, 0);
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
              <p>RFQ ID: {rfq.id}</p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {/* RFQ Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t('title')} #{rfq.id}
          </h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        {/* RFQ Overview */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tRfq('overview')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tRfq('requestDetails')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('submittedDate')}:</span>
                  <span className="font-medium">{formatDate(rfq.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('status')}:</span>
                  <span className="font-medium capitalize">{rfq.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('urgency')}:</span>
                  <span className="font-medium capitalize">{rfq.urgency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('estimatedValue')}:</span>
                  <span className="font-medium">{formatCurrency(calculateTotalValue())}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tRfq('deliveryRequirements')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('preferredDeliveryDate')}:</span>
                  <span className="font-medium">
                    {rfq.preferredDeliveryDate ? formatDate(rfq.preferredDeliveryDate) : 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('shippingMethod')}:</span>
                  <span className="font-medium">{rfq.shippingMethod || 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('incoterms')}:</span>
                  <span className="font-medium">{rfq.incoterms || 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('destination')}:</span>
                  <span className="font-medium">{rfq.destinationPort || 'TBD'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Information */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tRfq('clientInformation')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tRfq('companyDetails')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('companyName')}:</span>
                  <span className="font-medium">{rfq.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('industry')}:</span>
                  <span className="font-medium">{rfq.industry || 'Coffee Trading'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('country')}:</span>
                  <span className="font-medium">{rfq.country}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tRfq('contactPerson')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('name')}:</span>
                  <span className="font-medium">{rfq.contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('email')}:</span>
                  <span className="font-medium">{rfq.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('phone')}:</span>
                  <span className="font-medium">{rfq.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Requirements */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tRfq('productRequirements')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">{tRfq('product')}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">{tRfq('quantity')}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">{tRfq('unitPrice')}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">{tRfq('totalValue')}</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">{tRfq('specifications')}</th>
                </tr>
              </thead>
              <tbody>
                {rfq.items.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  const totalValue = product ? product.pricePerKg * item.quantityKg : 0;
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-gray-300 px-4 py-2">
                        <div>
                          <div className="font-medium">{product?.name || 'Unknown Product'}</div>
                          <div className="text-sm text-gray-600">{product?.variety} - {product?.origin}</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.quantityKg.toLocaleString()} kg
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product ? formatCurrency(product.pricePerKg) : 'TBD'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatCurrency(totalValue)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="text-sm">
                          {item.specifications && (
                            <div className="space-y-1">
                              {Object.entries(item.specifications).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-gray-600">{key}:</span> {value}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-amber-100 font-semibold">
                  <td className="border border-gray-300 px-4 py-2" colSpan={3}>
                    {tRfq('totalEstimatedValue')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatCurrency(calculateTotalValue())}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Special Requirements */}
        {rfq.specialRequirements && (
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
              {tRfq('specialRequirements')}
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {rfq.specialRequirements}
              </p>
            </div>
          </section>
        )}

        {/* Payment Terms */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tRfq('paymentTerms')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tRfq('preferredTerms')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('paymentMethod')}:</span>
                  <span className="font-medium">{rfq.paymentTerms || 'Letter of Credit'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('creditPeriod')}:</span>
                  <span className="font-medium">30 days</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">{tRfq('documentation')}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Commercial Invoice</p>
                <p>• Packing List</p>
                <p>• Bill of Lading</p>
                <p>• Certificate of Origin</p>
                <p>• Quality Certificates</p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tRfq('nextSteps')}
          </h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Review and validate all product specifications</li>
              <li>2. Confirm availability and delivery timeline</li>
              <li>3. Prepare detailed commercial offer</li>
              <li>4. Schedule quality inspection if required</li>
              <li>5. Finalize contract terms and conditions</li>
            </ol>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-amber-700 mb-4 border-b border-gray-300 pb-2">
            {tCommon('contactUs')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Sales Representative</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Name: Nguyen Van Duc</p>
                <p>Email: duc.nguyen@thegreatbeans.com</p>
                <p>Phone: +84 28 1234 5678</p>
                <p>WhatsApp: +84 901 234 567</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Export Department</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Email: export@thegreatbeans.com</p>
                <p>Phone: +84 28 1234 5679</p>
                <p>Fax: +84 28 1234 5680</p>
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

export default RFQDocumentTemplate;