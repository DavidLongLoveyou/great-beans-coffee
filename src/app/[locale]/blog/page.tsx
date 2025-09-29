import { useTranslations } from 'next-intl';
import { getBlogPosts, getFeaturedBlogPosts, getBlogCategories } from '@/lib/contentlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { CalendarDays, User, Clock, Tag, Coffee, TrendingUp } from 'lucide-react';

interface BlogPageProps {
  params: { locale: Locale };
  searchParams: { category?: string };
}

export default function BlogPage({ params: { locale }, searchParams }: BlogPageProps) {
  const t = useTranslations('blog');
  const tCommon = useTranslations('common');
  
  const featuredPosts = getFeaturedBlogPosts(locale, 3);
  const allPosts = getBlogPosts(locale);
  const categories = getBlogCategories(locale);
  
  // Filter posts by category if specified
  const filteredPosts = searchParams.category 
    ? allPosts.filter(post => post.category === searchParams.category)
    : allPosts.filter(post => !post.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/${locale}/blog`}>
              <Button 
                variant={!searchParams.category ? "default" : "outline"} 
                size="sm"
                className="mb-2"
              >
                {t('allCategories')}
              </Button>
            </Link>
            {categories.map((category) => (
              <Link key={category} href={`/${locale}/blog?category=${category}`}>
                <Button 
                  variant={searchParams.category === category ? "default" : "outline"} 
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
      {!searchParams.category && featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-amber-600" />
            {t('featured')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.slug} className="hover:shadow-lg transition-shadow">
                {post.coverImage && (
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
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
                        <div className="flex items-center mr-3">
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
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          {searchParams.category ? `${searchParams.category} ${t('posts')}` : t('allPosts')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.slug} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
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
                  <div className="flex items-center text-sm text-gray-500 space-x-3">
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
        </div>
      </section>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <Coffee className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchParams.category ? t('noPostsInCategory') : t('noPosts')}
          </h3>
          <p className="text-gray-600">
            {searchParams.category 
              ? t('noPostsInCategoryDescription') 
              : t('noPostsDescription')
            }
          </p>
          {searchParams.category && (
            <Link href={`/${locale}/blog`} className="mt-4 inline-block">
              <Button variant="outline">
                {t('viewAllPosts')}
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}