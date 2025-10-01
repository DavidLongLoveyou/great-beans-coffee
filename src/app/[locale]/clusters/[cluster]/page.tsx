import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { ClusterArticleCard } from '@/components/clusters/ClusterArticleCard';
import { ClusterProductCard } from '@/components/clusters/ClusterProductCard';
import { ClusterServiceCard } from '@/components/clusters/ClusterServiceCard';
import { getClusterData } from '@/lib/cluster-data';
import { CoffeeButton } from '@/shared/components/design-system/Button';
import { HeroSection } from '@/shared/components/design-system/layout';
import { ContentContainer } from '@/shared/components/design-system/layout';
import { SectionHeading } from '@/shared/components/design-system/typography/Heading';
import { SEOHead } from '@/presentation/components/SEO/SEOHead';
import { generateOrganizationSchema, generateB2BServiceSchema } from '@/shared/utils/seo-utils';

// Define available content clusters
const CONTENT_CLUSTERS = {
  'vietnam-robusta-suppliers': {
    title: 'Vietnam Robusta Suppliers',
    description:
      'Premium Vietnamese Robusta coffee suppliers offering Grade 1 and Grade 2 beans with competitive FOB pricing and reliable supply chain.',
    keywords: [
      'vietnam robusta suppliers',
      'robusta coffee exporters',
      'vietnamese coffee beans',
      'grade 1 robusta',
    ],
    targetMarkets: ['Europe', 'North America', 'Asia-Pacific'],
  },
  'specialty-arabica-sourcing': {
    title: 'Specialty Arabica Sourcing',
    description:
      'High-altitude Vietnamese Arabica coffee sourcing with cupping scores 85+ from Dalat and northern regions.',
    keywords: [
      'specialty arabica vietnam',
      'high altitude coffee',
      'vietnamese arabica',
      'specialty coffee sourcing',
    ],
    targetMarkets: [
      'Specialty Roasters',
      'Third Wave Coffee',
      'Premium Brands',
    ],
  },
  'private-label-coffee-manufacturing': {
    title: 'Private Label Coffee Manufacturing',
    description:
      'Complete private label coffee manufacturing services including custom blending, packaging, and brand development.',
    keywords: [
      'private label coffee',
      'oem coffee manufacturing',
      'custom coffee blends',
      'white label coffee',
    ],
    targetMarkets: ['Coffee Brands', 'Distributors', 'Retailers'],
  },
};

interface ClusterPageProps {
  params: Promise<{
    cluster: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: ClusterPageProps): Promise<Metadata> {
  const { cluster: clusterSlug } = await params;
  const cluster =
    CONTENT_CLUSTERS[clusterSlug as keyof typeof CONTENT_CLUSTERS];

  if (!cluster) {
    return {
      title: 'Cluster Not Found',
    };
  }

  return {
    title: `${cluster.title} | The Great Beans`,
    description: cluster.description,
    keywords: cluster.keywords.join(', '),
  };
}

export async function generateStaticParams() {
  return Object.keys(CONTENT_CLUSTERS).map(cluster => ({
    cluster,
  }));
}

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { cluster: clusterSlug, locale } = await params;
  const cluster =
    CONTENT_CLUSTERS[clusterSlug as keyof typeof CONTENT_CLUSTERS];

  if (!cluster) {
    notFound();
  }

  const t = await getTranslations('clusters');

  // Get cluster-specific data
  const clusterData = getClusterData(clusterSlug);

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const serviceSchema = generateB2BServiceSchema({
    name: cluster.title,
    description: cluster.description,
    serviceType: cluster.keywords,
    areaServed: cluster.targetMarkets,
    url: `https://thegreatbeans.com/${locale}/clusters/${clusterSlug}`,
  });

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: cluster.title,
    description: cluster.description,
    url: `https://thegreatbeans.com/${locale}/clusters/${clusterSlug}`,
    mainEntity: serviceSchema,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://thegreatbeans.com/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Solutions',
          item: `https://thegreatbeans.com/${locale}/clusters`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: cluster.title,
          item: `https://thegreatbeans.com/${locale}/clusters/${clusterSlug}`,
        },
      ],
    },
  };

  const structuredData = [organizationSchema, serviceSchema, webPageSchema];

  return (
    <>
      <SEOHead structuredData={structuredData} />
      {/* Hero Section */}
      <HeroSection className="bg-gradient-to-r from-coffee-900 to-coffee-700 py-20 text-white">
        <ContentContainer>
          <div className="mx-auto max-w-4xl text-center">
            <SectionHeading size="xl" className="mb-6 text-white">
              {cluster.title}
            </SectionHeading>
            <p className="mb-8 text-xl leading-relaxed text-coffee-100">
              {cluster.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CoffeeButton size="lg">{t('requestQuote')}</CoffeeButton>
              <CoffeeButton
                size="lg"
                className="border-white text-white hover:bg-white hover:text-coffee-900"
              >
                {t('downloadCatalog')}
              </CoffeeButton>
            </div>
          </div>
        </ContentContainer>
      </HeroSection>

      {/* Related Products */}
      {clusterData.products.length > 0 && (
        <section className="bg-white py-16">
          <ContentContainer>
            <SectionHeading size="2xl" className="mb-8 text-center">
              {t('relatedProducts')}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clusterData.products.map(product => (
                <ClusterProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          </ContentContainer>
        </section>
      )}

      {/* Related Services */}
      {clusterData.services.length > 0 && (
        <section className="bg-gray-50 py-16">
          <ContentContainer>
            <SectionHeading size="2xl" className="mb-8 text-center">
              {t('relatedServices')}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {clusterData.services.map(service => (
                <ClusterServiceCard
                  key={service.id}
                  service={service}
                  locale={locale}
                />
              ))}
            </div>
          </ContentContainer>
        </section>
      )}

      {/* Related Articles */}
      {clusterData.articles.length > 0 && (
        <section className="bg-white py-16">
          <ContentContainer>
            <SectionHeading size="2xl" className="mb-8 text-center">
              {t('relatedArticles')}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clusterData.articles.map(article => (
                <ClusterArticleCard
                  key={article.id}
                  article={article}
                  locale={locale}
                />
              ))}
            </div>
          </ContentContainer>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-coffee-800 py-16 text-white">
        <ContentContainer>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading size="2xl" className="mb-6 text-white">
              {t('cta.title')}
            </SectionHeading>
            <p className="mb-8 text-xl text-coffee-100">
              {t('cta.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CoffeeButton size="lg">{t('cta.primaryAction')}</CoffeeButton>
              <CoffeeButton
                size="lg"
                className="border-white text-white hover:bg-white hover:text-coffee-900"
              >
                {t('cta.secondaryAction')}
              </CoffeeButton>
            </div>
          </div>
        </ContentContainer>
      </section>
    </>
  );
}
