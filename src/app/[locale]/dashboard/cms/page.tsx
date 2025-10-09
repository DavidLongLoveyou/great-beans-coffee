'use client';

import { useState } from 'react';
import { use } from 'react';

import { type Locale } from '@/i18n';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { ContentList, ContentEditor, ContentPreview } from '@/presentation/components/cms';

// Mock data for demonstration
const mockContent = [
  {
    id: '1',
    title: 'The Art of Coffee Cupping: A Complete Guide',
    slug: 'art-of-coffee-cupping-guide',
    type: 'blog' as const,
    status: 'published' as const,
    locale: 'en',
    author: 'John Doe',
    category: 'Education',
    featured: true,
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    views: 1250,
    excerpt: 'Learn the professional techniques of coffee cupping to evaluate and appreciate the complex flavors in your coffee.',
    coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Q1 2024 Coffee Market Report',
    slug: 'q1-2024-coffee-market-report',
    type: 'market-report' as const,
    status: 'draft' as const,
    locale: 'en',
    author: 'Jane Smith',
    category: 'Market Analysis',
    featured: false,
    publishedAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    views: 890,
    excerpt: 'Comprehensive analysis of global coffee market trends, pricing, and forecasts for the first quarter of 2024.',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Ethiopian Highlands: A Journey to Coffee Origins',
    slug: 'ethiopian-highlands-coffee-journey',
    type: 'origin-story' as const,
    status: 'published' as const,
    locale: 'en',
    author: 'Mike Johnson',
    category: 'Origins',
    featured: true,
    publishedAt: '2024-01-08T11:30:00Z',
    updatedAt: '2024-01-08T11:30:00Z',
    views: 2100,
    excerpt: 'Discover the birthplace of coffee in the Ethiopian highlands and meet the farmers who cultivate these exceptional beans.',
    coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Premium Coffee Export Services',
    slug: 'premium-coffee-export-services',
    type: 'service' as const,
    status: 'published' as const,
    locale: 'en',
    author: 'Sarah Wilson',
    category: 'Services',
    featured: false,
    publishedAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-12T10:15:00Z',
    views: 750,
    excerpt: 'Professional coffee export services with quality assurance, logistics support, and global shipping solutions.',
    coverImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Guía Completa del Catado de Café',
    slug: 'guia-completa-catado-cafe',
    type: 'blog' as const,
    status: 'published' as const,
    locale: 'es',
    author: 'Carlos Rodriguez',
    category: 'Educación',
    featured: false,
    publishedAt: '2024-01-12T13:20:00Z',
    updatedAt: '2024-01-12T13:20:00Z',
    views: 680,
    excerpt: 'Aprende las técnicas profesionales de catado de café para evaluar y apreciar los sabores complejos en tu café.',
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
  },
];

const mockMetadata = {
  title: 'The Art of Coffee Cupping: A Complete Guide',
  description: 'Learn the professional techniques of coffee cupping to evaluate and appreciate the complex flavors in your coffee.',
  excerpt: 'Learn the professional techniques of coffee cupping to evaluate and appreciate the complex flavors in your coffee.',
  seoTitle: 'Coffee Cupping Guide: Professional Techniques & Tips | Great Beans',
  seoDescription: 'Master the art of coffee cupping with our comprehensive guide. Learn professional techniques to evaluate coffee flavors, aromas, and quality like an expert.',
  keywords: ['coffee cupping', 'coffee tasting', 'coffee evaluation', 'coffee quality', 'coffee education'],
  locale: 'en',
  category: 'Education',
  featured: true,
  publishedAt: '2024-01-15T10:00:00Z',
  author: 'John Doe',
  coverImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=400&fit=crop',
  slug: 'art-of-coffee-cupping-guide',
  status: 'published' as const,
};

const mockContentText = `# The Art of Coffee Cupping: A Complete Guide

Coffee cupping is the practice of observing the tastes and aromas of brewed coffee. It is a professional practice but can be done informally by anyone or by professionals known as "Q Graders."

## What is Coffee Cupping?

Coffee cupping, or coffee tasting, is used to evaluate different coffees' characteristics. This process involves:

- **Visual inspection** of the dry grounds
- **Aroma evaluation** of both dry and wet grounds  
- **Taste assessment** through systematic slurping
- **Scoring** based on standardized criteria

## The Cupping Process

### 1. Preparation
Start with freshly roasted coffee beans, ideally within 8-24 hours of roasting. Grind the coffee to a medium-coarse consistency.

### 2. Dry Fragrance
Smell the dry grounds immediately after grinding to assess the dry fragrance.

### 3. Wet Aroma
Pour hot water (200°F/93°C) over the grounds and let steep for 4 minutes. Break the crust that forms on top and inhale the wet aroma.

### 4. Tasting
Use a cupping spoon to taste the coffee, slurping loudly to aerate the liquid and spread it across your palate.

## Evaluation Criteria

Professional cupping evaluates coffee on several attributes:

- **Fragrance/Aroma** (dry and wet)
- **Flavor** (the overall taste impression)
- **Aftertaste** (lingering flavors)
- **Acidity** (brightness and liveliness)
- **Body** (weight and texture)
- **Balance** (how well components work together)
- **Uniformity** (consistency across cups)
- **Clean Cup** (absence of defects)
- **Sweetness** (natural sweetness perception)
- **Overall** (holistic evaluation)

## Tips for Better Cupping

1. **Use consistent ratios** - 8.25g coffee to 150ml water
2. **Control water temperature** - 200°F (93°C) is ideal
3. **Time your steeping** - 4 minutes for optimal extraction
4. **Calibrate your palate** - Cup regularly to develop sensitivity
5. **Take notes** - Document your observations for reference

Coffee cupping is both an art and a science, requiring practice and patience to master. Whether you're a coffee professional or an enthusiastic home brewer, developing your cupping skills will deepen your appreciation for this remarkable beverage.`;

type ViewMode = 'list' | 'editor' | 'preview';

export default function CMSPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedContent, setSelectedContent] = useState(mockContent[0]);

  const handleEdit = (item: typeof mockContent[0]) => {
    setSelectedContent(item);
    setCurrentView('editor');
  };

  const handlePreview = (item: typeof mockContent[0]) => {
    setSelectedContent(item);
    setCurrentView('preview');
  };

  const handleCreate = (type: 'blog' | 'market-report' | 'origin-story' | 'service') => {
    // Create new content item
    const newItem = {
      id: Date.now().toString(),
      title: 'New ' + type.replace('-', ' '),
      slug: 'new-' + type,
      type,
      status: 'draft' as const,
      locale: 'en',
      author: 'Current User',
      category: 'Uncategorized',
      featured: false,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      excerpt: 'New content description...',
    };
    setSelectedContent(newItem);
    setCurrentView('editor');
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  return (
    <ContentContainer>
      <ContentSection>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Content Management System</h1>
              <p className="text-muted-foreground">
                Create, edit, and manage your content across all languages and content types
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  3 pending review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  EN, ES, FR, PT
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          {currentView === 'list' && (
            <ContentList
              items={mockContent}
              onEdit={handleEdit}
              onPreview={handlePreview}
              onCreate={handleCreate}
              onDelete={(item) => console.log('Delete:', item)}
              onDuplicate={(item) => console.log('Duplicate:', item)}
              onToggleFeatured={(item) => console.log('Toggle featured:', item)}
              onArchive={(item) => console.log('Archive:', item)}
            />
          )}

          {currentView === 'editor' && (
            <ContentEditor
              initialContent={mockContentText}
              initialMetadata={mockMetadata}
              contentType={selectedContent.type}
              onSave={(content, metadata) => {
                console.log('Save:', { content, metadata });
                setCurrentView('list');
              }}
              onCancel={handleBackToList}
              onPreview={(content, metadata) => {
                console.log('Preview:', { content, metadata });
                setCurrentView('preview');
              }}
            />
          )}

          {currentView === 'preview' && (
            <ContentPreview
              content={mockContentText}
              metadata={mockMetadata}
              contentType={selectedContent.type}
              onEdit={handleBackToList}
              onPublish={() => {
                console.log('Publish content');
                setCurrentView('list');
              }}
            />
          )}
        </div>
      </ContentSection>
    </ContentContainer>
  );
}