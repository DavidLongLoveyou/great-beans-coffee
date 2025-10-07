'use client';

import { Calendar, Clock, Tag, ExternalLink, FileText, Package, MapPin, Users, Star, TrendingUp, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { cn } from '@/shared/utils/cn';

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'blog' | 'market-report' | 'service' | 'product' | 'origin-story' | 'case-study';
  category?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  readingTime?: number;
  featured?: boolean;
  coverImage?: string;
  excerpt?: string;
  locale?: string;
  // Product specific fields
  price?: {
    min: number;
    max: number;
    currency: string;
  };
  origin?: string;
  grade?: string;
  // Service specific fields
  serviceType?: string;
  // Market report specific fields
  reportType?: string;
  region?: string;
  // Engagement metrics
  views?: number;
  rating?: number;
}

export interface SearchResultsProps {
  results: SearchResultItem[];
  loading?: boolean;
  error?: string | null;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  showPagination?: boolean;
  emptyStateMessage?: string;
  emptyStateDescription?: string;
  layout?: 'list' | 'grid';
  showMetrics?: boolean;
}

const getTypeIcon = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'blog':
      return <FileText className="h-4 w-4" />;
    case 'market-report':
      return <TrendingUp className="h-4 w-4" />;
    case 'service':
      return <Users className="h-4 w-4" />;
    case 'product':
      return <Package className="h-4 w-4" />;
    case 'origin-story':
      return <MapPin className="h-4 w-4" />;
    case 'case-study':
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'blog':
      return 'Blog Post';
    case 'market-report':
      return 'Market Report';
    case 'service':
      return 'Service';
    case 'product':
      return 'Product';
    case 'origin-story':
      return 'Origin Story';
    case 'case-study':
      return 'Case Study';
    default:
      return 'Content';
  }
};

const getTypeColor = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'blog':
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    case 'market-report':
      return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
    case 'service':
      return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
    case 'product':
      return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
    case 'origin-story':
      return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    case 'case-study':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
  }
};

function SearchResultSkeleton({ layout = 'list' }: { layout?: 'list' | 'grid' }) {
  return (
    <Card className={cn(
      'w-full animate-pulse',
      layout === 'grid' && 'h-80'
    )}>
      <CardHeader className="pb-3">
        <div className={cn(
          'flex gap-4',
          layout === 'grid' ? 'flex-col' : 'items-start justify-between'
        )}>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className={cn(
              'h-6',
              layout === 'grid' ? 'w-full' : 'w-3/4'
            )} />
          </div>
          <Skeleton className={cn(
            'rounded-md',
            layout === 'grid' ? 'h-32 w-full' : 'h-16 w-16'
          )} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SearchResultCard({ 
  result, 
  layout = 'list',
  showMetrics = true,
  index = 0 
}: { 
  result: SearchResultItem;
  layout?: 'list' | 'grid';
  showMetrics?: boolean;
  index?: number;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <Card className={cn(
      'w-full group transition-all duration-300 ease-out',
      'hover:shadow-lg hover:shadow-gray-200/50',
      'hover:-translate-y-1 hover:scale-[1.02]',
      'border-gray-200 hover:border-gray-300',
      'bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50/30',
      layout === 'grid' && 'h-full flex flex-col'
    )}
    style={{
      animationDelay: `${index * 100}ms`
    }}>
      <CardHeader className={cn(
        'pb-3 transition-all duration-300',
        layout === 'grid' && 'flex-shrink-0'
      )}>
        <div className={cn(
          'flex gap-4',
          layout === 'grid' ? 'flex-col' : 'items-start justify-between'
        )}>
          <div className="space-y-3 flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn(
                'text-xs font-medium transition-all duration-200',
                getTypeColor(result.type)
              )}>
                <span className="flex items-center gap-1.5">
                  {getTypeIcon(result.type)}
                  {getTypeLabel(result.type)}
                </span>
              </Badge>
              
              {result.featured && (
                <Badge className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 hover:from-amber-100 hover:to-orange-100">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
              
              {result.category && (
                <Badge variant="outline" className="text-xs hover:bg-gray-50 transition-colors">
                  {result.category}
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <Link href={result.url} className="group/title">
              <h3 className={cn(
                'font-semibold text-gray-900 transition-all duration-200',
                'group-hover/title:text-blue-600 group-hover/title:underline',
                'line-clamp-2 leading-tight',
                layout === 'grid' ? 'text-base' : 'text-lg'
              )}>
                {result.title}
              </h3>
            </Link>

            {/* Metrics Row */}
            {showMetrics && (result.views || result.rating) && (
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {result.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{formatViews(result.views)} views</span>
                  </div>
                )}
                {result.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{result.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Cover Image */}
          {result.coverImage && (
            <div className={cn(
              'flex-shrink-0 overflow-hidden rounded-lg',
              'transition-transform duration-300 group-hover:scale-105',
              layout === 'grid' ? 'w-full h-32' : 'w-16 h-16'
            )}>
              <Image
                src={result.coverImage}
                alt={result.title}
                width={layout === 'grid' ? 300 : 64}
                height={layout === 'grid' ? 128 : 64}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        'pt-0 transition-all duration-300',
        layout === 'grid' && 'flex-1 flex flex-col'
      )}>
        <div className={cn(
          'space-y-4',
          layout === 'grid' && 'flex-1'
        )}>
          {/* Description */}
          <p className={cn(
            'text-gray-600 text-sm leading-relaxed',
            layout === 'grid' ? 'line-clamp-3' : 'line-clamp-2'
          )}>
            {result.excerpt || result.description}
          </p>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {result.publishedAt && (
              <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(result.publishedAt)}</span>
              </div>
            )}
            
            {result.readingTime && (
              <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <Clock className="h-3 w-3" />
                <span>{result.readingTime} min read</span>
              </div>
            )}
            
            {result.author && (
              <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <Users className="h-3 w-3" />
                <span>{result.author}</span>
              </div>
            )}
            
            {result.price && (
              <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <Package className="h-3 w-3" />
                <span className="font-medium text-green-600">
                  {result.price.currency} {result.price.min}
                  {result.price.max !== result.price.min && ` - ${result.price.max}`}
                </span>
              </div>
            )}
            
            {result.origin && (
              <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <MapPin className="h-3 w-3" />
                <span>{result.origin}</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-3 w-3 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {result.tags.slice(0, layout === 'grid' ? 2 : 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
                {result.tags.length > (layout === 'grid' ? 2 : 3) && (
                  <span className="text-xs text-gray-500 px-2">
                    +{result.tags.length - (layout === 'grid' ? 2 : 3)} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <div className={cn(
          'pt-4',
          layout === 'grid' && 'mt-auto'
        )}>
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className={cn(
              'gap-2 transition-all duration-200',
              'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300',
              'group-hover:shadow-md'
            )}
          >
            <Link href={result.url}>
              View Details
              <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200"
      >
        Previous
      </Button>
      
      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={cn(
                'transition-all duration-200',
                currentPage === page 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
              )}
            >
              {page}
            </Button>
          )}
        </div>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200"
      >
        Next
      </Button>
    </div>
  );
}

export function SearchResults({
  results,
  loading = false,
  error = null,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
  showPagination = true,
  emptyStateMessage = 'No results found',
  emptyStateDescription = 'Try adjusting your search terms or filters',
  layout = 'list',
  showMetrics = true,
}: SearchResultsProps) {
  if (error) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="text-red-600 mb-2 font-medium">Error loading results</div>
        <div className="text-gray-500 text-sm">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn(
        layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6',
        className
      )}>
        {Array.from({ length: layout === 'grid' ? 6 : 5 }).map((_, index) => (
          <SearchResultSkeleton key={index} layout={layout} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn('text-center py-16', className)}>
        <div className="text-gray-900 text-xl font-semibold mb-3">
          {emptyStateMessage}
        </div>
        <div className="text-gray-500 text-base max-w-md mx-auto">
          {emptyStateDescription}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="text-sm text-gray-600">
          {totalCount > 0 && (
            <span className="font-medium">
              Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalCount)} of {totalCount.toLocaleString()} results
            </span>
          )}
        </div>
      </div>

      {/* Results List/Grid */}
      <div className={cn(
        'animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
        layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
      )}>
        {results.map((result, index) => (
          <SearchResultCard 
            key={result.id} 
            result={result} 
            layout={layout}
            showMetrics={showMetrics}
            index={index}
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && onPageChange && totalPages > 1 && (
        <div className="border-t border-gray-200 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}