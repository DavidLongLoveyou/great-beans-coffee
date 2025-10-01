import { MapPin, Mountain, Coffee, CalendarDays } from 'lucide-react';
import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { getOriginStories, getFeaturedOriginStories } from '@/lib/contentlayer';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { generateMetadata as generateSEOMetadata } from '@/shared/utils/seo-utils';
import { generateOriginStoriesCollectionSchema } from '@/shared/utils/structured-data-utils';

interface OriginStoriesPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: OriginStoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = 'Vietnamese Coffee Origin Stories';
  const description =
    'Discover the unique stories behind Vietnamese coffee regions. Explore the terroir, farming traditions, and distinctive characteristics of coffee from Dak Lak, Da Lat, Kon Tum, and other renowned coffee-growing areas.';

  const keywords = [
    'vietnamese coffee origins',
    'coffee origin stories',
    'vietnamese coffee regions',
    'coffee terroir vietnam',
    'dak lak coffee',
    'da lat coffee',
    'kon tum coffee',
    'cau dat coffee',
    'coffee farm stories',
    'vietnamese coffee heritage',
    'specialty coffee vietnam',
    'coffee growing regions',
    'robusta origin',
    'arabica origin vietnam',
  ];

  return generateSEOMetadata({
    title,
    description,
    keywords,
    locale,
    url: `/${locale}/origin-stories`,
    type: 'website',
    image: '/images/origin-stories-hero.jpg',
  });
}

export default async function OriginStoriesPage({
  params,
}: OriginStoriesPageProps) {
  const { locale } = await params;
  const t = await getTranslations('originStories');
  const tCommon = await getTranslations('common');

  const featuredStories = getFeaturedOriginStories(locale, 3);
  const allStories = getOriginStories(locale);
  const regularStories = allStories.filter(story => !story.featured);

  // Generate structured data for SEO
  const structuredData = generateOriginStoriesCollectionSchema(
    allStories.map(story => ({
      slug: story.slug,
      title: story.title,
      description: story.description,
      region: story.region,
      province: story.province,
      coverImage: story.coverImage,
    })),
    locale
  );

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

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

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-8 flex items-center text-3xl font-semibold text-gray-900">
              <Coffee className="mr-3 h-8 w-8 text-amber-600" />
              {t('featured')}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredStories.map(story => (
                <Card
                  key={story.slug}
                  className="transition-shadow hover:shadow-lg"
                >
                  {story.coverImage && (
                    <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                      <Image
                        src={story.coverImage}
                        alt={story.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {story.region}
                      </div>
                      <div className="flex items-center">
                        <Coffee className="mr-1 h-4 w-4" />
                        {story.coffeeVariety}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">
                      {story.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {story.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        {story.altitude && (
                          <div className="mr-3 flex items-center">
                            <Mountain className="mr-1 h-4 w-4" />
                            {story.altitude}
                          </div>
                        )}
                        <CalendarDays className="mr-1 h-4 w-4" />
                        {new Date(story.publishedAt).toLocaleDateString(locale)}
                      </div>
                      <Link href={story.url}>
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

        {/* All Stories */}
        <section>
          <h2 className="mb-8 text-3xl font-semibold text-gray-900">
            {t('allStories')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {regularStories.map(story => (
              <Card
                key={story.slug}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      {story.region}
                      {story.province && `, ${story.province}`}
                    </div>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">
                      {story.coffeeVariety}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {story.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      {story.altitude && (
                        <div className="flex items-center">
                          <Mountain className="mr-1 h-4 w-4" />
                          {story.altitude}
                        </div>
                      )}
                      {story.readingTime && (
                        <span>{story.readingTime} min read</span>
                      )}
                    </div>
                    <Link href={story.url}>
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
        {allStories.length === 0 && (
          <div className="py-16 text-center">
            <Coffee className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {t('noStories')}
            </h3>
            <p className="text-gray-600">{t('noStoriesDescription')}</p>
          </div>
        )}
      </div>
    </>
  );
}
