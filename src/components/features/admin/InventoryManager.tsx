'use client';

import React, { useState } from 'react';
import {  Package, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Download, Upload, Search, DollarSign, Truck, Eye, Edit, Plus, FileText, Bell, Target, Activity, Archive, ShoppingCart  } from '@/components/ui/dynamic-icons';

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
import { Textarea } from '@/presentation/components/ui/textarea';
import { Switch } from '@/presentation/components/ui/switch';

// Types for inventory management
interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  totalValue: number;
  location: string;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  qualityGrade: 'A' | 'B' | 'C';
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired' | 'reserved';
  movementHistory: InventoryMovement[];
  forecastData: ForecastData;
}

interface InventoryMovement {
  id: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'reserved' | 'released';
  quantity: number;
  reason: string;
  reference?: string;
  timestamp: string;
  user: string;
  notes?: string;
}

interface ForecastData {
  demandForecast: number;
  leadTime: number;
  safetyStock: number;
  reorderQuantity: number;
  nextReorderDate: string;
  confidence: number;
}

interface InventoryAlert {
  id: string;
  type:
    | 'low_stock'
    | 'out_of_stock'
    | 'expiring'
    | 'overstock'
    | 'quality_issue';
  productId: string;
  productName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  acknowledged: boolean;
}

interface InventoryManagerProps {
  className?: string;
}

// Mock data for demonstration
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    productId: 'arabica-001',
    productName: 'Premium Ethiopian Arabica',
    sku: 'ETH-ARB-001',
    category: 'Arabica',
    currentStock: 2500,
    reservedStock: 500,
    availableStock: 2000,
    reorderPoint: 1000,
    maxStock: 5000,
    unit: 'kg',
    costPerUnit: 8.5,
    totalValue: 21250,
    location: 'Warehouse A-1',
    supplier: 'Ethiopian Coffee Cooperative',
    lastRestocked: '2024-01-15',
    qualityGrade: 'A',
    status: 'in_stock',
    movementHistory: [],
    forecastData: {
      demandForecast: 800,
      leadTime: 14,
      safetyStock: 200,
      reorderQuantity: 2000,
      nextReorderDate: '2024-02-15',
      confidence: 85,
    },
  },
  {
    id: '2',
    productId: 'robusta-001',
    productName: 'Vietnamese Robusta',
    sku: 'VN-ROB-001',
    category: 'Robusta',
    currentStock: 800,
    reservedStock: 200,
    availableStock: 600,
    reorderPoint: 1200,
    maxStock: 4000,
    unit: 'kg',
    costPerUnit: 6.2,
    totalValue: 4960,
    location: 'Warehouse B-2',
    supplier: 'Vietnam Coffee Export',
    lastRestocked: '2024-01-10',
    qualityGrade: 'A',
    status: 'low_stock',
    movementHistory: [],
    forecastData: {
      demandForecast: 600,
      leadTime: 10,
      safetyStock: 150,
      reorderQuantity: 1500,
      nextReorderDate: '2024-02-01',
      confidence: 78,
    },
  },
  {
    id: '3',
    productId: 'specialty-001',
    productName: 'Jamaica Blue Mountain',
    sku: 'JAM-BM-001',
    category: 'Specialty',
    currentStock: 50,
    reservedStock: 30,
    availableStock: 20,
    reorderPoint: 100,
    maxStock: 300,
    unit: 'kg',
    costPerUnit: 45.0,
    totalValue: 2250,
    location: 'Warehouse C-1',
    supplier: 'Jamaica Coffee Board',
    lastRestocked: '2024-01-05',
    expiryDate: '2024-03-01',
    qualityGrade: 'A',
    status: 'out_of_stock',
    movementHistory: [],
    forecastData: {
      demandForecast: 40,
      leadTime: 21,
      safetyStock: 20,
      reorderQuantity: 150,
      nextReorderDate: '2024-01-25',
      confidence: 92,
    },
  },
];

const mockAlerts: InventoryAlert[] = [
  {
    id: '1',
    type: 'low_stock',
    productId: 'robusta-001',
    productName: 'Vietnamese Robusta',
    message: 'Stock level below reorder point (800kg < 1200kg)',
    severity: 'medium',
    timestamp: '2024-01-20T10:30:00Z',
    acknowledged: false,
  },
  {
    id: '2',
    type: 'out_of_stock',
    productId: 'specialty-001',
    productName: 'Jamaica Blue Mountain',
    message: 'Product is out of stock',
    severity: 'critical',
    timestamp: '2024-01-20T09:15:00Z',
    acknowledged: false,
  },
  {
    id: '3',
    type: 'expiring',
    productId: 'specialty-001',
    productName: 'Jamaica Blue Mountain',
    message: 'Product expires in 40 days',
    severity: 'medium',
    timestamp: '2024-01-20T08:00:00Z',
    acknowledged: true,
  },
];

export function InventoryManager({ className }: InventoryManagerProps) {
  const [inventoryItems, _setInventoryItems] =
    useState<InventoryItem[]>(mockInventoryItems);
  const [alerts, setAlerts] = useState<InventoryAlert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);

  // Filter inventory items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate summary statistics
  const totalValue = inventoryItems.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );
  const lowStockItems = inventoryItems.filter(
    item => item.status === 'low_stock'
  ).length;
  const outOfStockItems = inventoryItems.filter(
    item => item.status === 'out_of_stock'
  ).length;
  const unacknowledgedAlerts = alerts.filter(
    alert => !alert.acknowledged
  ).length;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_stock: {
        label: 'In Stock',
        variant: 'default' as const,
        icon: CheckCircle,
      },
      low_stock: {
        label: 'Low Stock',
        variant: 'destructive' as const,
        icon: AlertTriangle,
      },
      out_of_stock: {
        label: 'Out of Stock',
        variant: 'destructive' as const,
        icon: AlertTriangle,
      },
      expired: {
        label: 'Expired',
        variant: 'destructive' as const,
        icon: Clock,
      },
      reserved: {
        label: 'Reserved',
        variant: 'secondary' as const,
        icon: Archive,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getAlertSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { label: 'Low', variant: 'secondary' as const },
      medium: { label: 'Medium', variant: 'default' as const },
      high: { label: 'High', variant: 'destructive' as const },
      critical: { label: 'Critical', variant: 'destructive' as const },
    };

    const config = severityConfig[severity as keyof typeof severityConfig];
    return config ? (
      <Badge variant={config.variant}>{config.label}</Badge>
    ) : null;
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800">
            Inventory Management
          </h1>
          <p className="text-coffee-600">
            Track stock levels, manage inventory, and monitor alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
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
                  Total Inventory Value
                </p>
                <p className="text-2xl font-bold text-coffee-800">
                  ${totalValue.toLocaleString()}
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
                  Low Stock Items
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {lowStockItems}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-coffee-600">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {outOfStockItems}
                </p>
              </div>
              <Package className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-coffee-600">
                  Active Alerts
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {unacknowledgedAlerts}
                </p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts ({unacknowledgedAlerts})
          </TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
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
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>
                Manage your coffee inventory and track stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-coffee-600">
                            Grade {item.qualityGrade}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.sku}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {item.currentStock.toLocaleString()} {item.unit}
                          </p>
                          <Progress
                            value={(item.currentStock / item.maxStock) * 100}
                            className="mt-1 h-2 w-16"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.availableStock.toLocaleString()} {item.unit}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>${item.totalValue.toLocaleString()}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsMovementDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsReorderDialogOpen(true);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
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

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>
                Monitor and manage inventory alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-4 ${
                      alert.acknowledged
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            alert.severity === 'critical'
                              ? 'text-red-600'
                              : alert.severity === 'high'
                                ? 'text-orange-600'
                                : 'text-yellow-600'
                          }`}
                        />
                        <div>
                          <p className="font-medium">{alert.productName}</p>
                          <p className="text-sm text-coffee-600">
                            {alert.message}
                          </p>
                          <p className="text-xs text-coffee-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getAlertSeverityBadge(alert.severity)}
                        {!alert.acknowledged && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {inventoryItems.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.productName}</CardTitle>
                  <CardDescription>
                    Demand forecasting and reorder planning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Forecast Demand
                      </Label>
                      <p className="text-lg font-semibold text-coffee-800">
                        {item.forecastData.demandForecast} {item.unit}/month
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Confidence</Label>
                      <p className="text-lg font-semibold text-green-600">
                        {item.forecastData.confidence}%
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Lead Time</Label>
                      <p className="text-lg font-semibold text-coffee-800">
                        {item.forecastData.leadTime} days
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Safety Stock
                      </Label>
                      <p className="text-lg font-semibold text-coffee-800">
                        {item.forecastData.safetyStock} {item.unit}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">
                          Next Reorder
                        </Label>
                        <p className="text-sm text-coffee-600">
                          {new Date(
                            item.forecastData.nextReorderDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Target className="mr-2 h-4 w-4" />
                        Adjust Forecast
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Stock Level Report</h3>
                    <p className="text-sm text-coffee-600">
                      Current stock levels and trends
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Movement History</h3>
                    <p className="text-sm text-coffee-600">
                      Inventory movements and transactions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">Demand Analysis</h3>
                    <p className="text-sm text-coffee-600">
                      Demand patterns and forecasting
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-gold-500" />
                  <div>
                    <h3 className="font-semibold">Valuation Report</h3>
                    <p className="text-sm text-coffee-600">
                      Inventory value and cost analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Truck className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Supplier Performance</h3>
                    <p className="text-sm text-coffee-600">
                      Supplier delivery and quality metrics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="font-semibold">Compliance Report</h3>
                    <p className="text-sm text-coffee-600">
                      Quality and regulatory compliance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stock Movement Dialog */}
      <Dialog
        open={isMovementDialogOpen}
        onOpenChange={setIsMovementDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
            <DialogDescription>
              Add or remove stock for {selectedItem?.productName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="movement-type">Movement Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select movement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="Enter quantity" />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" placeholder="Enter reason for movement" />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" placeholder="Additional notes" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMovementDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsMovementDialogOpen(false)}>
              Record Movement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reorder Dialog */}
      <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Reorder</DialogTitle>
            <DialogDescription>
              Generate a reorder for {selectedItem?.productName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reorder-quantity">Reorder Quantity</Label>
              <Input
                id="reorder-quantity"
                type="number"
                defaultValue={selectedItem?.forecastData.reorderQuantity}
                placeholder="Enter quantity to reorder"
              />
            </div>
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">
                    Ethiopian Coffee Cooperative
                  </SelectItem>
                  <SelectItem value="supplier2">
                    Vietnam Coffee Export
                  </SelectItem>
                  <SelectItem value="supplier3">
                    Jamaica Coffee Board
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-approve" />
              <Label htmlFor="auto-approve">Auto-approve when received</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReorderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsReorderDialogOpen(false)}>
              Create Reorder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
