'use client';

import {
  Calculator,
  Ship,
  Truck,
  Plane,
  Package,
  Info,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Separator } from '@/presentation/components/ui/separator';
import { getMarketConfig } from '@/shared/config/markets';
import { useMarket, useMarketShipping } from '@/shared/hooks/useMarket';
import {
  calculateShippingEstimate,
  getNearestPort,
} from '@/shared/utils/market';

interface LogisticsCostEstimatorProps {
  className?: string;
  onEstimateCalculated?: (estimate: ShippingEstimate) => void;
}

interface ShippingEstimate {
  baseShippingCost: number;
  insuranceCost: number;
  handlingCost: number;
  documentationCost: number;
  totalCost: number;
  currency: string;
  transitDays: number;
  incoterms: string;
  shippingMethod: string;
  containerType?: string;
  breakdown: {
    label: string;
    amount: number;
    description: string;
  }[];
}

interface TranslationFunction {
  (key: string): string;
}

const getIncoterms = (t: TranslationFunction) => [
  {
    value: 'EXW',
    label: t('incoterms.exw'),
    description: t('incoterms.exwDescription'),
    sellerResponsibility: 'Minimal',
  },
  {
    value: 'FCA',
    label: t('incoterms.fca'),
    description: t('incoterms.fcaDescription'),
    sellerResponsibility: 'Low',
  },
  {
    value: 'FOB',
    label: t('incoterms.fob'),
    description: t('incoterms.fobDescription'),
    sellerResponsibility: 'Medium',
  },
  {
    value: 'CFR',
    label: t('incoterms.cfr'),
    description: t('incoterms.cfrDescription'),
    sellerResponsibility: 'High',
  },
  {
    value: 'CIF',
    label: t('incoterms.cif'),
    description: t('incoterms.cifDescription'),
    sellerResponsibility: 'High',
  },
  {
    value: 'DAP',
    label: t('incoterms.dap'),
    description: t('incoterms.dapDescription'),
    sellerResponsibility: 'Very High',
  },
  {
    value: 'DDP',
    label: t('incoterms.ddp'),
    description: t('incoterms.ddpDescription'),
    sellerResponsibility: 'Maximum',
  },
];

const getShippingMethods = (t: TranslationFunction) => [
  {
    value: 'SEA_FREIGHT',
    label: t('methods.seaFreight'),
    icon: Ship,
    description: t('methods.seaDescription'),
    transitDays: { min: 15, max: 45 },
    costMultiplier: 1.0,
  },
  {
    value: 'AIR_FREIGHT',
    label: t('methods.airFreight'),
    icon: Plane,
    description: t('methods.airDescription'),
    transitDays: { min: 3, max: 7 },
    costMultiplier: 4.5,
  },
  {
    value: 'LAND_TRANSPORT',
    label: t('methods.landTransport'),
    icon: Truck,
    description: t('methods.landDescription'),
    transitDays: { min: 5, max: 15 },
    costMultiplier: 2.2,
  },
];

const getContainerTypes = (t: TranslationFunction) => [
  {
    value: 'FCL_20',
    label: t('containers.fcl20'),
    description: t('containers.fcl20Description'),
    capacity: '28 CBM',
    maxWeight: '28,000 kg',
    costMultiplier: 1.0,
  },
  {
    value: 'FCL_40',
    label: t('containers.fcl40'),
    description: t('containers.fcl40Description'),
    capacity: '58 CBM',
    maxWeight: '30,000 kg',
    costMultiplier: 1.8,
  },
  {
    value: 'FCL_40HC',
    label: t('containers.fcl40hc'),
    description: t('containers.fcl40hcDescription'),
    capacity: '68 CBM',
    maxWeight: '30,000 kg',
    costMultiplier: 1.9,
  },
  {
    value: 'LCL',
    label: t('containers.lcl'),
    description: t('containers.lclDescription'),
    capacity: t('containers.flexible'),
    maxWeight: t('containers.flexible'),
    costMultiplier: 2.5,
  },
];

export function LogisticsCostEstimator({
  className,
  onEstimateCalculated,
}: LogisticsCostEstimatorProps) {
  const t = useTranslations('logistics.estimator');
  const { config: _config, locale: _locale, formatCurrency: _formatCurrency } = useMarket();
  const { majorPorts, preferredIncoterms: _preferredIncoterms } = useMarketShipping();

  // Get translated arrays
  const SHIPPING_METHODS = getShippingMethods(t);
  const CONTAINER_TYPES = getContainerTypes(t);
  const INCOTERMS_OPTIONS = getIncoterms(t);

  // Form state
  const [formData, setFormData] = useState({
    quantity: '',
    unit: 'MT',
    originPort: '',
    destinationPort: '',
    destinationCountry: '',
    incoterms: 'FOB',
    shippingMethod: 'SEA_FREIGHT',
    containerType: '20FT',
    insuranceValue: '',
  });

  // Calculation state
  const [estimate, setEstimate] = useState<ShippingEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get available ports based on locale
  const availablePorts = useMemo(() => {
    return (
      majorPorts || [
        { name: 'Ho Chi Minh City', code: 'VNSGN', country: 'Vietnam' },
        { name: 'Da Nang', code: 'VNDAD', country: 'Vietnam' },
        { name: 'Hai Phong', code: 'VNHPH', country: 'Vietnam' },
      ]
    );
  }, [majorPorts]);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = t('errors.quantityRequired');
    }

    if (!formData.originPort) {
      newErrors.originPort = t('errors.originPortRequired');
    }

    if (!formData.destinationPort) {
      newErrors.destinationPort = t('errors.destinationPortRequired');
    }

    if (!formData.destinationCountry) {
      newErrors.destinationCountry = t('errors.destinationCountryRequired');
    }

    if (formData.insuranceValue && parseFloat(formData.insuranceValue) <= 0) {
      newErrors.insuranceValue = t('errors.insuranceValueInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate shipping estimate
  const calculateEstimate = async () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    try {
      const quantity = parseFloat(formData.quantity);
      const insuranceValue =
        parseFloat(formData.insuranceValue) || quantity * 3000; // Default $3000/MT

      // Get origin and destination port data
      const _originPortData = availablePorts.find(
        p => p.code === formData.originPort
      );
      const _destinationPortData = {
        name: formData.destinationPort || '',
        code: formData.destinationPort
          ? formData.destinationPort.toUpperCase()
          : '',
        country: formData.destinationCountry || '',
        coordinates: { lat: 0, lng: 0 }, // Would be fetched from API in real implementation
      };

      // Base shipping calculation
      const shippingMethod = SHIPPING_METHODS.find(
        m => m.value === formData.shippingMethod
      )!;
      const baseRate = 150; // Base rate per MT in USD
      const baseShippingCost =
        quantity * baseRate * shippingMethod.costMultiplier;

      // Additional costs based on Incoterms
      let insuranceCost = 0;
      let handlingCost = 0;
      let documentationCost = 0;

      switch (formData.incoterms) {
        case 'EXW':
          // Buyer handles everything
          break;
        case 'FCA':
          handlingCost = quantity * 15;
          documentationCost = 200;
          break;
        case 'FOB':
          handlingCost = quantity * 25;
          documentationCost = 300;
          break;
        case 'CFR':
          handlingCost = quantity * 25;
          documentationCost = 300;
          break;
        case 'CIF':
          handlingCost = quantity * 25;
          documentationCost = 300;
          insuranceCost = insuranceValue * 0.002; // 0.2% of cargo value
          break;
        case 'DAP':
          handlingCost = quantity * 35;
          documentationCost = 500;
          insuranceCost = insuranceValue * 0.002;
          break;
        case 'DDP':
          handlingCost = quantity * 45;
          documentationCost = 800;
          insuranceCost = insuranceValue * 0.002;
          break;
      }

      const totalCost =
        baseShippingCost + insuranceCost + handlingCost + documentationCost;

      const breakdown = [
        {
          label: 'Base Shipping Cost',
          amount: baseShippingCost,
          description: `${quantity} MT × $${baseRate} × ${shippingMethod.costMultiplier}`,
        },
        ...(handlingCost > 0
          ? [
              {
                label: 'Handling & Port Charges',
                amount: handlingCost,
                description: 'Port handling and loading charges',
              },
            ]
          : []),
        ...(insuranceCost > 0
          ? [
              {
                label: 'Marine Insurance',
                amount: insuranceCost,
                description: '0.2% of cargo value',
              },
            ]
          : []),
        ...(documentationCost > 0
          ? [
              {
                label: 'Documentation',
                amount: documentationCost,
                description: 'Export documentation and certificates',
              },
            ]
          : []),
      ];

      const newEstimate: ShippingEstimate = {
        baseShippingCost,
        insuranceCost,
        handlingCost,
        documentationCost,
        totalCost,
        currency: 'USD',
        transitDays: Math.round(
          (shippingMethod.transitDays.min + shippingMethod.transitDays.max) / 2
        ),
        incoterms: formData.incoterms,
        shippingMethod: formData.shippingMethod,
        containerType: formData.containerType,
        breakdown,
      };

      setEstimate(newEstimate);
      onEstimateCalculated?.(newEstimate);
    } catch (error) {
      // Shipping calculation error handling removed for production
    } finally {
      setIsCalculating(false);
    }
  };

  const _selectedIncoterm = INCOTERMS_OPTIONS.find(
    opt => opt.value === formData.incoterms
  );
  const _selectedShippingMethod = SHIPPING_METHODS.find(
    m => m.value === formData.shippingMethod
  );

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipment Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t('quantity')} *</Label>
              <div className="flex gap-2">
                <Input
                  id="quantity"
                  type="number"
                  placeholder={t('quantity')}
                  value={formData.quantity}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, quantity: e.target.value }))
                  }
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                <Select
                  value={formData.unit}
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, unit: value }))
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MT">MT</SelectItem>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="LB">LB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceValue">{t('cargoValue')}</Label>
              <Input
                id="insuranceValue"
                type="number"
                placeholder={t('cargoValue')}
                value={formData.insuranceValue}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    insuranceValue: e.target.value,
                  }))
                }
                className={errors.insuranceValue ? 'border-red-500' : ''}
              />
              {errors.insuranceValue && (
                <p className="text-sm text-red-500">{errors.insuranceValue}</p>
              )}
            </div>
          </div>

          {/* Origin & Destination */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="originPort">{t('originPort')} *</Label>
              <Select
                value={formData.originPort}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, originPort: value }))
                }
              >
                <SelectTrigger
                  className={errors.originPort ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder={t('originPort')} />
                </SelectTrigger>
                <SelectContent>
                  {availablePorts.map(port => (
                    <SelectItem key={port.code} value={port.code}>
                      {port.name} ({port.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.originPort && (
                <p className="text-sm text-red-500">{errors.originPort}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationPort">{t('destinationPort')} *</Label>
              <Input
                id="destinationPort"
                placeholder={t('destinationPort')}
                value={formData.destinationPort}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    destinationPort: e.target.value,
                  }))
                }
                className={errors.destinationPort ? 'border-red-500' : ''}
              />
              {errors.destinationPort && (
                <p className="text-sm text-red-500">{errors.destinationPort}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationCountry">
              {t('destinationCountry')} *
            </Label>
            <Input
              id="destinationCountry"
              placeholder={t('destinationCountry')}
              value={formData.destinationCountry}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  destinationCountry: e.target.value,
                }))
              }
              className={errors.destinationCountry ? 'border-red-500' : ''}
            />
            {errors.destinationCountry && (
              <p className="text-sm text-red-500">
                {errors.destinationCountry}
              </p>
            )}
          </div>

          {/* Shipping Method */}
          <div className="space-y-2">
            <Label>{t('shippingMethod')}</Label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {SHIPPING_METHODS.map(method => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.value}
                    className={`cursor-pointer transition-colors ${
                      formData.shippingMethod === method.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        shippingMethod: method.value,
                      }))
                    }
                  >
                    <CardContent className="p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {method.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {method.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {method.transitDays.min}-{method.transitDays.max} days
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Incoterms */}
          <div className="space-y-2">
            <Label>{t('incoterms')}</Label>
            <Select
              value={formData.incoterms}
              onValueChange={value =>
                setFormData(prev => ({ ...prev, incoterms: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('incoterms')} />
              </SelectTrigger>
              <SelectContent>
                {INCOTERMS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex w-full items-center justify-between">
                      <span>{option.label}</span>
                      <Badge variant="outline" className="ml-2">
                        {option.sellerResponsibility}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedIncoterm && (
              <p className="text-sm text-muted-foreground">
                {selectedIncoterm.description}
              </p>
            )}
          </div>

          {/* Container Type (for sea freight) */}
          {formData.shippingMethod === 'SEA_FREIGHT' && (
            <div className="space-y-2">
              <Label>{t('containerType')}</Label>
              <Select
                value={formData.containerType}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, containerType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTAINER_TYPES.map(container => (
                    <SelectItem key={container.value} value={container.value}>
                      <div className="flex w-full items-center justify-between">
                        <span>{container.label}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {container.capacity}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Calculate Button */}
          <Button
            onClick={calculateEstimate}
            disabled={isCalculating}
            className="w-full bg-amber-600 text-white hover:bg-amber-700"
            size="lg"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('calculating')}
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                {t('calculateButton')}
              </>
            )}
          </Button>

          {/* Results */}
          {estimate && (
            <div className="space-y-4">
              <Separator />
              <div>
                <h3 className="mb-3 font-semibold">{t('results.title')}</h3>

                {/* Summary */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {t('results.totalCost')}
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ${estimate.totalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="block">
                          {t('results.transitTime')}
                        </span>
                        <span className="font-medium">
                          {estimate.transitDays} days
                        </span>
                      </div>
                      <div>
                        <span className="block">{t('results.incoterms')}</span>
                        <span className="font-medium">
                          {estimate.incoterms}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-medium">{t('results.costBreakdown')}</h4>
                  {estimate.breakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <div>
                        <span className="font-medium">{item.label}</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="ml-1 inline h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-medium">
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>{t('disclaimer.title')}:</strong>{' '}
                    {t('disclaimer.text')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

export default LogisticsCostEstimator;
