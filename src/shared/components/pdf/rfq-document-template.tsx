import { useTranslations } from 'next-intl';
import React from 'react';

import { CoffeeProduct } from '@/domain/entities/coffee-product.entity';
import { RFQ } from '@/domain/entities/rfq.entity';

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

  const calculateTotalValue = (): number => {
    return products.reduce((total: number, product: CoffeeProduct) => {
      const quantity = rfq.quantityRequirements.quantity;
      return total + product.pricing.basePrice * quantity;
    }, 0);
  };

  return (
    <div className="pdf-template min-h-screen bg-white p-8 font-sans text-black">
      {/* Watermark */}
      {includeWatermark && (
        <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-5">
          <div className="rotate-45 transform text-6xl font-bold text-gray-400">
            THE GREAT BEANS
          </div>
        </div>
      )}

      {/* Header */}
      {includeHeader && (
        <header className="relative z-10 mb-8 border-b-2 border-amber-600 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-amber-800">
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
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            {t('title')} #{rfq.id}
          </h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        {/* RFQ Overview */}
        <section className="mb-8">
          <h3 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-amber-700">
            {tRfq('overview')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">
                {tRfq('requestDetails')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {tRfq('submittedDate')}:
                  </span>
                  <span className="font-medium">
                    {formatDate(rfq.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('status')}:</span>
                  <span className="font-medium capitalize">{rfq.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('urgency')}:</span>
                  <span className="font-medium capitalize">
                    {rfq.urgencyReason || rfq.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {tRfq('estimatedValue')}:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(calculateTotalValue())}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">
                {tRfq('deliveryRequirements')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {tRfq('preferredDeliveryDate')}:
                  </span>
                  <span className="font-medium">
                    {rfq.deliveryRequirements.preferredDeliveryDate
                      ? formatDate(
                          new Date(
                            rfq.deliveryRequirements.preferredDeliveryDate
                          )
                        )
                      : 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {tRfq('shippingMethod')}:
                  </span>
                  <span className="font-medium">
                    {'To be determined'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('packaging')}:</span>
                  <span className="font-medium">
                    {rfq.deliveryRequirements.packaging || 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('incoterms')}:</span>
                  <span className="font-medium">
                    {rfq.deliveryRequirements.incoterms || 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('destination')}:</span>
                  <span className="font-medium">
                    {rfq.deliveryRequirements.destinationPort || 'TBD'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Information */}
        <section className="mb-8">
          <h3 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-amber-700">
            {tRfq('clientInformation')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">
                {tRfq('companyDetails')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('companyName')}:</span>
                  <span className="font-medium">
                    {rfq.companyInfo.companyName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('industry')}:</span>
                  <span className="font-medium">
                    {rfq.companyInfo.businessType || 'Coffee Trading'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('country')}:</span>
                  <span className="font-medium">
                    {rfq.companyInfo.address.country}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">
                {tRfq('contactPerson')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('name')}:</span>
                  <span className="font-medium">
                    {rfq.companyInfo.contactPerson}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('email')}:</span>
                  <span className="font-medium">{rfq.companyInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('phone')}:</span>
                  <span className="font-medium">
                    {rfq.companyInfo.phone || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Requirements */}
        <section className="mb-8">
          <h3 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-amber-700">
            {tRfq('productRequirements')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {tRfq('product')}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {tRfq('quantity')}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {tRfq('unitPrice')}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {tRfq('totalValue')}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {tRfq('specifications')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const quantity = rfq.quantityRequirements.quantity;
                  const totalValue = product
                    ? product.pricing.basePrice * quantity
                    : 0;

                  return (
                    <tr
                      key={product?.id || `product-${index}`}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        <div>
                          <div className="font-medium">
                            {product?.name?.en || 'Unknown Product'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {product?.type} - {product?.origin?.region}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {quantity.toLocaleString()}{' '}
                        {rfq.quantityRequirements.unit}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product
                          ? formatCurrency(product.pricing.basePrice)
                          : 'TBD'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatCurrency(totalValue)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="text-sm">
                          {product.specifications && (
                            <div className="space-y-1">
                              {Object.entries(product.specifications).map(
                                ([key, value]) => (
                                  <div key={key}>
                                    <span className="text-gray-600">
                                      {key}:
                                    </span>{' '}
                                    {String(value)}
                                  </div>
                                )
                              )}
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

        {/* Additional Requirements */}
        {rfq.additionalRequirements && (
          <section className="mb-8">
            <h3 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-amber-700">
              {tRfq('additionalRequirements')}
            </h3>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {rfq.additionalRequirements}
              </p>
            </div>
          </section>
        )}

        {/* Payment Terms */}
        <section className="mb-8">
          <h3 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-amber-700">
            {tRfq('paymentTerms')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">
                {tRfq('preferredTerms')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {tRfq('paymentMethod')}:
                  </span>
                  <span className="font-medium">
                    {rfq.paymentTerms.paymentMethod || 'Letter of Credit'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{tRfq('creditPeriod')}:</span>
                  <span className="font-medium">
                    {rfq.paymentTerms.creditPeriod || 30} days
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">
                {tRfq('documentation')}
              </h4>
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
          <h3 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-amber-700">
            {tRfq('nextSteps')}
          </h3>
          <div className="rounded-lg bg-green-50 p-4">
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
          <h3 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-amber-700">
            {tCommon('contactUs')}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">
                Sales Representative
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Name: Nguyen Van Duc</p>
                <p>Email: duc.nguyen@thegreatbeans.com</p>
                <p>Phone: +84 28 1234 5678</p>
                <p>WhatsApp: +84 901 234 567</p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-700">
                Export Department
              </h4>
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
        <footer className="relative z-10 mt-8 border-t-2 border-amber-600 pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <p>&copy; 2024 The Great Beans. All rights reserved.</p>
              <p>Ho Chi Minh City, Vietnam</p>
            </div>
            <div className="text-right">
              <p>www.thegreatbeans.com</p>
              <p>Connecting Vietnam&apos;s finest coffee to the world</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default RFQDocumentTemplate;
