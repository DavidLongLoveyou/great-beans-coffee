import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

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

async function getContentStats() {
  const contentTypes = ['blog', 'market-report', 'origin-story', 'service'];
  const locales = ['en', 'es', 'fr', 'pt'];
  
  const stats = {
    overview: {
      totalContent: 0,
      publishedContent: 0,
      draftContent: 0,
      archivedContent: 0,
      featuredContent: 0,
    },
    byType: {} as Record<string, any>,
    byLocale: {} as Record<string, any>,
    byStatus: {
      draft: 0,
      published: 0,
      archived: 0,
    },
    byAuthor: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    recentActivity: [] as any[],
    contentHealth: {
      withImages: 0,
      withoutImages: 0,
      withSEO: 0,
      withoutSEO: 0,
      averageWordCount: 0,
      totalWordCount: 0,
    },
    publishingTrends: {
      thisMonth: 0,
      lastMonth: 0,
      thisYear: 0,
      lastYear: 0,
    },
  };
  
  const allContent = [];
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisYear = new Date(now.getFullYear(), 0, 1);
  const lastYear = new Date(now.getFullYear() - 1, 0, 1);
  
  // Initialize type and locale stats
  for (const type of contentTypes) {
    stats.byType[type] = {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
      featured: 0,
    };
  }
  
  for (const locale of locales) {
    stats.byLocale[locale] = {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
      featured: 0,
    };
  }
  
  // Collect all content
  for (const contentType of contentTypes) {
    for (const locale of locales) {
      try {
        const contentDir = getContentDirectory(contentType, locale);
        const files = await fs.readdir(contentDir);
        
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const filePath = path.join(contentDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data: metadata, content } = matter(fileContent);
            const fileStat = await fs.stat(filePath);
            
            const contentItem = {
              id: `${contentType}-${locale}-${file.replace('.mdx', '')}`,
              type: contentType,
              locale,
              filename: file,
              metadata: {
                ...metadata,
                slug: metadata.slug || file.replace('.mdx', ''),
              },
              content,
              stats: {
                wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
                lastModified: fileStat.mtime.toISOString(),
                size: fileStat.size,
              },
            };
            
            allContent.push(contentItem);
            
            // Update overview stats
            stats.overview.totalContent++;
            
            const status = metadata.status || 'draft';
            if (status === 'published') stats.overview.publishedContent++;
            else if (status === 'draft') stats.overview.draftContent++;
            else if (status === 'archived') stats.overview.archivedContent++;
            
            if (metadata.featured) stats.overview.featuredContent++;
            
            // Update by type stats
            stats.byType[contentType].total++;
            stats.byType[contentType][status]++;
            if (metadata.featured) stats.byType[contentType].featured++;
            
            // Update by locale stats
            stats.byLocale[locale].total++;
            stats.byLocale[locale][status]++;
            if (metadata.featured) stats.byLocale[locale].featured++;
            
            // Update by status stats
            stats.byStatus[status as keyof typeof stats.byStatus]++;
            
            // Update by author stats
            if (metadata.author) {
              stats.byAuthor[metadata.author] = (stats.byAuthor[metadata.author] || 0) + 1;
            }
            
            // Update by category stats
            if (metadata.category) {
              stats.byCategory[metadata.category] = (stats.byCategory[metadata.category] || 0) + 1;
            }
            
            // Update content health stats
            stats.contentHealth.totalWordCount += contentItem.stats.wordCount;
            
            if (metadata.coverImage) {
              stats.contentHealth.withImages++;
            } else {
              stats.contentHealth.withoutImages++;
            }
            
            if (metadata.seoTitle && metadata.seoDescription) {
              stats.contentHealth.withSEO++;
            } else {
              stats.contentHealth.withoutSEO++;
            }
            
            // Update publishing trends
            const publishDate = new Date(metadata.publishedAt || metadata.createdAt || fileStat.mtime);
            
            if (publishDate >= thisMonth) {
              stats.publishingTrends.thisMonth++;
            } else if (publishDate >= lastMonth && publishDate < thisMonth) {
              stats.publishingTrends.lastMonth++;
            }
            
            if (publishDate >= thisYear) {
              stats.publishingTrends.thisYear++;
            } else if (publishDate >= lastYear && publishDate < thisYear) {
              stats.publishingTrends.lastYear++;
            }
          }
        }
      } catch (error) {
        console.warn(`Could not read directory for ${contentType}/${locale}:`, error);
      }
    }
  }
  
  // Calculate average word count
  if (stats.overview.totalContent > 0) {
    stats.contentHealth.averageWordCount = Math.round(
      stats.contentHealth.totalWordCount / stats.overview.totalContent
    );
  }
  
  // Get recent activity (last 10 modified items)
  stats.recentActivity = allContent
    .sort((a, b) => new Date(b.stats.lastModified).getTime() - new Date(a.stats.lastModified).getTime())
    .slice(0, 10)
    .map(item => ({
      id: item.id,
      type: item.type,
      locale: item.locale,
      title: item.metadata.title,
      status: item.metadata.status,
      author: item.metadata.author,
      lastModified: item.stats.lastModified,
      action: 'modified', // Could be enhanced to track actual actions
    }));
  
  // Sort authors and categories by count
  const sortedAuthors = Object.entries(stats.byAuthor)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  
  const sortedCategories = Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  
  stats.byAuthor = Object.fromEntries(sortedAuthors);
  stats.byCategory = Object.fromEntries(sortedCategories);
  
  return stats;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const locale = searchParams.get('locale');
    const timeframe = searchParams.get('timeframe') || 'all'; // all, month, year
    
    const stats = await getContentStats();
    
    // Filter stats if specific type or locale requested
    let filteredStats = stats;
    
    if (type && stats.byType[type]) {
      filteredStats = {
        ...stats,
        overview: {
          totalContent: stats.byType[type].total,
          publishedContent: stats.byType[type].published,
          draftContent: stats.byType[type].draft,
          archivedContent: stats.byType[type].archived,
          featuredContent: stats.byType[type].featured,
        },
        recentActivity: stats.recentActivity.filter(item => item.type === type),
      };
    }
    
    if (locale && stats.byLocale[locale]) {
      filteredStats = {
        ...filteredStats,
        overview: {
          totalContent: stats.byLocale[locale].total,
          publishedContent: stats.byLocale[locale].published,
          draftContent: stats.byLocale[locale].draft,
          archivedContent: stats.byLocale[locale].archived,
          featuredContent: stats.byLocale[locale].featured,
        },
        recentActivity: filteredStats.recentActivity.filter(item => item.locale === locale),
      };
    }
    
    return NextResponse.json({
      success: true,
      data: {
        stats: filteredStats,
        filters: {
          type,
          locale,
          timeframe,
        },
        generatedAt: new Date().toISOString(),
        summary: {
          totalContent: filteredStats.overview.totalContent,
          publishedPercentage: filteredStats.overview.totalContent > 0 
            ? Math.round((filteredStats.overview.publishedContent / filteredStats.overview.totalContent) * 100)
            : 0,
          featuredPercentage: filteredStats.overview.totalContent > 0
            ? Math.round((filteredStats.overview.featuredContent / filteredStats.overview.totalContent) * 100)
            : 0,
          averageWordCount: filteredStats.contentHealth.averageWordCount,
          topAuthor: Object.keys(filteredStats.byAuthor)[0] || null,
          topCategory: Object.keys(filteredStats.byCategory)[0] || null,
          monthlyGrowth: stats.publishingTrends.lastMonth > 0
            ? Math.round(((stats.publishingTrends.thisMonth - stats.publishingTrends.lastMonth) / stats.publishingTrends.lastMonth) * 100)
            : 0,
        },
      },
    });
  } catch (error) {
    console.error('Error generating content stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content statistics' },
      { status: 500 }
    );
  }
}