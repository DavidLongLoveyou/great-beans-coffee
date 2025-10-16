'use client';

import {  Save, X, DollarSign, Package, AlertTriangle, CheckCircle, Coffee, Clock, Plus, Minus  } from '@/components/ui/dynamic-icons';
import { useState, useEffect } from 'react';

import { ProductImageUpload } from '@/components/features/admin/ProductImageUpload';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Switch } from '@/presentation/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { Textarea } from '@/presentation/components/ui/textarea';

export interface ProductData {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;

  // Origin & Processing
  origin: string;
  region: string;
  farm: string;
  farmer: string;
  altitude: string;
  variety: string;
  processing: string;
  grade: string;
  harvestSeason: string;

  // Characteristics
  flavorNotes: string[];
  aroma: string;
  acidity: number; // 1-10 scale
  body: number; // 1-10 scale
  sweetness: number; // 1-10 scale

  // Pricing & Inventory
  price: number;
  currency: string;
  minimumOrder: number;
  stock: number;
  unit: string;

  // Status & Visibility
  status: 'active' | 'inactive' | 'out-of-stock' | 'discontinued';
  featured: boolean;
  published: boolean;

  // SEO & Marketing
  metaTitle: string;
  metaDescription: string;
  tags: string[];

  // Certifications
  certifications: string[];

  // Images
  images: Array<{
    id: string;
    url: string;
    alt: string;
    category: string;
    isPrimary: boolean;
  }>;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

interface ProductEditorProps {
  product?: ProductData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductData) => void;
  mode: 'create' | 'edit';
}

const defaultProduct: ProductData = {
  name: '',
  slug: '',
  sku: '',
  description: '',
  shortDescription: '',
  origin: '',
  region: '',
  farm: '',
  farmer: '',
  altitude: '',
  variety: '',
  processing: '',
  grade: '',
  harvestSeason: '',
  flavorNotes: [],
  aroma: '',
  acidity: 5,
  body: 5,
  sweetness: 5,
  price: 0,
  currency: 'USD',
  minimumOrder: 1,
  stock: 0,
  unit: 'kg',
  status: 'active',
  featured: false,
  published: false,
  metaTitle: '',
  metaDescription: '',
  tags: [],
  certifications: [],
  images: [],
};

const flavorNoteOptions = [
  'Chocolate',
  'Caramel',
  'Vanilla',
  'Nutty',
  'Fruity',
  'Citrus',
  'Berry',
  'Floral',
  'Spicy',
  'Earthy',
  'Herbal',
  'Wine-like',
  'Honey',
  'Tropical',
  'Stone Fruit',
  'Apple',
  'Orange',
  'Lemon',
  'Cherry',
  'Grape',
];

const certificationOptions = [
  'Organic',
  'Fair Trade',
  'Rainforest Alliance',
  'UTZ',
  'Bird Friendly',
  'Shade Grown',
  'Direct Trade',
  'C.A.F.E. Practices',
];

const originOptions = [
  'Ethiopia',
  'Colombia',
  'Brazil',
  'Guatemala',
  'Costa Rica',
  'Kenya',
  'Jamaica',
  'Hawaii',
  'Yemen',
  'Peru',
  'Honduras',
  'Nicaragua',
  'El Salvador',
  'Panama',
  'Ecuador',
  'Bolivia',
  'Mexico',
  'India',
  'Indonesia',
  'Vietnam',
  'Papua New Guinea',
  'Rwanda',
  'Burundi',
];

const processingOptions = [
  'Washed',
  'Natural',
  'Honey',
  'Semi-Washed',
  'Wet Hulled',
  'Anaerobic',
  'Carbonic Maceration',
  'Extended Fermentation',
];

export function ProductEditor({
  product,
  isOpen,
  onClose,
  onSave,
  mode,
}: ProductEditorProps) {
  const [formData, setFormData] = useState<ProductData>(defaultProduct);
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [newFlavorNote, setNewFlavorNote] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData(defaultProduct);
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    handleInputChange('name', name);
    if (mode === 'create') {
      handleInputChange('slug', generateSlug(name));
      handleInputChange('metaTitle', name);
    }
  };

  const addFlavorNote = () => {
    if (newFlavorNote && !formData.flavorNotes.includes(newFlavorNote)) {
      handleInputChange('flavorNotes', [
        ...formData.flavorNotes,
        newFlavorNote,
      ]);
      setNewFlavorNote('');
    }
  };

  const removeFlavorNote = (note: string) => {
    handleInputChange(
      'flavorNotes',
      formData.flavorNotes.filter(n => n !== note)
    );
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      handleInputChange('tags', [...formData.tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    handleInputChange(
      'tags',
      formData.tags.filter(t => t !== tag)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Error handling removed for production
    } finally {
      setIsSaving(false);
    }
  };

  const ScaleInput = ({
    label,
    value,
    onChange,
    min = 1,
    max = 10,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <div className="flex-1 text-center font-medium">
          {value}/{max}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="h-2 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-coffee-500 transition-all"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            {mode === 'create' ? 'Create New Product' : 'Edit Product'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new coffee product to your catalog'
              : 'Update product information, pricing, and inventory'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="origin">Origin & Processing</TabsTrigger>
              <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="seo">SEO & Marketing</TabsTrigger>
            </TabsList>

            <div className="mt-4 h-[calc(90vh-200px)] overflow-y-auto">
              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => handleNameChange(e.target.value)}
                        placeholder="Ethiopian Yirgacheffe Grade 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={e => handleInputChange('sku', e.target.value)}
                        placeholder="ETH-YRG-G1-001"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={e => handleInputChange('slug', e.target.value)}
                      placeholder="ethiopian-yirgacheffe-grade-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={e =>
                        handleInputChange('shortDescription', e.target.value)
                      }
                      placeholder="A brief, compelling description for product listings..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e =>
                        handleInputChange('description', e.target.value)
                      }
                      placeholder="Detailed description including origin story, flavor profile, and brewing recommendations..."
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={checked =>
                          handleInputChange('published', checked)
                        }
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={checked =>
                          handleInputChange('featured', checked)
                        }
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={value =>
                          handleInputChange('status', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
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
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="origin" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin Country *</Label>
                      <Select
                        value={formData.origin}
                        onValueChange={value =>
                          handleInputChange('origin', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {originOptions.map(origin => (
                            <SelectItem key={origin} value={origin}>
                              {origin}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        value={formData.region}
                        onChange={e =>
                          handleInputChange('region', e.target.value)
                        }
                        placeholder="Yirgacheffe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="farm">Farm/Cooperative</Label>
                      <Input
                        id="farm"
                        value={formData.farm}
                        onChange={e =>
                          handleInputChange('farm', e.target.value)
                        }
                        placeholder="Kochere Cooperative"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer">Farmer/Producer</Label>
                      <Input
                        id="farmer"
                        value={formData.farmer}
                        onChange={e =>
                          handleInputChange('farmer', e.target.value)
                        }
                        placeholder="Various smallholder farmers"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="altitude">Altitude</Label>
                      <Input
                        id="altitude"
                        value={formData.altitude}
                        onChange={e =>
                          handleInputChange('altitude', e.target.value)
                        }
                        placeholder="1,700-2,200 masl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variety">Variety</Label>
                      <Input
                        id="variety"
                        value={formData.variety}
                        onChange={e =>
                          handleInputChange('variety', e.target.value)
                        }
                        placeholder="Heirloom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="harvestSeason">Harvest Season</Label>
                      <Input
                        id="harvestSeason"
                        value={formData.harvestSeason}
                        onChange={e =>
                          handleInputChange('harvestSeason', e.target.value)
                        }
                        placeholder="October - December"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="processing">Processing Method</Label>
                      <Select
                        value={formData.processing}
                        onValueChange={value =>
                          handleInputChange('processing', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select processing method" />
                        </SelectTrigger>
                        <SelectContent>
                          {processingOptions.map(method => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade/Classification</Label>
                      <Input
                        id="grade"
                        value={formData.grade}
                        onChange={e =>
                          handleInputChange('grade', e.target.value)
                        }
                        placeholder="Grade 1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.certifications.map(cert => (
                        <Badge
                          key={cert}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {cert}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() =>
                              handleInputChange(
                                'certifications',
                                formData.certifications.filter(c => c !== cert)
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={value => {
                          if (!formData.certifications.includes(value)) {
                            handleInputChange('certifications', [
                              ...formData.certifications,
                              value,
                            ]);
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add certification" />
                        </SelectTrigger>
                        <SelectContent>
                          {certificationOptions
                            .filter(
                              cert => !formData.certifications.includes(cert)
                            )
                            .map(cert => (
                              <SelectItem key={cert} value={cert}>
                                {cert}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="characteristics" className="space-y-4">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label>Flavor Notes</Label>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.flavorNotes.map(note => (
                        <Badge
                          key={note}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {note}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeFlavorNote(note)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={newFlavorNote}
                        onValueChange={setNewFlavorNote}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add flavor note" />
                        </SelectTrigger>
                        <SelectContent>
                          {flavorNoteOptions
                            .filter(
                              note => !formData.flavorNotes.includes(note)
                            )
                            .map(note => (
                              <SelectItem key={note} value={note}>
                                {note}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={addFlavorNote}
                        disabled={!newFlavorNote}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aroma">Aroma Description</Label>
                    <Textarea
                      id="aroma"
                      value={formData.aroma}
                      onChange={e => handleInputChange('aroma', e.target.value)}
                      placeholder="Describe the coffee's aroma characteristics..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <ScaleInput
                      label="Acidity"
                      value={formData.acidity}
                      onChange={value => handleInputChange('acidity', value)}
                    />
                    <ScaleInput
                      label="Body"
                      value={formData.body}
                      onChange={value => handleInputChange('body', value)}
                    />
                    <ScaleInput
                      label="Sweetness"
                      value={formData.sweetness}
                      onChange={value => handleInputChange('sweetness', value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={e =>
                            handleInputChange(
                              'price',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="pl-10"
                          placeholder="8.50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={value =>
                          handleInputChange('currency', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={value =>
                          handleInputChange('unit', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="lb">Pound (lb)</SelectItem>
                          <SelectItem value="bag">Bag (60kg)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Current Stock</Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={e =>
                            handleInputChange(
                              'stock',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="pl-10"
                          placeholder="2500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimumOrder">
                        Minimum Order Quantity
                      </Label>
                      <Input
                        id="minimumOrder"
                        type="number"
                        value={formData.minimumOrder}
                        onChange={e =>
                          handleInputChange(
                            'minimumOrder',
                            parseInt(e.target.value) || 1
                          )
                        }
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Inventory Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          {formData.stock > 500 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : formData.stock > 0 ? (
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium">
                            {formData.stock > 500
                              ? 'In Stock'
                              : formData.stock > 0
                                ? 'Low Stock'
                                : 'Out of Stock'}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formData.stock} {formData.unit} available
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <ProductImageUpload
                  {...(formData.id && { productId: formData.id })}
                  existingImages={formData.images}
                  onImagesChange={images => handleInputChange('images', images)}
                />
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={e =>
                        handleInputChange('metaTitle', e.target.value)
                      }
                      placeholder="SEO-optimized title for search engines"
                      maxLength={60}
                    />
                    <div className="text-sm text-muted-foreground">
                      {formData.metaTitle.length}/60 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={e =>
                        handleInputChange('metaDescription', e.target.value)
                      }
                      placeholder="Brief description for search engine results"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-sm text-muted-foreground">
                      {formData.metaDescription.length}/160 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyPress={e => e.key === 'Enter' && addTag()}
                      />
                      <Button type="button" onClick={addTag} disabled={!newTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === 'create' ? 'Create Product' : 'Save Changes'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
