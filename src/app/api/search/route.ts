import { NextRequest, NextResponse } from 'next/server';

import { type Locale } from '@/i18n';
import { ContentManager } from '@/lib/contentlayer';
import { trackSearchQuery } from '@/shared/utils/seo-monitoring';

export interface SearchParams {
  q?: string;
  type?: 'all' | 'blog' | 'market-reports' | 'services' | 'products';
  category?: string;
  locale?: Locale;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  items: Array<{
    id: string;
    type: 'blog' | 'market-report' | 'service' | 'product';
    title: string;
    description: string;
    excerpt?: string | undefined;
    url: string;
    publishedAt?: string | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    coverImage?: string | undefined;
    readingTime?: number | undefined;
    featured?: boolean | undefined;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  query: string;
  filters: {
    type?: string | undefined;
    category?: string | undefined;
    locale: Locale;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';
    const type = (searchParams.get('type') as SearchParams['type']) || 'all';
    const category = searchParams.get('category') || undefined;
    const locale = (searchParams.get('locale') as Locale) || 'en';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
    const sortBy =
      (searchParams.get('sortBy') as SearchParams['sortBy']) || 'relevance';
    const sortOrder =
      (searchParams.get('sortOrder') as SearchParams['sortOrder']) || 'desc';

    // Validate parameters
    if (page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    // If no query provided, return empty results
    if (!query.trim()) {
      const emptyResult: SearchResult = {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        query: '',
        filters: { type, category, locale },
      };
      return NextResponse.json(emptyResult);
    }

    // Search content using ContentManager
    let searchResults = ContentManager.searchContent(locale, query);

    // Filter by type if specified
    if (type !== 'all') {
      const typeMap: Record<string, string[]> = {
        blog: ['blog'],
        'market-reports': ['market-report'],
        services: ['service'],
        products: ['product'],
      };

      const allowedTypes = typeMap[type] || [];
      searchResults = searchResults.filter(item => {
        // Determine item type based on URL pattern
        if (item.url.includes('/blog/')) return allowedTypes.includes('blog');
        if (item.url.includes('/market-reports/'))
          return allowedTypes.includes('market-report');
        if (item.url.includes('/services/'))
          return allowedTypes.includes('service');
        if (item.url.includes('/products/'))
          return allowedTypes.includes('product');
        return false;
      });
    }

    // Filter by category if specified
    if (category) {
      searchResults = searchResults.filter(
        item => item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort results
    searchResults.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.publishedAt || 0).getTime();
          const dateB = new Date(b.publishedAt || 0).getTime();
          comparison = dateA - dateB;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'relevance':
        default:
          // Simple relevance scoring based on title match
          const titleMatchA = a.title
            .toLowerCase()
            .includes(query.toLowerCase())
            ? 1
            : 0;
          const titleMatchB = b.title
            .toLowerCase()
            .includes(query.toLowerCase())
            ? 1
            : 0;
          comparison = titleMatchB - titleMatchA;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Calculate pagination
    const total = searchResults.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    // Transform results to match API format
    const items = paginatedResults.map(item => {
      // Determine type from URL
      let itemType: 'blog' | 'market-report' | 'service' | 'product' = 'blog';
      if (item.url.includes('/market-reports/')) itemType = 'market-report';
      else if (item.url.includes('/services/')) itemType = 'service';
      else if (item.url.includes('/products/')) itemType = 'product';

      return {
        id: item.slug,
        type: itemType,
        title: item.title,
        description: item.description,
        excerpt: item.excerpt,
        url: item.url,
        publishedAt: item.publishedAt,
        category: item.category,
        tags: item.tags,
        coverImage: item.coverImage,
        readingTime: item.readingTime,
        featured: item.featured,
      };
    });

    const result: SearchResult = {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
      query,
      filters: { type, category, locale },
    };

    // Track search query for analytics
    trackSearchQuery(query, total, locale);

    return NextResponse.json(result);
  } catch (error) {
    // Log error for monitoring (replace with proper logging service in production)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
