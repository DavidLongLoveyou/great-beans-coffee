'use client';

import {
  Coffee,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Copy,
  Archive,
  Star,
  StarOff,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  BarChart3,
  Image,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useMemo, use } from 'react';

import { type Locale } from '@/i18n';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Switch } from '@/presentation/components/ui/switch';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';
import { InventoryManager } from '@/components/features/admin/InventoryManager';
import { PricingManager } from '@/components/features/admin/PricingManager';

interface ProductsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  origin: string;
  variety: string;
  processing: string;
  grade: string;
  price: number;
  currency: string;
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock' | 'discontinued';
  featured: boolean;
  images: number;
  lastUpdated: string;
  createdAt: string;
  sales: number;
  views: number;
}

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ethiopian Yirgacheffe Grade 1',
    sku: 'ETH-YRG-G1-001',
    origin: 'Ethiopia',
    variety: 'Heirloom',
    processing: 'Washed',
    grade: 'Grade 1',
    price: 8.5,
    currency: 'USD',
    stock: 2500,
    status: 'active',
    featured: true,
    images: 5,
    lastUpdated: '2024-01-15',
    createdAt: '2023-12-01',
    sales: 1250,
    views: 3420,
  },
  {
    id: '2',
    name: 'Colombian Supremo Huila',
    sku: 'COL-SUP-HUI-002',
    origin: 'Colombia',
    variety: 'Caturra',
    processing: 'Washed',
    grade: 'Supremo',
    price: 7.25,
    currency: 'USD',
    stock: 1800,
    status: 'active',
    featured: false,
    images: 3,
    lastUpdated: '2024-01-14',
    createdAt: '2023-11-15',
    sales: 890,
    views: 2150,
  },
  {
    id: '3',
    name: 'Brazilian Santos NY2 Screen 17/18',
    sku: 'BRA-SAN-NY2-003',
    origin: 'Brazil',
    variety: 'Bourbon',
    processing: 'Natural',
    grade: 'NY2 Screen 17/18',
    price: 6.8,
    currency: 'USD',
    stock: 0,
    status: 'out-of-stock',
    featured: false,
    images: 4,
    lastUpdated: '2024-01-10',
    createdAt: '2023-10-20',
    sales: 2100,
    views: 4580,
  },
  {
    id: '4',
    name: 'Guatemalan Antigua SHB',
    sku: 'GUA-ANT-SHB-004',
    origin: 'Guatemala',
    variety: 'Bourbon',
    processing: 'Washed',
    grade: 'SHB',
    price: 9.2,
    currency: 'USD',
    stock: 1200,
    status: 'active',
    featured: true,
    images: 6,
    lastUpdated: '2024-01-12',
    createdAt: '2023-09-05',
    sales: 750,
    views: 1890,
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  'out-of-stock': 'bg-red-100 text-red-800',
  discontinued: 'bg-orange-100 text-orange-800',
};

const statusIcons = {
  active: CheckCircle,
  inactive: Clock,
  'out-of-stock': AlertTriangle,
  discontinued: Archive,
};

export default function ProductsPage({ params }: ProductsPageProps) {
  const _locale = use(params).locale;
  const _t = useTranslations('dashboard.products');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, _setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter;
      const matchesOrigin =
        originFilter === 'all' || product.origin === originFilter;

      return matchesSearch && matchesStatus && matchesOrigin;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Product] as
        | string
        | number;
      let bValue: string | number = b[sortBy as keyof Product] as
        | string
        | number;

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, originFilter, sortBy, sortOrder]);

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const getUniqueOrigins = () => {
    return Array.from(new Set(mockProducts.map(p => p.origin))).sort();
  };

  const getStatusIcon = (status: Product['status']) => {
    const Icon = statusIcons[status];
    return <Icon className="h-4 w-4" />;
  };

  return (
    <ContentContainer>
      <ContentSection>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CoffeeHeading as="h1" className="text-3xl font-bold">
                Product Management
              </CoffeeHeading>
              <p className="text-muted-foreground">
                Manage your coffee product catalog, inventory, and pricing
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
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                    <DialogDescription>
                      Add a new coffee product to your catalog
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          placeholder="Ethiopian Yirgacheffe..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input id="sku" placeholder="ETH-YRG-G1-001" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select origin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethiopia">Ethiopia</SelectItem>
                            <SelectItem value="colombia">Colombia</SelectItem>
                            <SelectItem value="brazil">Brazil</SelectItem>
                            <SelectItem value="guatemala">Guatemala</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="variety">Variety</Label>
                        <Input id="variety" placeholder="Heirloom" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="processing">Processing</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select processing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="washed">Washed</SelectItem>
                            <SelectItem value="natural">Natural</SelectItem>
                            <SelectItem value="honey">Honey</SelectItem>
                            <SelectItem value="semi-washed">
                              Semi-Washed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Input id="grade" placeholder="Grade 1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (USD/kg)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="8.50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock (kg)</Label>
                        <Input id="stock" type="number" placeholder="2500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the coffee's characteristics, flavor notes, and origin story..."
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="featured" />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>
                      Create Product
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProducts.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Products
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockProducts.filter(p => p.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(
                    (mockProducts.filter(p => p.status === 'active').length /
                      mockProducts.length) *
                      100
                  )}
                  % of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Out of Stock
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockProducts.filter(p => p.status === 'out-of-stock').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Price
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {(
                    mockProducts.reduce((sum, p) => sum + p.price, 0) /
                    mockProducts.length
                  ).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Per kilogram</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="products" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              {/* Filters and Search */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Catalog</CardTitle>
                  <CardDescription>
                    Manage your coffee products, inventory, and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search products, SKU, or origin..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="out-of-stock">
                            Out of Stock
                          </SelectItem>
                          <SelectItem value="discontinued">
                            Discontinued
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={originFilter}
                        onValueChange={setOriginFilter}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Origin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Origins</SelectItem>
                          {getUniqueOrigins().map(origin => (
                            <SelectItem
                              key={origin}
                              value={origin.toLowerCase()}
                            >
                              {origin}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="stock">Stock</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="lastUpdated">Updated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  {selectedProducts.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                      <span className="text-sm font-medium">
                        {selectedProducts.length} product
                        {selectedProducts.length > 1 ? 's' : ''} selected
                      </span>
                      <div className="ml-auto flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Bulk Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Products Table */}
                  <div className="mt-6 rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              checked={
                                selectedProducts.length ===
                                  filteredProducts.length &&
                                filteredProducts.length > 0
                              }
                              onChange={handleSelectAll}
                              className="rounded border-gray-300"
                            />
                          </TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Origin</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Performance</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map(product => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleSelectProduct(product.id)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coffee-50">
                                  <Coffee className="h-5 w-5 text-coffee-600" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {product.variety} • {product.processing}
                                  </div>
                                </div>
                                {product.featured && (
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {product.sku}
                            </TableCell>
                            <TableCell>{product.origin}</TableCell>
                            <TableCell>{product.grade}</TableCell>
                            <TableCell>
                              <div className="font-medium">
                                ${product.price.toFixed(2)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                per kg
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {product.stock.toLocaleString()} kg
                              </div>
                              {product.stock < 500 &&
                                product.status !== 'out-of-stock' && (
                                  <div className="text-sm text-orange-600">
                                    Low stock
                                  </div>
                                )}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[product.status]}>
                                <span className="mr-1">
                                  {getStatusIcon(product.status)}
                                </span>
                                {product.status.replace('-', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <TrendingUp className="h-3 w-3" />
                                  {product.sales} sales
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Eye className="h-3 w-3" />
                                  {product.views} views
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/products/${product.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Image className="mr-2 h-4 w-4" />
                                    Manage Images
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {product.featured ? (
                                      <>
                                        <StarOff className="mr-2 h-4 w-4" />
                                        Remove from Featured
                                      </>
                                    ) : (
                                      <>
                                        <Star className="mr-2 h-4 w-4" />
                                        Add to Featured
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="py-12 text-center">
                      <Coffee className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">
                        No products found
                      </h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <InventoryManager />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingManager />
            </TabsContent>
          </Tabs>
        </div>
      </ContentSection>
    </ContentContainer>
  );
}
