import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type Metadata } from 'next';
import { type Locale } from '@/i18n';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/contentlayer';
import { MDXContent } from '@/presentation/components/MDXContent';
import { SEOHead } from '@/presentation/components/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import Link from 'next/link';
import { CalendarDays, User, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { 
  generateMetadata as generateSEOMetadata, 
  generateArticleSchema 
} from '@/shared/utils/seo-utils';

interface BlogPostPageProps {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const posts = getBlogPosts('en');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ 
  params: { locale, slug } 
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(slug, locale);
  
  if (!post) {
    return generateSEOMetadata({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      noIndex: true,
      locale
    });
  }
  
  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    keywords: post.tags || [],
    locale,
    url: `/${locale}/blog/${slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
    author: post.author,
    section: 'Coffee Industry',
    tags: post.tags,
    image: post.image || '/images/blog-default.jpg'
  });
}

export default function BlogPostPage({ params: { locale, slug } }: BlogPostPageProps) {
  const t = useTranslations('blog');
  const tCommon = useTranslations('common');
  
  const post = getBlogPostBySlug(slug, locale);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getBlogPosts(locale)
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  // Generate structured data for the article
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    images: post.image ? [post.image] : ['/images/blog-default.jpg'],
    author: post.author,
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt || post.publishedAt,
    url: `/${locale}/blog/${slug}`
  });

  const breadcrumbs = [
    { name: 'Home', url: `/${locale}` },
    { name: 'Blog', url: `/${locale}/blog` },
    { name: post.title, url: `/${locale}/blog/${slug}` }
  ];

  return (
    <>
      <SEOHead 
        structuredData={articleSchema}
        breadcrumbs={breadcrumbs}
        locale={locale}
        includeOrganization={false}
      />
      <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link href={`/${locale}/blog`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToBlog')}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        {post.coverImage && (
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Tag className="mr-1 h-4 w-4" />
              <Link 
                href={`/${locale}/blog?category=${post.category}`}
                className="hover:text-amber-600 transition-colors"
              >
                {post.category}
              </Link>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString(locale)}
            </div>
            {post.readingTime && (
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {post.readingTime} min read
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {post.description}
          </p>
          
          <div className="flex items-center justify-between">
            {post.author && (
              <div className="flex items-center text-gray-600">
                <User className="mr-2 h-4 w-4" />
                <span>{tCommon('by')} {post.author}</span>
              </div>
            )}
            
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              {t('share')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <MDXContent code={post.body.code} />
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('tags')}</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            {t('relatedPosts')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.slug} className="hover:shadow-md transition-shadow">
                {relatedPost.coverImage && (
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={relatedPost.coverImage} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Tag className="mr-1 h-4 w-4" />
                      {relatedPost.category}
                    </div>
                    {relatedPost.readingTime && (
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {relatedPost.readingTime} min
                      </div>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{relatedPost.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {relatedPost.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {relatedPost.author && (
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {relatedPost.author}
                        </div>
                      )}
                    </div>
                    <Link href={relatedPost.url}>
                      <Button variant="outline" size="sm">
                        {tCommon('readMore')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('newsletterTitle')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('newsletterDescription')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Button className="bg-amber-600 hover:bg-amber-700">
            {t('subscribe')}
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}