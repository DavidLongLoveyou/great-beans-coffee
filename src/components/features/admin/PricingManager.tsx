'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  Calculator,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  Globe,
  Clock,
  Search,
  Download,
  Plus,
  Edit,
  Copy,
  Trash2,
  Eye,
  RefreshCw,
  Star,
  Percent,
  Activity,
  Layers,
} from 'lucide-react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { Progress } from '@/presentation/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Switch } from '@/presentation/components/ui/switch';
import { Slider } from '@/presentation/components/ui/slider';

// Types for pricing management
interface PricingTier {
  id: string;
  name: string;
  minQuantity: number;
  maxQuantity?: number;
  discountPercentage: number;
  pricePerUnit: number;
}

interface PricingRule {
  id: string;
  name: string;
  type:
    | 'volume'
    | 'customer_tier'
    | 'seasonal'
    | 'market_based'
    | 'promotional';
  conditions: Record<string, any>;
  action: 'discount' | 'markup' | 'fixed_price';
  value: number;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
  priority: number;
}

interface ProductPricing {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  baseCost: number;
  basePrice: number;
  currentPrice: number;
  margin: number;
  marginPercentage: number;
  currency: string;
  lastUpdated: string;
  pricingTiers: PricingTier[];
  appliedRules: string[];
  competitorPrices: CompetitorPrice[];
  priceHistory: PriceHistoryEntry[];
  status: 'active' | 'inactive' | 'pending_approval';
  marketPosition: 'premium' | 'competitive' | 'value';
}

interface CompetitorPrice {
  id: string;
  competitor: string;
  price: number;
  currency: string;
  lastChecked: string;
  source: string;
}

interface PriceHistoryEntry {
  id: string;
  price: number;
  reason: string;
  changedBy: string;
  timestamp: string;
  appliedRules?: string[];
}

interface MarketAnalysis {
  productId: string;
  averageMarketPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  ourPosition: number; // percentile
  recommendation: 'increase' | 'decrease' | 'maintain';
  confidence: number;
  factors: string[];
}

interface PricingManagerProps {
  className?: string;
}

// Mock data for demonstration
const mockPricingData: ProductPricing[] = [
  {
    id: '1',
    productId: 'arabica-001',
    productName: 'Premium Ethiopian Arabica',
    sku: 'ETH-ARB-001',
    category: 'Arabica',
    baseCost: 6.5,
    basePrice: 12.0,
    currentPrice: 11.5,
    margin: 5.0,
    marginPercentage: 43.5,
    currency: 'USD',
    lastUpdated: '2024-01-20T10:30:00Z',
    pricingTiers: [
      {
        id: '1',
        name: 'Retail',
        minQuantity: 1,
        maxQuantity: 99,
        discountPercentage: 0,
        pricePerUnit: 11.5,
      },
      {
        id: '2',
        name: 'Wholesale',
        minQuantity: 100,
        maxQuantity: 499,
        discountPercentage: 8,
        pricePerUnit: 10.58,
      },
      {
        id: '3',
        name: 'Bulk',
        minQuantity: 500,
        discountPercentage: 15,
        pricePerUnit: 9.78,
      },
    ],
    appliedRules: ['seasonal-discount', 'volume-tier'],
    competitorPrices: [
      {
        id: '1',
        competitor: 'Coffee Corp A',
        price: 12.2,
        currency: 'USD',
        lastChecked: '2024-01-20',
        source: 'API',
      },
      {
        id: '2',
        competitor: 'Bean Traders B',
        price: 11.8,
        currency: 'USD',
        lastChecked: '2024-01-20',
        source: 'Manual',
      },
    ],
    priceHistory: [
      {
        id: '1',
        price: 12.0,
        reason: 'Base price set',
        changedBy: 'System',
        timestamp: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        price: 11.5,
        reason: 'Seasonal discount applied',
        changedBy: 'Auto Rule',
        timestamp: '2024-01-15T00:00:00Z',
        appliedRules: ['seasonal-discount'],
      },
    ],
    status: 'active',
    marketPosition: 'competitive',
  },
  {
    id: '2',
    productId: 'robusta-001',
    productName: 'Vietnamese Robusta',
    sku: 'VN-ROB-001',
    category: 'Robusta',
    baseCost: 4.2,
    basePrice: 8.5,
    currentPrice: 8.5,
    margin: 4.3,
    marginPercentage: 50.6,
    currency: 'USD',
    lastUpdated: '2024-01-18T14:20:00Z',
    pricingTiers: [
      {
        id: '1',
        name: 'Retail',
        minQuantity: 1,
        maxQuantity: 99,
        discountPercentage: 0,
        pricePerUnit: 8.5,
      },
      {
        id: '2',
        name: 'Wholesale',
        minQuantity: 100,
        maxQuantity: 499,
        discountPercentage: 10,
        pricePerUnit: 7.65,
      },
      {
        id: '3',
        name: 'Bulk',
        minQuantity: 500,
        discountPercentage: 18,
        pricePerUnit: 6.97,
      },
    ],
    appliedRules: ['volume-tier'],
    competitorPrices: [
      {
        id: '1',
        competitor: 'Vietnam Direct',
        price: 8.2,
        currency: 'USD',
        lastChecked: '2024-01-19',
        source: 'API',
      },
      {
        id: '2',
        competitor: 'Asia Coffee Co',
        price: 8.8,
        currency: 'USD',
        lastChecked: '2024-01-19',
        source: 'Manual',
      },
    ],
    priceHistory: [
      {
        id: '1',
        price: 8.5,
        reason: 'Initial pricing',
        changedBy: 'Admin',
        timestamp: '2024-01-01T00:00:00Z',
      },
    ],
    status: 'active',
    marketPosition: 'competitive',
  },
  {
    id: '3',
    productId: 'specialty-001',
    productName: 'Jamaica Blue Mountain',
    sku: 'JAM-BM-001',
    category: 'Specialty',
    baseCost: 35.0,
    basePrice: 65.0,
    currentPrice: 68.0,
    margin: 33.0,
    marginPercentage: 51.5,
    currency: 'USD',
    lastUpdated: '2024-01-19T09:15:00Z',
    pricingTiers: [
      {
        id: '1',
        name: 'Retail',
        minQuantity: 1,
        maxQuantity: 49,
        discountPercentage: 0,
        pricePerUnit: 68.0,
      },
      {
        id: '2',
        name: 'Premium',
        minQuantity: 50,
        maxQuantity: 199,
        discountPercentage: 5,
        pricePerUnit: 64.6,
      },
      {
        id: '3',
        name: 'Exclusive',
        minQuantity: 200,
        discountPercentage: 8,
        pricePerUnit: 62.56,
      },
    ],
    appliedRules: ['premium-markup'],
    competitorPrices: [
      {
        id: '1',
        competitor: 'Specialty Beans Inc',
        price: 72.0,
        currency: 'USD',
        lastChecked: '2024-01-19',
        source: 'Manual',
      },
      {
        id: '2',
        competitor: 'Premium Coffee Co',
        price: 66.5,
        currency: 'USD',
        lastChecked: '2024-01-18',
        source: 'API',
      },
    ],
    priceHistory: [
      {
        id: '1',
        price: 65.0,
        reason: 'Base price set',
        changedBy: 'Admin',
        timestamp: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        price: 68.0,
        reason: 'Premium markup applied',
        changedBy: 'Auto Rule',
        timestamp: '2024-01-10T00:00:00Z',
        appliedRules: ['premium-markup'],
      },
    ],
    status: 'active',
    marketPosition: 'premium',
  },
];

const mockPricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Seasonal Discount',
    type: 'seasonal',
    conditions: { season: 'winter', products: ['arabica'] },
    action: 'discount',
    value: 4.2,
    isActive: true,
    validFrom: '2024-01-01',
    validTo: '2024-03-31',
    priority: 1,
  },
  {
    id: '2',
    name: 'Volume Tier Pricing',
    type: 'volume',
    conditions: { minQuantity: 100 },
    action: 'discount',
    value: 8,
    isActive: true,
    validFrom: '2024-01-01',
    priority: 2,
  },
  {
    id: '3',
    name: 'Premium Markup',
    type: 'customer_tier',
    conditions: { category: 'specialty' },
    action: 'markup',
    value: 4.6,
    isActive: true,
    validFrom: '2024-01-01',
    priority: 3,
  },
];

const mockMarketAnalysis: MarketAnalysis[] = [
  {
    productId: 'arabica-001',
    averageMarketPrice: 11.85,
    priceRange: { min: 10.5, max: 13.2 },
    ourPosition: 45,
    recommendation: 'maintain',
    confidence: 87,
    factors: ['Competitive positioning', 'Quality premium', 'Market demand'],
  },
  {
    productId: 'robusta-001',
    averageMarketPrice: 8.35,
    priceRange: { min: 7.8, max: 9.1 },
    ourPosition: 55,
    recommendation: 'increase',
    confidence: 72,
    factors: ['Below market average', 'Strong demand', 'Supply constraints'],
  },
  {
    productId: 'specialty-001',
    averageMarketPrice: 69.25,
    priceRange: { min: 62.0, max: 78.0 },
    ourPosition: 35,
    recommendation: 'maintain',
    confidence: 91,
    factors: ['Premium positioning', 'Limited supply', 'Brand value'],
  },
];

export function PricingManager({ className }: PricingManagerProps) {
  const [pricingData, _setPricingData] =
    useState<ProductPricing[]>(mockPricingData);
  const [pricingRules, _setPricingRules] =
    useState<PricingRule[]>(mockPricingRules);
  const [marketAnalysis, _setMarketAnalysis] =
    useState<MarketAnalysis[]>(mockMarketAnalysis);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductPricing | null>(
    null
  );
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);

  // Filter pricing data
  const filteredPricing = pricingData.filter(item => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;
    const matchesPosition =
      positionFilter === 'all' || item.marketPosition === positionFilter;

    return matchesSearch && matchesCategory && matchesPosition;
  });

  // Calculate summary statistics
  const totalRevenue = pricingData.reduce(
    (sum, item) => sum + item.currentPrice * 1000,
    0
  ); // Assuming 1000 units
  const averageMargin =
    pricingData.reduce((sum, item) => sum + item.marginPercentage, 0) /
    pricingData.length;
  const activeRules = pricingRules.filter(rule => rule.isActive).length;
  const pendingApprovals = pricingData.filter(
    item => item.status === 'pending_approval'
  ).length;

  const getMarketPositionBadge = (position: string) => {
    const positionConfig = {
      premium: { label: 'Premium', variant: 'default' as const, icon: Star },
      competitive: {
        label: 'Competitive',
        variant: 'secondary' as const,
        icon: Target,
      },
      value: { label: 'Value', variant: 'outline' as const, icon: DollarSign },
    };

    const config = positionConfig[position as keyof typeof positionConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRecommendationBadge = (recommendation: string) => {
    const recommendationConfig = {
      increase: {
        label: 'Increase',
        variant: 'default' as const,
        icon: TrendingUp,
        color: 'text-green-600',
      },
      decrease: {
        label: 'Decrease',
        variant: 'destructive' as const,
        icon: TrendingDown,
        color: 'text-red-600',
      },
      maintain: {
        label: 'Maintain',
        variant: 'secondary' as const,
        icon: Target,
        color: 'text-blue-600',
      },
    };

    const config =
      recommendationConfig[recommendation as keyof typeof recommendationConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">
            Pricing Management
          </h1>
          <p className="text-coffee-600">
            Manage product pricing, rules, and market analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Prices
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Market Data
          </Button>
          <Button size="sm" onClick={() => setIsRuleDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-coffee-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-coffee-800">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gold-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-coffee-600">
                  Average Margin
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {averageMargin.toFixed(1)}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-coffee-600">
                  Active Rules
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeRules}
                </p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-coffee-600">
                  Pending Approvals
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingApprovals}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pricing">Product Pricing</TabsTrigger>
          <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="tiers">Pricing Tiers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Product Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-coffee-400" />
                    <Input
                      placeholder="Search products or SKU..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Arabica">Arabica</SelectItem>
                    <SelectItem value="Robusta">Robusta</SelectItem>
                    <SelectItem value="Specialty">Specialty</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={positionFilter}
                  onValueChange={setPositionFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Market position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="competitive">Competitive</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Pricing</CardTitle>
              <CardDescription>
                Manage pricing for all coffee products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPricing.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-coffee-600">
                            {item.category}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.sku}
                      </TableCell>
                      <TableCell>{formatCurrency(item.baseCost)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatCurrency(item.currentPrice)}
                          </p>
                          {item.appliedRules.length > 0 && (
                            <p className="text-xs text-blue-600">
                              {item.appliedRules.length} rule(s) applied
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-green-600">
                            {item.marginPercentage.toFixed(1)}%
                          </p>
                          <p className="text-sm text-coffee-600">
                            {formatCurrency(item.margin)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getMarketPositionBadge(item.marketPosition)}
                      </TableCell>
                      <TableCell>
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProduct(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(item);
                              setIsPriceDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Rules</CardTitle>
              <CardDescription>
                Automated pricing rules and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingRules.map(rule => (
                  <div
                    key={rule.id}
                    className={`rounded-lg border p-4 ${
                      rule.isActive
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            rule.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <div>
                          <h3 className="font-medium">{rule.name}</h3>
                          <p className="text-sm text-coffee-600">
                            {rule.type.replace('_', ' ').toUpperCase()} •
                            {rule.action.toUpperCase()} {rule.value}%
                          </p>
                          <p className="text-xs text-coffee-500">
                            Priority: {rule.priority} • Valid:{' '}
                            {new Date(rule.validFrom).toLocaleDateString()}
                            {rule.validTo &&
                              ` - ${new Date(rule.validTo).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={rule.isActive ? 'default' : 'secondary'}
                        >
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Analysis Tab */}
        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {marketAnalysis.map(analysis => {
              const product = pricingData.find(
                p => p.productId === analysis.productId
              );
              if (!product) return null;

              return (
                <Card key={analysis.productId}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {product.productName}
                    </CardTitle>
                    <CardDescription>
                      Market positioning and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Our Price</Label>
                        <p className="text-lg font-semibold text-coffee-800">
                          {formatCurrency(product.currentPrice)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Market Average
                        </Label>
                        <p className="text-lg font-semibold text-coffee-800">
                          {formatCurrency(analysis.averageMarketPrice)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Price Range
                        </Label>
                        <p className="text-sm text-coffee-600">
                          {formatCurrency(analysis.priceRange.min)} -{' '}
                          {formatCurrency(analysis.priceRange.max)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Market Position
                        </Label>
                        <p className="text-sm text-coffee-600">
                          {analysis.ourPosition}th percentile
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Confidence
                        </Label>
                        <span className="text-sm font-medium">
                          {analysis.confidence}%
                        </span>
                      </div>
                      <Progress value={analysis.confidence} className="h-2" />
                    </div>

                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">
                            Recommendation
                          </Label>
                          {getRecommendationBadge(analysis.recommendation)}
                        </div>
                        <Button variant="outline" size="sm">
                          <Calculator className="mr-2 h-4 w-4" />
                          Calculate
                        </Button>
                      </div>
                      <div className="mt-2">
                        <Label className="text-sm font-medium">
                          Key Factors
                        </Label>
                        <ul className="mt-1 text-sm text-coffee-600">
                          {analysis.factors.map((factor, index) => (
                            <li key={index}>• {factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Pricing Tiers Tab */}
        <TabsContent value="tiers" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {pricingData.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {product.productName}
                  </CardTitle>
                  <CardDescription>Volume-based pricing tiers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.pricingTiers.map(tier => (
                      <div
                        key={tier.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <h4 className="font-medium">{tier.name}</h4>
                          <p className="text-sm text-coffee-600">
                            {tier.minQuantity}+{' '}
                            {product.currency === 'USD' ? 'kg' : 'units'}
                            {tier.maxQuantity && ` (max ${tier.maxQuantity})`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(tier.pricePerUnit)}
                          </p>
                          {tier.discountPercentage > 0 && (
                            <p className="text-sm text-green-600">
                              -{tier.discountPercentage}% discount
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full sm:w-auto"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Tiers
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <LineChart className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Price Trends</h3>
                    <p className="text-sm text-coffee-600">
                      Historical pricing analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Margin Analysis</h3>
                    <p className="text-sm text-coffee-600">
                      Profitability by product
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <PieChart className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">Revenue Mix</h3>
                    <p className="text-sm text-coffee-600">
                      Revenue by category
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Market Comparison</h3>
                    <p className="text-sm text-coffee-600">
                      Competitive positioning
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="font-semibold">Price Elasticity</h3>
                    <p className="text-sm text-coffee-600">
                      Demand sensitivity analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Layers className="h-8 w-8 text-indigo-500" />
                  <div>
                    <h3 className="font-semibold">Tier Performance</h3>
                    <p className="text-sm text-coffee-600">
                      Volume tier effectiveness
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Price Update Dialog */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Price</DialogTitle>
            <DialogDescription>
              Update pricing for {selectedProduct?.productName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-price">New Price</Label>
              <Input
                id="new-price"
                type="number"
                step="0.01"
                defaultValue={selectedProduct?.currentPrice}
                placeholder="Enter new price"
              />
            </div>
            <div>
              <Label htmlFor="price-reason">Reason for Change</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market-adjustment">
                    Market Adjustment
                  </SelectItem>
                  <SelectItem value="cost-change">Cost Change</SelectItem>
                  <SelectItem value="competitive-response">
                    Competitive Response
                  </SelectItem>
                  <SelectItem value="promotional">
                    Promotional Pricing
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="effective-date">Effective Date</Label>
              <Input id="effective-date" type="date" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-apply" />
              <Label htmlFor="auto-apply">Apply immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPriceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsPriceDialogOpen(false)}>
              Update Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Rule Dialog */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Pricing Rule</DialogTitle>
            <DialogDescription>
              Define automated pricing rules and conditions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input id="rule-name" placeholder="Enter rule name" />
            </div>
            <div>
              <Label htmlFor="rule-type">Rule Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">Volume-based</SelectItem>
                  <SelectItem value="customer_tier">Customer Tier</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="market_based">Market-based</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rule-action">Action</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Apply Discount</SelectItem>
                  <SelectItem value="markup">Apply Markup</SelectItem>
                  <SelectItem value="fixed_price">Set Fixed Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rule-value">Value (%)</Label>
              <Input
                id="rule-value"
                type="number"
                step="0.1"
                placeholder="Enter percentage"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valid-from">Valid From</Label>
                <Input id="valid-from" type="date" />
              </div>
              <div>
                <Label htmlFor="valid-to">Valid To (Optional)</Label>
                <Input id="valid-to" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Slider
                defaultValue={[1]}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="rule-active" defaultChecked />
              <Label htmlFor="rule-active">Activate immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRuleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsRuleDialogOpen(false)}>
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
