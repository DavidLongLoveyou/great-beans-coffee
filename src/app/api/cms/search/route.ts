import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Search schema
const SearchSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['blog', 'market-report', 'origin-story', 'service']).optional(),
  locale: z.enum(['en', 'es', 'fr', 'pt']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  featured: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['relevance', 'date', 'title', 'author']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

function getContentDirectory(type: string, locale: string): string {
  const baseDir = path.join(process.cwd(), 'content');
  
  switch (type) {
    case 'blog':
      return path.join(baseDir, 'blog', locale);
    case 'market-report':
      return path.join(baseDir, 'market-reports', locale);
    case 'origin-story':
      return path.join(baseDir, 'origin-stories', locale);
    case 'service':
      return path.join(baseDir, 'services', locale);
    default:
      throw new Error(`Invalid content type: ${type}`);
  }
}

function calculateRelevanceScore(content: any, query: string): number {
  const queryLower = query.toLowerCase();
  let score = 0;
  
  // Title match (highest weight)
  if (content.metadata.title?.toLowerCase().includes(queryLower)) {
    score += 10;
  }
  
  // Description match
  if (content.metadata.description?.toLowerCase().includes(queryLower)) {
    score += 5;
  }
  
  // Category match
  if (content.metadata.category?.toLowerCase().includes(queryLower)) {
    score += 3;
  }
  
  // Keywords match
  if (content.metadata.keywords?.some((keyword: string) => 
    keyword.toLowerCase().includes(queryLower)
  )) {
    score += 3;
  }
  
  // Content match (lower weight due to potential noise)
  const contentMatches = (content.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
  score += Math.min(contentMatches * 0.5, 5); // Cap content matches at 5 points
  
  // Boost for exact matches
  if (content.metadata.title?.toLowerCase() === queryLower) {
    score += 20;
  }
  
  // Boost for featured content
  if (content.metadata.featured) {
    score += 2;
  }
  
  // Boost for published content
  if (content.metadata.status === 'published') {
    score += 1;
  }
  
  return score;
}

function highlightText(text: string, query: string, maxLength: number = 200): string {
  if (!text || !query) return text?.substring(0, maxLength) || '';
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(queryLower);
  
  if (index === -1) {
    return text.substring(0, maxLength);
  }
  
  // Find a good starting point for the excerpt
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, start + maxLength);
  
  let excerpt = text.substring(start, end);
  
  // Add ellipsis if truncated
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';
  
  // Highlight the query term
  const regex = new RegExp(`(${query})`, 'gi');
  excerpt = excerpt.replace(regex, '<mark>$1</mark>');
  
  return excerpt;
}

async function searchContent(searchParams: z.infer<typeof SearchSchema>) {
  const {
    query,
    type,
    locale,
    status,
    category,
    author,
    featured,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  } = searchParams;
  
  const contentTypes = type ? [type] : ['blog', 'market-report', 'origin-story', 'service'];
  const locales = locale ? [locale] : ['en', 'es', 'fr', 'pt'];
  const allContent = [];
  
  for (const contentType of contentTypes) {
    for (const loc of locales) {
      try {
        const contentDir = getContentDirectory(contentType, loc);
        const files = await fs.readdir(contentDir);
        
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const filePath = path.join(contentDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data: metadata, content } = matter(fileContent);
            
            const contentItem = {
              id: `${contentType}-${loc}-${file.replace('.mdx', '')}`,
              type: contentType,
              locale: loc,
              filename: file,
              metadata: {
                ...metadata,
                slug: metadata.slug || file.replace('.mdx', ''),
              },
              content,
              stats: {
                wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
                lastModified: (await fs.stat(filePath)).mtime.toISOString(),
                size: (await fs.stat(filePath)).size,
              },
            };
            
            // Apply filters
            if (status && metadata.status !== status) continue;
            if (category && metadata.category !== category) continue;
            if (author && metadata.author !== author) continue;
            if (featured !== undefined && metadata.featured !== featured) continue;
            
            // Date range filter
            if (dateFrom || dateTo) {
              const contentDate = new Date(metadata.publishedAt || metadata.createdAt);
              if (dateFrom && contentDate < new Date(dateFrom)) continue;
              if (dateTo && contentDate > new Date(dateTo)) continue;
            }
            
            // Calculate relevance score
            const relevanceScore = calculateRelevanceScore(contentItem, query);
            
            // Only include if there's some relevance
            if (relevanceScore > 0) {
              allContent.push({
                ...contentItem,
                relevanceScore,
                excerpt: highlightText(content, query),
                titleHighlight: highlightText(metadata.title || '', query, 100),
                descriptionHighlight: highlightText(metadata.description || '', query, 200),
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Could not read directory for ${contentType}/${loc}:`, error);
      }
    }
  }
  
  // Sort results
  allContent.sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return sortOrder === 'desc' 
          ? b.relevanceScore - a.relevanceScore
          : a.relevanceScore - b.relevanceScore;
      case 'date':
        const dateA = new Date(a.metadata.publishedAt || a.metadata.createdAt || 0);
        const dateB = new Date(b.metadata.publishedAt || b.metadata.createdAt || 0);
        return sortOrder === 'desc' 
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      case 'title':
        const titleA = a.metadata.title || '';
        const titleB = b.metadata.title || '';
        return sortOrder === 'desc'
          ? titleB.localeCompare(titleA)
          : titleA.localeCompare(titleB);
      case 'author':
        const authorA = a.metadata.author || '';
        const authorB = b.metadata.author || '';
        return sortOrder === 'desc'
          ? authorB.localeCompare(authorA)
          : authorA.localeCompare(authorB);
      default:
        return 0;
    }
  });
  
  return allContent;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const searchData = {
      query: searchParams.get('query') || '',
      type: searchParams.get('type') as any,
      locale: searchParams.get('locale') as any,
      status: searchParams.get('status') as any,
      category: searchParams.get('category'),
      author: searchParams.get('author'),
      featured: searchParams.get('featured') === 'true' ? true : 
                searchParams.get('featured') === 'false' ? false : undefined,
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      sortBy: (searchParams.get('sortBy') as any) || 'relevance',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    };
    
    const validatedData = SearchSchema.parse(searchData);
    
    // Perform search
    const results = await searchContent(validatedData);
    
    // Apply pagination
    const { page, limit } = validatedData;
    const total = results.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    // Generate search suggestions (simple implementation)
    const suggestions = [];
    if (results.length === 0 && validatedData.query.length > 2) {
      // Could implement fuzzy search or suggest similar terms
      suggestions.push(`Try searching for "${validatedData.query.substring(0, -1)}"`);
      suggestions.push('Check your spelling');
      suggestions.push('Try using different keywords');
    }
    
    return NextResponse.json({
      success: true,
      data: {
        results: paginatedResults,
        query: validatedData.query,
        filters: {
          type: validatedData.type,
          locale: validatedData.locale,
          status: validatedData.status,
          category: validatedData.category,
          author: validatedData.author,
          featured: validatedData.featured,
          dateFrom: validatedData.dateFrom,
          dateTo: validatedData.dateTo,
        },
        sorting: {
          sortBy: validatedData.sortBy,
          sortOrder: validatedData.sortOrder,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: endIndex < total,
          hasPrev: page > 1,
        },
        suggestions,
        stats: {
          totalResults: total,
          searchTime: Date.now(), // Could implement actual timing
          topCategories: [...new Set(results.slice(0, 20).map(r => r.metadata.category))].slice(0, 5),
          topAuthors: [...new Set(results.slice(0, 20).map(r => r.metadata.author))].slice(0, 5),
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error performing search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SearchSchema.parse(body);
    
    // Perform search
    const results = await searchContent(validatedData);
    
    // Apply pagination
    const { page, limit } = validatedData;
    const total = results.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      data: {
        results: paginatedResults,
        query: validatedData.query,
        filters: {
          type: validatedData.type,
          locale: validatedData.locale,
          status: validatedData.status,
          category: validatedData.category,
          author: validatedData.author,
          featured: validatedData.featured,
          dateFrom: validatedData.dateFrom,
          dateTo: validatedData.dateTo,
        },
        sorting: {
          sortBy: validatedData.sortBy,
          sortOrder: validatedData.sortOrder,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: endIndex < total,
          hasPrev: page > 1,
        },
        stats: {
          totalResults: total,
          searchTime: Date.now(),
          topCategories: [...new Set(results.slice(0, 20).map(r => r.metadata.category))].slice(0, 5),
          topAuthors: [...new Set(results.slice(0, 20).map(r => r.metadata.author))].slice(0, 5),
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error performing search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}