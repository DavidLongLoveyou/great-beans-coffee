import {
  CalendarDays,
  User,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
} from '@/components/ui/icons';
import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import FileContentLoader from '@/lib/content-file-loader';

import { SEOHead } from '@/presentation/components/seo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { ServerButton } from '@/presentation/components/ui/server-button';
import { ContentImage } from '@/shared/components/performance/OptimizedImage';
import {
  generateMetadata as generateSEOMetadata,
  generateArticleSchema,
} from '@/shared/utils/seo-utils';

interface BlogPostPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await FileContentLoader.getBlogPosts('en');
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await FileContentLoader.getBlogPostBySlug(slug, locale);

  if (!post) {
    return generateSEOMetadata({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      noIndex: true,
      locale,
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
    author: post.author || 'Great Beans Coffee',
    section: 'Coffee Industry',
    tags: post.tags || [],
    image: post.coverImage || '/images/blog-default.jpg',
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('blog');
  const tCommon = await getTranslations('common');

  const post = await FileContentLoader.getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = (await FileContentLoader.getBlogPosts(locale))
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  // Generate structured data for the article
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    images: post.coverImage ? [post.coverImage] : ['/images/blog-default.jpg'],
    author: post.author || 'Great Beans Coffee',
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt || post.publishedAt,
    url: `/${locale}/blog/${slug}`,
  });

  const breadcrumbs = [
    { name: 'Home', url: `/${locale}` },
    { name: 'Blog', url: `/${locale}/blog` },
    { name: post.title, url: `/${locale}/blog/${slug}` },
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
            <ServerButton variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToBlog')}
            </ServerButton>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          {post.coverImage && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-gray-200">
              <ContentImage
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                optimizeForLCP={true}
                priority={true}
              />
            </div>
          )}

          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                <Link
                  href={`/${locale}/blog?category=${post.category}`}
                  className="transition-colors hover:text-amber-600"
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

            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              {post.title}
            </h1>

            <p className="mb-6 text-xl text-gray-600">{post.description}</p>

            <div className="flex items-center justify-between">
              {post.author && (
                <div className="flex items-center text-gray-600">
                  <User className="mr-2 h-4 w-4" />
                  <span>
                    {tCommon('by')} {post.author}
                  </span>
                </div>
              )}

              <ServerButton variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                {t('share')}
              </ServerButton>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mx-auto mt-12 max-w-4xl border-t border-gray-200 pt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {t('tags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mx-auto mt-16 max-w-6xl">
            <h2 className="mb-8 text-3xl font-semibold text-gray-900">
              {t('relatedPosts')}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map(relatedPost => (
                <Card
                  key={relatedPost.slug}
                  className="transition-shadow hover:shadow-md"
                >
                  {relatedPost.coverImage && (
                    <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                        unoptimized={relatedPost.coverImage.endsWith('.svg')}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
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
                    <CardTitle className="line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
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
                      <Link href={`/${locale}/blog/${relatedPost.slug}`}>
                        <ServerButton variant="outline" size="sm">
                          {tCommon('readMore')}
                        </ServerButton>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mx-auto mt-16 max-w-4xl rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            {t('newsletterTitle')}
          </h2>
          <p className="mb-6 text-gray-600">{t('newsletterDescription')}</p>
          <div className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <ServerButton className="bg-amber-600 hover:bg-amber-700">
              {t('subscribe')}
            </ServerButton>
          </div>
        </div>
      </div>
    </>
  );
}
