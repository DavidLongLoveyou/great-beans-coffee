import {
  CalendarDays,
  User,
  Clock,
  Tag,
  Coffee,
  TrendingUp,
} from 'lucide-react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import {
  getBlogPosts,
  getFeaturedBlogPosts,
  getBlogCategories,
} from '@/lib/contentlayer';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { generateMetadata as generateSEOMetadata } from '@/shared/utils/seo-utils';
import { OptimizedImage } from '@/shared/components/performance/OptimizedImage';
import { LazySection, LazyCardGrid } from '@/shared/components/performance/LazySection';

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { category: categoryFilter } = await searchParams;

  const baseTitle = 'Coffee Industry Insights & News';
  const baseDescription =
    'Stay updated with the latest trends, market analysis, and insights from the Vietnamese coffee industry. Expert articles on coffee export, sustainability, and global market dynamics.';

  const title = categoryFilter ? `${categoryFilter} - ${baseTitle}` : baseTitle;

  const description = categoryFilter
    ? `Explore ${categoryFilter} articles and insights from The Great Beans. ${baseDescription}`
    : baseDescription;

  const keywords = [
    'coffee blog',
    'coffee industry news',
    'vietnamese coffee insights',
    'coffee market analysis',
    'coffee export trends',
    'sustainable coffee',
    'coffee sourcing',
    'robusta coffee news',
    'arabica coffee trends',
    'coffee business insights',
  ];

  if (categoryFilter) {
    keywords.unshift(categoryFilter.toLowerCase());
  }

  return generateSEOMetadata({
    title,
    description,
    keywords,
    locale,
    url: categoryFilter
      ? `/${locale}/blog?category=${categoryFilter}`
      : `/${locale}/blog`,
    type: 'website',
    image: '/images/blog-hero.jpg',
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { locale } = await params;
  const { category: categoryFilter } = await searchParams;

  try {
    const t = await getTranslations('blog');
    const tCommon = await getTranslations('common');
    const featuredPosts = getFeaturedBlogPosts(locale, 3);
    const allPosts = getBlogPosts(locale);
    const categories = getBlogCategories(locale);

    // Filter posts by category if specified
    const filteredPosts = categoryFilter
      ? allPosts.filter(post => post.category === categoryFilter)
      : allPosts.filter(post => !post.featured);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            {t('description')}
          </p>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}/blog`}>
                <Button
                  variant={!categoryFilter ? 'default' : 'outline'}
                  size="sm"
                  className="mb-2"
                >
                  {t('allCategories')}
                </Button>
              </Link>
              {categories.map(category => (
                <Link
                  key={category}
                  href={`/${locale}/blog?category=${category}`}
                >
                  <Button
                    variant={
                      categoryFilter === category ? 'default' : 'outline'
                    }
                    size="sm"
                    className="mb-2"
                  >
                    {category}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Posts */}
        {!categoryFilter && featuredPosts.length > 0 && (
          <LazySection className="mb-16" minHeight="400px">
            <h2 className="mb-8 flex items-center text-3xl font-semibold text-gray-900">
              <TrendingUp className="mr-3 h-8 w-8 text-amber-600" />
              {t('featured')}
            </h2>
            <LazyCardGrid
              cardCount={featuredPosts.length}
              columns={3}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {featuredPosts.map(post => (
                <Card
                  key={post.slug}
                  className="transition-shadow hover:shadow-lg"
                >
                  {post.coverImage && (
                    <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                      <OptimizedImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority={false}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Tag className="mr-1 h-4 w-4" />
                        {post.category}
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {post.readingTime} min
                        </div>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        {post.author && (
                          <div className="mr-3 flex items-center">
                            <User className="mr-1 h-4 w-4" />
                            {post.author}
                          </div>
                        )}
                        <CalendarDays className="mr-1 h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString(locale)}
                      </div>
                      <Link href={post.url}>
                        <Button variant="outline" size="sm">
                          {tCommon('readMore')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </LazyCardGrid>
          </LazySection>
        )}

        {/* All Posts */}
        <LazySection minHeight="600px">
          <h2 className="mb-8 text-3xl font-semibold text-gray-900">
            {categoryFilter ? `${categoryFilter} ${t('posts')}` : t('allPosts')}
          </h2>
          <LazyCardGrid
            cardCount={filteredPosts.length}
            columns={2}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {filteredPosts.map(post => (
              <Card
                key={post.slug}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="mr-1 h-4 w-4" />
                      {post.category}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString(locale)}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      {post.author && (
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {post.author}
                        </div>
                      )}
                      {post.readingTime && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {post.readingTime} min
                        </div>
                      )}
                    </div>
                    <Link href={post.url}>
                      <Button variant="outline" size="sm">
                        {tCommon('readMore')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </LazyCardGrid>
        </LazySection>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-16 text-center">
            <Coffee className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {categoryFilter ? t('noPostsInCategory') : t('noPosts')}
            </h3>
            <p className="text-gray-600">
              {categoryFilter
                ? t('noPostsInCategoryDescription')
                : t('noPostsDescription')}
            </p>
            {categoryFilter && (
              <Link href={`/${locale}/blog`} className="mt-4 inline-block">
                <Button variant="outline">{t('viewAllPosts')}</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Blog</h1>
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }
}
