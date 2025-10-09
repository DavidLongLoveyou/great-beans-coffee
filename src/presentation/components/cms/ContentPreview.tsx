'use client';

import {
  Eye,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  BookOpen,
  TrendingUp,
  Coffee,
  Briefcase,
} from 'lucide-react';
import { useState } from 'react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip';

interface ContentMetadata {
  title: string;
  description: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  locale: string;
  category: string;
  featured: boolean;
  publishedAt: string;
  author: string;
  coverImage: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
}

interface ContentPreviewProps {
  content: string;
  metadata: ContentMetadata;
  contentType: 'blog' | 'market-report' | 'origin-story' | 'service';
  onPublish?: () => void;
  onEdit?: () => void;
}

const contentTypeIcons = {
  blog: BookOpen,
  'market-report': TrendingUp,
  'origin-story': Coffee,
  service: Briefcase,
};

const deviceSizes = {
  mobile: { width: '375px', height: '667px', name: 'Mobile' },
  tablet: { width: '768px', height: '1024px', name: 'Tablet' },
  desktop: { width: '100%', height: '100%', name: 'Desktop' },
};

export function ContentPreview({
  content,
  metadata,
  contentType,
  onPublish,
  onEdit,
}: ContentPreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<keyof typeof deviceSizes>('desktop');
  const [showSEOPreview, setShowSEOPreview] = useState(false);

  const IconComponent = contentTypeIcons[contentType];
  const deviceConfig = deviceSizes[selectedDevice];

  // Simulate reading time calculation
  const readingTime = Math.ceil(content.split(' ').length / 200);

  // Generate preview URL
  const previewUrl = `/${metadata.locale}/${contentType === 'blog' ? 'blog' : contentType === 'market-report' ? 'market-reports' : contentType === 'origin-story' ? 'origin-stories' : 'services'}/${metadata.slug}`;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <IconComponent className="h-5 w-5" />
          <div>
            <h2 className="text-lg font-semibold">{metadata.title}</h2>
            <p className="text-sm text-muted-foreground">
              Preview • {contentType.replace('-', ' ')} • {metadata.locale.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="flex items-center gap-1 rounded-md border p-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedDevice === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedDevice('mobile')}
                    className="h-8 w-8 p-0"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mobile View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedDevice === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedDevice('tablet')}
                    className="h-8 w-8 p-0"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tablet View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedDevice === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedDevice('desktop')}
                    className="h-8 w-8 p-0"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Desktop View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowSEOPreview(!showSEOPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            SEO Preview
          </Button>

          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>

          {metadata.status === 'draft' && onPublish && (
            <Button size="sm" onClick={onPublish}>
              <Share2 className="mr-2 h-4 w-4" />
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Preview */}
        <div className="flex-1 overflow-auto">
          {showSEOPreview && (
            <div className="border-b bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold">SEO Preview</h3>
              
              {/* Google Search Result Preview */}
              <div className="mb-4 rounded-md border bg-white p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-600">Google Search Result</h4>
                <div className="space-y-1">
                  <div className="text-sm text-green-700">{`greatbeans.com${previewUrl}`}</div>
                  <div className="text-lg text-blue-600 hover:underline cursor-pointer">
                    {metadata.seoTitle || metadata.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metadata.seoDescription || metadata.description}
                  </div>
                </div>
              </div>

              {/* Social Media Preview */}
              <div className="rounded-md border bg-white p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-600">Social Media Preview</h4>
                <div className="flex gap-3">
                  {metadata.coverImage && (
                    <div className="h-20 w-32 rounded bg-gray-200 flex items-center justify-center">
                      <img 
                        src={metadata.coverImage} 
                        alt="Cover" 
                        className="h-full w-full object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                      />
                      <div className="hidden h-full w-full items-center justify-center text-xs text-gray-500">
                        Image
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{metadata.title}</div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {metadata.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">greatbeans.com</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Preview */}
          <div className="flex justify-center p-4">
            <div 
              className="border rounded-lg overflow-hidden shadow-lg transition-all duration-300"
              style={{
                width: deviceConfig.width,
                height: selectedDevice === 'desktop' ? 'auto' : deviceConfig.height,
                maxWidth: '100%',
              }}
            >
              {/* Mock Browser Header */}
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 text-xs">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-400"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 rounded bg-white px-2 py-1 text-gray-600">
                  greatbeans.com{previewUrl}
                </div>
              </div>

              {/* Content */}
              <div className="bg-white p-6 overflow-auto" style={{ height: selectedDevice === 'desktop' ? 'auto' : 'calc(100% - 32px)' }}>
                {/* Article Header */}
                <div className="mb-6">
                  {metadata.coverImage && (
                    <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-gray-200">
                      <img 
                        src={metadata.coverImage} 
                        alt={metadata.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                      />
                      <div className="hidden h-full w-full items-center justify-center text-gray-500">
                        Cover Image
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline" className="capitalize">
                      {contentType.replace('-', ' ')}
                    </Badge>
                    {metadata.category && (
                      <Badge variant="secondary">{metadata.category}</Badge>
                    )}
                    {metadata.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                  </div>
                  
                  <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
                    {metadata.title}
                  </h1>
                  
                  <div className="mb-4 text-lg text-gray-600">
                    {metadata.description}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {metadata.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(metadata.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {metadata.locale.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="prose prose-gray max-w-none">
                  {/* This would be replaced with actual MDX rendering */}
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: content
                        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
                        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n\n/g, '</p><p class="mb-4">')
                        .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
                    }}
                  />
                </div>

                {/* Keywords */}
                {metadata.keywords.length > 0 && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="mb-3 text-sm font-medium text-gray-900">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {metadata.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          <Tag className="mr-1 h-2 w-2" />
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-gray-50 p-4">
          <h3 className="mb-4 font-semibold">Content Information</h3>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  className={
                    metadata.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : metadata.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {metadata.status}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize">{contentType.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span>{metadata.locale.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Author:</span>
                  <span>{metadata.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading Time:</span>
                  <span>{readingTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count:</span>
                  <span>{content.split(' ').length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">SEO Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Title Length</span>
                    <span className={metadata.title.length > 60 ? 'text-red-600' : 'text-green-600'}>
                      {metadata.title.length}/60
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Description Length</span>
                    <span className={metadata.seoDescription.length > 160 ? 'text-red-600' : 'text-green-600'}>
                      {metadata.seoDescription.length}/160
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Keywords</span>
                    <span className={metadata.keywords.length === 0 ? 'text-red-600' : 'text-green-600'}>
                      {metadata.keywords.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Preview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}