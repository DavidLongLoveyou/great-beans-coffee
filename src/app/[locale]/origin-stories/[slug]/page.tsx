import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getOriginStoryBySlug, getOriginStories } from '@/lib/contentlayer';
import { MDXContent } from '@/presentation/components/MDXContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { CalendarDays, MapPin, Coffee, Mountain, ArrowLeft, User, Clock } from 'lucide-react';

interface OriginStoryPageProps {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const stories = getOriginStories('en');
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export default function OriginStoryPage({ params: { locale, slug } }: OriginStoryPageProps) {
  const t = useTranslations('originStories');
  const tCommon = useTranslations('common');
  
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
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
            <img 
              src={story.coverImage} 
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {story.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {story.description}
          </p>
          
          {story.author && (
            <div className="flex items-center text-gray-600">
              <User className="mr-2 h-4 w-4" />
              <span>{tCommon('by')} {story.author}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <MDXContent code={story.body.code} />
        </div>
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            {t('relatedStories')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedStories.map((relatedStory) => (
              <Card key={relatedStory.slug} className="hover:shadow-md transition-shadow">
                {relatedStory.coverImage && (
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={relatedStory.coverImage} 
                      alt={relatedStory.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {relatedStory.region}
                    </div>
                    <div className="flex items-center">
                      <Coffee className="mr-1 h-4 w-4" />
                      {relatedStory.coffeeVariety}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{relatedStory.title}</CardTitle>
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