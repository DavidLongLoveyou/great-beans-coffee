'use client';

import {
  Calculator,
  TrendingDown,
  Package,
  DollarSign,
  Truck,
  Calendar,
  AlertCircle,
  CheckCircle,
  Download,
  Share2,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { type CatalogProduct } from '@/data/product-catalog';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { SectionHeading } from '@/shared/components/design-system/Typography/Heading';

interface BulkPricingCalculatorProps {
  product: CatalogProduct;
  className?: string;
}

interface PricingCalculation {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountPercent: number;
  discountAmount: number;
  estimatedShipping: number;
  totalWithShipping: number;
  leadTime: number;
  paymentTerms: string;
}

export function BulkPricingCalculator({
  product,
  className,
}: BulkPricingCalculatorProps) {
  const [quantity, setQuantity] = useState<number>(
    product.pricing.minimumOrder
  );
  const [selectedUnit, setSelectedUnit] = useState<string>('MT');
  const [selectedIncoterm, setSelectedIncoterm] = useState<string>('FOB');
  const [calculation, setCalculation] = useState<PricingCalculation | null>(
    null
  );
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Convert quantity to base unit (MT) for calculations
  const getQuantityInMT = (qty: number, unit: string): number => {
    switch (unit) {
      case 'MT':
        return qty;
      case 'kg':
        return qty / 1000;
      case 'lbs':
        return qty / 2204.62;
      case 'containers':
        return qty * 18; // Assuming 18 MT per container
      default:
        return qty;
    }
  };

  // Calculate pricing based on quantity and discounts
  const calculatePricing = (qty: number, unit: string): PricingCalculation => {
    const quantityInMT = getQuantityInMT(qty, unit);

    // Find applicable discount tier
    let discountPercent = 0;
    if (product.pricing.discountTiers) {
      const applicableTier = product.pricing.discountTiers
        .filter(tier => quantityInMT >= tier.minQuantity)
        .sort((a, b) => b.discountPercent - a.discountPercent)[0];

      if (applicableTier) {
        discountPercent = applicableTier.discountPercent;
      }
    }

    const unitPrice = product.pricing.basePrice * (1 - discountPercent / 100);
    const totalPrice = unitPrice * quantityInMT;
    const discountAmount =
      (product.pricing.basePrice - unitPrice) * quantityInMT;

    // Estimate shipping costs based on Incoterms and quantity
    let estimatedShipping = 0;
    if (selectedIncoterm === 'CIF' || selectedIncoterm === 'CFR') {
      estimatedShipping = quantityInMT * 150; // $150 per MT for shipping
    } else if (selectedIncoterm === 'DDP') {
      estimatedShipping = quantityInMT * 250; // $250 per MT for full delivery
    }

    // Adjust lead time based on quantity
    let leadTime = product.availability.leadTime;
    if (quantityInMT > 100) {
      leadTime += 7; // Additional week for large orders
    }

    return {
      quantity: quantityInMT,
      unitPrice,
      totalPrice,
      discountPercent,
      discountAmount,
      estimatedShipping,
      totalWithShipping: totalPrice + estimatedShipping,
      leadTime,
      paymentTerms: product.pricing.paymentTerms,
    };
  };

  useEffect(() => {
    if (quantity > 0) {
      const calc = calculatePricing(quantity, selectedUnit);
      setCalculation(calc);
    }
  }, [quantity, selectedUnit, selectedIncoterm, product]);

  const handleQuantityChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setQuantity(numValue);
    }
  };

  const isValidOrder =
    calculation && calculation.quantity >= product.pricing.minimumOrder;

  const exportQuote = () => {
    if (!calculation) return;

    const _quoteData = {
      product: product.name,
      quantity: `${quantity} ${selectedUnit}`,
      unitPrice: `$${calculation.unitPrice.toFixed(2)}`,
      totalPrice: `$${calculation.totalPrice.toLocaleString()}`,
      discount: `${calculation.discountPercent}%`,
      incoterms: selectedIncoterm,
      leadTime: `${calculation.leadTime} days`,
      validUntil: product.pricing.priceValidUntil,
    };

    // In a real app, this would generate a PDF or send to CRM
    // Quote export tracking removed for production
    alert(
      'Quote exported! In production, this would generate a PDF or send to your CRM.'
    );
  };

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardContent className="p-6">
        <SectionHeading size="lg" className="mb-6 text-coffee-800">
          <div className="flex items-center">
            <Calculator className="mr-3 h-6 w-6" />
            Bulk Pricing Calculator
          </div>
        </SectionHeading>

        {/* Input Controls */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label
              htmlFor="quantity"
              className="text-sm font-medium text-coffee-700"
            >
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={e => handleQuantityChange(e.target.value)}
              min={0}
              step={selectedUnit === 'kg' ? 100 : 1}
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="unit"
              className="text-sm font-medium text-coffee-700"
            >
              Unit
            </Label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MT">Metric Tons (MT)</SelectItem>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                <SelectItem value="containers">Containers (20ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="incoterms"
              className="text-sm font-medium text-coffee-700"
            >
              Incoterms
            </Label>
            <Select
              value={selectedIncoterm}
              onValueChange={setSelectedIncoterm}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                <SelectItem value="CFR">CFR (Cost and Freight)</SelectItem>
                <SelectItem value="CIF">
                  CIF (Cost, Insurance, Freight)
                </SelectItem>
                <SelectItem value="DDP">DDP (Delivered Duty Paid)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Validation Alert */}
        {calculation && !isValidOrder && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <AlertCircle className="mr-3 h-5 w-5 text-red-600" />
              <div>
                <h4 className="text-sm font-semibold text-red-800">
                  Minimum Order Required
                </h4>
                <p className="text-xs text-red-700">
                  Minimum order quantity is {product.pricing.minimumOrder} MT.
                  Current quantity: {calculation.quantity.toFixed(2)} MT
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Results */}
        {calculation && isValidOrder && (
          <div className="space-y-4">
            {/* Main Pricing Display */}
            <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">
                      Unit Price
                    </span>
                    {calculation.discountPercent > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        <TrendingDown className="mr-1 h-3 w-3" />
                        {calculation.discountPercent}% OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-green-800">
                    ${calculation.unitPrice.toFixed(2)}/MT
                  </p>
                  {calculation.discountPercent > 0 && (
                    <p className="text-sm text-green-600 line-through">
                      ${product.pricing.basePrice.toFixed(2)}/MT
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-sm font-medium text-green-700">
                    Total Price
                  </span>
                  <p className="text-2xl font-bold text-green-800">
                    ${calculation.totalPrice.toLocaleString()}
                  </p>
                  {calculation.discountAmount > 0 && (
                    <p className="text-sm text-green-600">
                      You save: ${calculation.discountAmount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">
                    QUANTITY
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-800">
                  {calculation.quantity.toFixed(2)} MT
                </p>
                <p className="text-xs text-blue-600">
                  {quantity} {selectedUnit}
                </p>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">
                    LEAD TIME
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-800">
                  {calculation.leadTime} days
                </p>
                <p className="text-xs text-purple-600">
                  {calculation.paymentTerms}
                </p>
              </div>

              {calculation.estimatedShipping > 0 && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Truck className="h-5 w-5 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">
                      SHIPPING
                    </span>
                  </div>
                  <p className="text-lg font-bold text-orange-800">
                    ${calculation.estimatedShipping.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-600">
                    {selectedIncoterm} terms
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-gold-200 bg-gold-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <DollarSign className="h-5 w-5 text-gold-600" />
                  <span className="text-xs font-medium text-gold-700">
                    TOTAL
                  </span>
                </div>
                <p className="text-lg font-bold text-gold-800">
                  ${calculation.totalWithShipping.toLocaleString()}
                </p>
                <p className="text-xs text-gold-600">Including all costs</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={exportQuote}
                className="flex-1 bg-coffee-600 hover:bg-coffee-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Quote
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex-1"
              >
                <Calculator className="mr-2 h-4 w-4" />
                {showBreakdown ? 'Hide' : 'Show'} Breakdown
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  navigator.share?.({
                    title: `${product.name} - Bulk Quote`,
                    text: `Quote for ${quantity} ${selectedUnit} at $${calculation.unitPrice.toFixed(2)}/MT`,
                    url: window.location.href,
                  });
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Detailed Breakdown */}
            {showBreakdown && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="mb-3 text-sm font-semibold text-coffee-800">
                    Price Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Base Price ({calculation.quantity.toFixed(2)} MT × $
                        {product.pricing.basePrice})
                      </span>
                      <span className="text-gray-800">
                        $
                        {(
                          calculation.quantity * product.pricing.basePrice
                        ).toLocaleString()}
                      </span>
                    </div>
                    {calculation.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Volume Discount ({calculation.discountPercent}%)
                        </span>
                        <span>
                          -${calculation.discountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span className="text-gray-800">Product Total</span>
                      <span className="text-gray-800">
                        ${calculation.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    {calculation.estimatedShipping > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Estimated Shipping ({selectedIncoterm})
                          </span>
                          <span className="text-gray-800">
                            ${calculation.estimatedShipping.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-bold text-coffee-800">
                          <span>Grand Total</span>
                          <span>
                            ${calculation.totalWithShipping.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start">
                <CheckCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800">
                    Quote Valid Until
                  </h4>
                  <p className="text-xs text-blue-700">
                    This quote is valid until{' '}
                    {new Date(
                      product.pricing.priceValidUntil
                    ).toLocaleDateString()}
                    . Prices are subject to market conditions and availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
