import {
  CalendarDays,
  MapPin,
  Coffee,
  Mountain,
  ArrowLeft,
  User,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { getOriginStoryBySlug, getOriginStories } from '@/lib/contentlayer';
import { MDXContent } from '@/presentation/components/MDXContent';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

interface OriginStoryPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const stories = getOriginStories('en');
  return stories.map(story => ({
    slug: story.slug,
  }));
}

export default async function OriginStoryPage({
  params,
}: OriginStoryPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('originStories');
  const tCommon = await getTranslations('common');

  const story = getOriginStoryBySlug(slug, locale);

  if (!story) {
    notFound();
  }

  const relatedStories = getOriginStories(locale)
    .filter(s => s.slug !== slug && s.region === story.region)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link href={`/${locale}/origin-stories`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToStories')}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        {story.coverImage && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {story.region}
              {story.province && `, ${story.province}`}
            </div>
            <div className="flex items-center">
              <Coffee className="mr-1 h-4 w-4" />
              {story.coffeeVariety}
            </div>
            {story.altitude && (
              <div className="flex items-center">
                <Mountain className="mr-1 h-4 w-4" />
                {story.altitude}
              </div>
            )}
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              {new Date(story.publishedAt).toLocaleDateString(locale)}
            </div>
            {story.readingTime && (
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {story.readingTime} min read
              </div>
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {story.title}
          </h1>

          <p className="mb-6 text-xl text-gray-600">{story.description}</p>

          {story.author && (
            <div className="flex items-center text-gray-600">
              <User className="mr-2 h-4 w-4" />
              <span>
                {tCommon('by')} {story.author}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <MDXContent code={story.body.code} />
        </div>
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="mb-8 text-3xl font-semibold text-gray-900">
            {t('relatedStories')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedStories.map(relatedStory => (
              <Card
                key={relatedStory.slug}
                className="transition-shadow hover:shadow-md"
              >
                {relatedStory.coverImage && (
                  <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                    <Image
                      src={relatedStory.coverImage}
                      alt={relatedStory.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {relatedStory.region}
                    </div>
                    <div className="flex items-center">
                      <Coffee className="mr-1 h-4 w-4" />
                      {relatedStory.coffeeVariety}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">
                    {relatedStory.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {relatedStory.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={relatedStory.url}>
                    <Button variant="outline" size="sm" className="w-full">
                      {tCommon('readMore')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
