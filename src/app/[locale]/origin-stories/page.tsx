import { useTranslations } from 'next-intl';
import { getOriginStories, getFeaturedOriginStories } from '@/lib/contentlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { CalendarDays, MapPin, Coffee, Mountain } from 'lucide-react';

interface OriginStoriesPageProps {
  params: { locale: Locale };
}

export default function OriginStoriesPage({ params: { locale } }: OriginStoriesPageProps) {
  const t = useTranslations('originStories');
  const tCommon = useTranslations('common');
  
  const featuredStories = getFeaturedOriginStories(locale, 3);
  const allStories = getOriginStories(locale);
  const regularStories = allStories.filter(story => !story.featured);

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

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 flex items-center">
            <Coffee className="mr-3 h-8 w-8 text-amber-600" />
            {t('featured')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStories.map((story) => (
              <Card key={story.slug} className="hover:shadow-lg transition-shadow">
                {story.coverImage && (
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={story.coverImage} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {story.region}
                    </div>
                    <div className="flex items-center">
                      <Coffee className="mr-1 h-4 w-4" />
                      {story.coffeeVariety}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {story.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      {story.altitude && (
                        <div className="flex items-center mr-3">
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
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          {t('allStories')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularStories.map((story) => (
            <Card key={story.slug} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    {story.region}
                    {story.province && `, ${story.province}`}
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
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
                  <div className="flex items-center text-sm text-gray-500 space-x-3">
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
        <div className="text-center py-16">
          <Coffee className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('noStories')}
          </h3>
          <p className="text-gray-600">
            {t('noStoriesDescription')}
          </p>
        </div>
      )}
    </div>
  );
}