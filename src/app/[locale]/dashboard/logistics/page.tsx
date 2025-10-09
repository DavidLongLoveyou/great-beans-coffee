'use client';

import { useState } from 'react';
import {
  Calculator,
  Calendar,
  DollarSign,
  FileText,
  Globe,
  Info,
  MapPin,
  Package,
  Plane,
  RefreshCw,
  Ship,
  Truck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { Typography } from '@/presentation/components/ui/typography';

// Mock data for shipping calculations
const mockShippingRates = {
  sea: { baseRate: 1200, perContainer: 2800, transitDays: 25 },
  air: { baseRate: 3500, perKg: 4.5, transitDays: 5 },
  land: { baseRate: 800, perKm: 1.2, transitDays: 12 },
};

const mockPorts = [
  { id: 'hcm', name: 'Ho Chi Minh City', country: 'Vietnam', type: 'sea' },
  { id: 'hai', name: 'Hai Phong', country: 'Vietnam', type: 'sea' },
  { id: 'sgn', name: 'Tan Son Nhat Airport', country: 'Vietnam', type: 'air' },
  { id: 'lax', name: 'Los Angeles', country: 'USA', type: 'sea' },
  { id: 'nyc', name: 'New York', country: 'USA', type: 'sea' },
  { id: 'ham', name: 'Hamburg', country: 'Germany', type: 'sea' },
  { id: 'rot', name: 'Rotterdam', country: 'Netherlands', type: 'sea' },
];

const mockIncoterms = [
  {
    code: 'EXW',
    name: 'Ex Works',
    description: 'Seller makes goods available at their premises',
  },
  {
    code: 'FCA',
    name: 'Free Carrier',
    description: 'Seller delivers goods to carrier nominated by buyer',
  },
  {
    code: 'CPT',
    name: 'Carriage Paid To',
    description: 'Seller pays for carriage to named destination',
  },
  {
    code: 'CIP',
    name: 'Carriage and Insurance Paid',
    description: 'Seller pays for carriage and insurance',
  },
  {
    code: 'FOB',
    name: 'Free on Board',
    description: 'Seller delivers goods on board vessel',
  },
  {
    code: 'CFR',
    name: 'Cost and Freight',
    description: 'Seller pays costs and freight to destination',
  },
  {
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    description: 'Seller pays costs, insurance and freight',
  },
];

const mockTrackingData = [
  {
    id: 'TGB001',
    status: 'In Transit',
    location: 'Ho Chi Minh Port',
    eta: '2024-02-15',
    progress: 65,
  },
  {
    id: 'TGB002',
    status: 'Customs Clearance',
    location: 'Los Angeles Port',
    eta: '2024-02-10',
    progress: 85,
  },
  {
    id: 'TGB003',
    status: 'Delivered',
    location: 'Hamburg Port',
    eta: '2024-01-28',
    progress: 100,
  },
  {
    id: 'TGB004',
    status: 'Loading',
    location: 'Hai Phong Port',
    eta: '2024-02-20',
    progress: 25,
  },
];

export default function LogisticsPage() {
  const t = useTranslations('logistics');

  // Calculator state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [weight, setWeight] = useState('');
  const [containers, setContainers] = useState('');
  const [incoterm, setIncoterm] = useState('');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate shipping cost
  const calculateShipping = async () => {
    if (!origin || !destination || !shippingMethod) return;

    setIsCalculating(true);

    // Simulate API call
    setTimeout(() => {
      const rates =
        mockShippingRates[shippingMethod as keyof typeof mockShippingRates];
      let cost = rates.baseRate;

      if (shippingMethod === 'sea' && containers) {
        const seaRates = rates as typeof mockShippingRates.sea;
        cost += parseInt(containers) * seaRates.perContainer;
      } else if (shippingMethod === 'air' && weight) {
        const airRates = rates as typeof mockShippingRates.air;
        cost += parseInt(weight) * airRates.perKg;
      }

      setCalculationResult({
        cost,
        transitDays: rates.transitDays,
        method: shippingMethod,
        origin,
        destination,
        estimatedDelivery: new Date(
          Date.now() + rates.transitDays * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      });
      setIsCalculating(false);
    }, 1500);
  };

  const filteredOriginPorts = mockPorts.filter(
    port =>
      port.country === 'Vietnam' &&
      (!shippingMethod ||
        port.type === shippingMethod ||
        shippingMethod === 'land')
  );

  const filteredDestinationPorts = mockPorts.filter(
    port =>
      port.country !== 'Vietnam' &&
      (!shippingMethod ||
        port.type === shippingMethod ||
        shippingMethod === 'land')
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={t('title')}
          description={t('subtitle')}
          icon={Calculator}
        />

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {t('tabs.calculator')}
            </TabsTrigger>
            <TabsTrigger value="incoterms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('tabs.incoterms')}
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('tabs.tracking')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Calculator Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {t('calculator.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('calculator.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Shipping Method */}
                  <div className="space-y-2">
                    <Label>{t('calculator.shippingMethod')}</Label>
                    <Select
                      value={shippingMethod}
                      onValueChange={setShippingMethod}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('calculator.selectMethod')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sea">
                          <div className="flex items-center gap-2">
                            <Ship className="h-4 w-4" />
                            {t('calculator.methods.sea')}
                          </div>
                        </SelectItem>
                        <SelectItem value="air">
                          <div className="flex items-center gap-2">
                            <Plane className="h-4 w-4" />
                            {t('calculator.methods.air')}
                          </div>
                        </SelectItem>
                        <SelectItem value="land">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            {t('calculator.methods.land')}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Origin */}
                  <div className="space-y-2">
                    <Label>{t('calculator.origin')}</Label>
                    <Select value={origin} onValueChange={setOrigin}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('calculator.selectOrigin')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredOriginPorts.map(port => (
                          <SelectItem key={port.id} value={port.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {port.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Destination */}
                  <div className="space-y-2">
                    <Label>{t('calculator.destination')}</Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('calculator.selectDestination')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDestinationPorts.map(port => (
                          <SelectItem key={port.id} value={port.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {port.name}, {port.country}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cargo Details */}
                  {shippingMethod === 'sea' && (
                    <div className="space-y-2">
                      <Label>{t('calculator.containers')}</Label>
                      <Input
                        type="number"
                        placeholder={t('calculator.containersPlaceholder')}
                        value={containers}
                        onChange={e => setContainers(e.target.value)}
                      />
                    </div>
                  )}

                  {shippingMethod === 'air' && (
                    <div className="space-y-2">
                      <Label>{t('calculator.weight')}</Label>
                      <Input
                        type="number"
                        placeholder={t('calculator.weightPlaceholder')}
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Incoterm */}
                  <div className="space-y-2">
                    <Label>{t('calculator.incoterm')}</Label>
                    <Select value={incoterm} onValueChange={setIncoterm}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('calculator.selectIncoterm')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {mockIncoterms.map(term => (
                          <SelectItem key={term.code} value={term.code}>
                            <div>
                              <div className="font-medium">
                                {term.code} - {term.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {term.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={calculateShipping}
                    className="w-full"
                    disabled={
                      isCalculating ||
                      !origin ||
                      !destination ||
                      !shippingMethod
                    }
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {t('calculator.calculating')}
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-4 w-4" />
                        {t('calculator.calculate')}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              {calculationResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      {t('results.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
                        <span className="font-medium">
                          {t('results.estimatedCost')}
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ${calculationResult.cost.toLocaleString()}
                        </span>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {t('results.transitTime')}
                          </span>
                          <span className="font-medium">
                            {calculationResult.transitDays} {t('results.days')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {t('results.estimatedDelivery')}
                          </span>
                          <span className="font-medium">
                            {calculationResult.estimatedDelivery}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {t('results.shippingMethod')}
                          </span>
                          <Badge variant="secondary">
                            {t(
                              `calculator.methods.${calculationResult.method}`
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        {t('results.disclaimer')}
                      </AlertDescription>
                    </Alert>

                    <Button className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      {t('results.requestQuote')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="incoterms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t('incoterms.title')}
                </CardTitle>
                <CardDescription>{t('incoterms.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockIncoterms.map(term => (
                    <Card key={term.code} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{term.code}</Badge>
                            <Typography variant="h4">{term.name}</Typography>
                          </div>
                          <Typography variant="muted" className="text-sm">
                            {term.description}
                          </Typography>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t('tracking.title')}
                </CardTitle>
                <CardDescription>{t('tracking.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTrackingData.map(shipment => (
                    <Card key={shipment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Typography variant="h4">#{shipment.id}</Typography>
                            <Badge
                              variant={
                                shipment.status === 'Delivered'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {shipment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {shipment.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              ETA: {shipment.eta}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {shipment.progress}%
                          </div>
                          <div className="mt-1 h-2 w-24 rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${shipment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
