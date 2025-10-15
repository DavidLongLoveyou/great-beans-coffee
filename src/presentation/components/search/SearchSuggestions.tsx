'use client';

import {
  Search,
  TrendingUp,
  Clock,
  Hash,
  ArrowRight,
  Sparkles,
  Flame,
  Star as _Star,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { cn } from '@/shared/utils/cn';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'trending' | 'category' | 'tag';
  count?: number;
  url?: string;
  description?: string;
}

export interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  recentSearches?: string[];
  popularSearches?: string[];
  trendingTopics?: string[];
  categories?: Array<{ name: string; count: number; url: string }>;
  tags?: Array<{ name: string; count: number; url: string }>;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  onSearchClick?: (query: string) => void;
  loading?: boolean;
  className?: string;
  maxItems?: number;
  showCategories?: boolean;
  showTags?: boolean;
  showRecent?: boolean;
  showPopular?: boolean;
  showTrending?: boolean;
  variant?: 'default' | 'compact';
}

function SuggestionSkeleton({
  variant = 'default',
}: {
  variant?: 'default' | 'compact';
}) {
  return (
    <div
      className={cn(
        'flex animate-pulse items-center gap-3',
        variant === 'compact' ? 'p-2' : 'p-3'
      )}
    >
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        {variant === 'default' && <Skeleton className="h-3 w-1/2" />}
      </div>
      <Skeleton className="h-5 w-8" />
    </div>
  );
}

function SuggestionItem({
  suggestion,
  onClick,
  variant = 'default',
  index = 0,
}: {
  suggestion: SearchSuggestion;
  onClick?: (suggestion: SearchSuggestion) => void | undefined;
  variant?: 'default' | 'compact';
  index?: number;
}) {
  const getIcon = () => {
    switch (suggestion.type) {
      case 'recent':
        return (
          <Clock className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600" />
        );
      case 'popular':
        return (
          <Flame className="h-4 w-4 text-orange-500 transition-colors group-hover:text-orange-600" />
        );
      case 'trending':
        return (
          <TrendingUp className="h-4 w-4 text-red-500 transition-colors group-hover:text-red-600" />
        );
      case 'category':
        return (
          <Hash className="h-4 w-4 text-green-500 transition-colors group-hover:text-green-600" />
        );
      case 'tag':
        return (
          <Hash className="h-4 w-4 text-purple-500 transition-colors group-hover:text-purple-600" />
        );
      default:
        return (
          <Search className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
        );
    }
  };

  const getTypeColor = () => {
    switch (suggestion.type) {
      case 'popular':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case 'trending':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      case 'category':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'tag':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(suggestion);
    }
  };

  const content = (
    <div
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-lg transition-all duration-200 ease-out',
        'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30',
        'hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-sm',
        'border border-transparent hover:border-blue-200/50',
        'animate-in fade-in-0 slide-in-from-left-2',
        variant === 'compact' ? 'p-2' : 'p-3'
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animationDuration: '300ms',
      }}
    >
      <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
        {getIcon()}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'truncate font-medium text-gray-900 transition-colors duration-200',
            'group-hover:text-blue-700',
            variant === 'compact' ? 'text-sm' : 'text-sm'
          )}
        >
          {suggestion.text}
        </div>
        {variant === 'default' && suggestion.description && (
          <div className="truncate text-xs text-gray-500 transition-colors group-hover:text-gray-600">
            {suggestion.description}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {suggestion.count && (
          <Badge
            className={cn(
              'text-xs font-medium transition-all duration-200',
              getTypeColor()
            )}
          >
            {suggestion.count.toLocaleString()}
          </Badge>
        )}
        <ArrowRight className="h-3 w-3 text-gray-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-500" />
      </div>
    </div>
  );

  if (suggestion.url) {
    return (
      <Link href={suggestion.url} onClick={handleClick} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className="w-full text-left">
      {content}
    </button>
  );
}

function SuggestionSection({
  title,
  icon,
  items,
  onItemClick,
  maxItems = 5,
  variant = 'default',
  sectionIndex = 0,
}: {
  title: string;
  icon: React.ReactNode;
  items: SearchSuggestion[];
  onItemClick?: (suggestion: SearchSuggestion) => void;
  maxItems?: number;
  variant?: 'default' | 'compact';
  sectionIndex?: number;
}) {
  if (items.length === 0) return null;

  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-out',
        'hover:shadow-md hover:shadow-gray-200/50',
        'border-gray-200 hover:border-gray-300',
        'animate-in fade-in-0 slide-in-from-bottom-4'
      )}
      style={{
        animationDelay: `${sectionIndex * 100}ms`,
        animationDuration: '400ms',
      }}
    >
      <CardHeader
        className={cn(
          'transition-all duration-200',
          variant === 'compact' ? 'px-3 pb-2 pt-3' : 'pb-3'
        )}
      >
        <CardTitle
          className={cn(
            'flex items-center gap-2 font-semibold text-gray-800',
            variant === 'compact' ? 'text-sm' : 'text-sm'
          )}
        >
          <span className="transition-transform duration-200 hover:scale-110">
            {icon}
          </span>
          {title}
          {items.length > maxItems && (
            <Badge variant="outline" className="ml-auto text-xs">
              {items.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          'transition-all duration-200',
          variant === 'compact' ? 'px-3 pb-3 pt-0' : 'pt-0'
        )}
      >
        <div className="space-y-1">
          {items.slice(0, maxItems).map((item, index) => (
            <SuggestionItem
              key={item.id}
              suggestion={item}
              variant={variant}
              index={index}
              {...(onItemClick && { onClick: onItemClick })}
            />
          ))}
        </div>
        {items.length > maxItems && (
          <div className="mt-3 border-t border-gray-100 pt-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'text-xs transition-all duration-200',
                'hover:bg-blue-50 hover:text-blue-700',
                'group'
              )}
            >
              <span>View all {items.length} items</span>
              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SearchSuggestions({
  suggestions,
  recentSearches = [],
  popularSearches = [],
  trendingTopics = [],
  categories = [],
  tags = [],
  onSuggestionClick,
  onSearchClick,
  loading = false,
  className,
  maxItems = 5,
  showCategories = true,
  showTags = true,
  showRecent = true,
  showPopular = true,
  showTrending = true,
  variant = 'default',
}: SearchSuggestionsProps) {
  // Convert arrays to suggestion objects
  const recentSuggestions: SearchSuggestion[] = recentSearches.map(search => ({
    id: `recent-${search.replace(/\s+/g, '-').toLowerCase()}`,
    text: search,
    type: 'recent',
  }));

  const popularSuggestions: SearchSuggestion[] = popularSearches.map(
    search => ({
      id: `popular-${search.replace(/\s+/g, '-').toLowerCase()}`,
      text: search,
      type: 'popular',
    })
  );

  const trendingSuggestions: SearchSuggestion[] = trendingTopics.map(topic => ({
    id: `trending-${topic.replace(/\s+/g, '-').toLowerCase()}`,
    text: topic,
    type: 'trending',
  }));

  const categorySuggestions: SearchSuggestion[] = categories.map(category => ({
    id: `category-${category.name.replace(/\s+/g, '-').toLowerCase()}`,
    text: category.name,
    type: 'category',
    count: category.count,
    url: category.url,
    description: `${category.count} items`,
  }));

  const tagSuggestions: SearchSuggestion[] = tags.map(tag => ({
    id: `tag-${tag.name.replace(/\s+/g, '-').toLowerCase()}`,
    text: tag.name,
    type: 'tag',
    count: tag.count,
    url: tag.url,
    description: `${tag.count} items`,
  }));

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
    if (onSearchClick && !suggestion.url) {
      onSearchClick(suggestion.text);
    }
  };

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <Card className="animate-pulse">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, _index) => (
                <SuggestionSkeleton key={`skeleton-1-${Math.random()}`} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, _index) => (
                <SuggestionSkeleton key={`skeleton-2-${Math.random()}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  let sectionIndex = 0;

  return (
    <div
      className={cn('space-y-4 duration-500 animate-in fade-in-0', className)}
    >
      {/* Custom Suggestions */}
      {suggestions.length > 0 && (
        <SuggestionSection
          title="Suggestions"
          icon={<Sparkles className="h-4 w-4 text-blue-500" />}
          items={suggestions}
          onItemClick={handleSuggestionClick}
          maxItems={maxItems}
          variant={variant}
          sectionIndex={sectionIndex++}
        />
      )}

      {/* Recent Searches */}
      {showRecent && recentSuggestions.length > 0 && (
        <SuggestionSection
          title="Recent Searches"
          icon={<Clock className="h-4 w-4 text-gray-500" />}
          items={recentSuggestions}
          onItemClick={handleSuggestionClick}
          maxItems={maxItems}
          variant={variant}
          sectionIndex={sectionIndex++}
        />
      )}

      {/* Popular Searches */}
      {showPopular && popularSuggestions.length > 0 && (
        <SuggestionSection
          title="Popular Searches"
          icon={<Flame className="h-4 w-4 text-orange-500" />}
          items={popularSuggestions}
          onItemClick={handleSuggestionClick}
          maxItems={maxItems}
          variant={variant}
          sectionIndex={sectionIndex++}
        />
      )}

      {/* Trending Topics */}
      {showTrending && trendingSuggestions.length > 0 && (
        <SuggestionSection
          title="Trending Topics"
          icon={<TrendingUp className="h-4 w-4 text-red-500" />}
          items={trendingSuggestions}
          onItemClick={handleSuggestionClick}
          maxItems={maxItems}
          variant={variant}
          sectionIndex={sectionIndex++}
        />
      )}

      {/* Categories */}
      {showCategories && categorySuggestions.length > 0 && (
        <SuggestionSection
          title="Browse by Category"
          icon={<Hash className="h-4 w-4 text-green-500" />}
          items={categorySuggestions}
          onItemClick={handleSuggestionClick}
          maxItems={maxItems}
          variant={variant}
          sectionIndex={sectionIndex++}
        />
      )}

      {/* Tags */}
      {showTags && tagSuggestions.length > 0 && (
        <SuggestionSection
          title="Popular Tags"
          icon={<Hash className="h-4 w-4 text-purple-500" />}
          items={tagSuggestions}
          onItemClick={handleSuggestionClick}
          maxItems={maxItems}
          variant={variant}
          sectionIndex={sectionIndex++}
        />
      )}

      {/* Empty State */}
      {suggestions.length === 0 &&
        recentSuggestions.length === 0 &&
        popularSuggestions.length === 0 &&
        trendingSuggestions.length === 0 &&
        categorySuggestions.length === 0 &&
        tagSuggestions.length === 0 && (
          <Card className="duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
            <CardContent className="pt-6">
              <div className="py-12 text-center">
                <div className="relative">
                  <Search className="mx-auto mb-4 h-12 w-12 text-gray-300 transition-all duration-300 hover:scale-110 hover:text-gray-400" />
                  <div className="absolute -right-1 -top-1">
                    <Sparkles className="h-4 w-4 animate-pulse text-blue-400" />
                  </div>
                </div>
                <div className="mb-2 text-base font-medium text-gray-600">
                  Start typing to see search suggestions
                </div>
                <div className="mx-auto max-w-sm text-sm text-gray-500">
                  Discover coffee products, market insights, and origin stories
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
