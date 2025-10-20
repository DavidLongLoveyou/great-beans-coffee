import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { ClusterArticleCard } from '@/components/clusters/ClusterArticleCard';
import { ClusterProductCard } from '@/components/clusters/ClusterProductCard';
import { ClusterServiceCard } from '@/components/clusters/ClusterServiceCard';
import { getClusterData } from '@/lib/cluster-data';
import { SEOHead } from '@/presentation/components/seo/SEOHead';
import { CoffeeButton } from '@/shared/components/design-system/Button';
import { HeroSection } from '@/shared/components/design-system/Layout';
import { ContentContainer } from '@/shared/components/design-system/Layout';
import { SectionHeading } from '@/shared/components/design-system/Typography/Heading';
import {
  generateOrganizationSchema,
  generateServiceSchema,
} from '@/shared/utils/seo-utils';

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
  const serviceSchema = generateServiceSchema({
    name: cluster.title,
    description: cluster.description,
    serviceType: cluster.keywords.join(', '),
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
      <HeroSection className="bg-gradient-to-r from-forest-900 to-forest-700 py-20 text-white">
        <ContentContainer>
          <div className="mx-auto max-w-4xl text-center">
            <SectionHeading size="xl" className="mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-400 bg-clip-text text-transparent">
              {cluster.title}
            </SectionHeading>
            <p className="mb-8 text-xl leading-relaxed bg-gradient-to-r from-gold-200 via-gold-100 to-gold-300 bg-clip-text text-transparent">
              {cluster.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CoffeeButton variant="forest" size="lg">{t('requestQuote')}</CoffeeButton>
              <CoffeeButton
                size="lg"
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-forest-900 font-semibold shadow-lg shadow-gold-500/25 transition-all duration-300 hover:from-gold-400 hover:to-gold-500 hover:shadow-xl hover:shadow-gold-500/40 border-0"
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
            <SectionHeading size="xl" className="mb-8 text-center">
              {t('relatedProducts')}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <SectionHeading size="xl" className="mb-8 text-center">
              {t('relatedServices')}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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
            <SectionHeading size="xl" className="mb-8 text-center">
              {t('relatedArticles')}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <section className="bg-forest-800 py-16 text-white">
        <ContentContainer>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading size="xl" className="mb-6 text-white">
              {t('cta.title')}
            </SectionHeading>
            <p className="mb-8 text-xl text-white">
              {cluster.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CoffeeButton variant="forest" size="lg">{t('cta.primaryAction')}</CoffeeButton>
              <CoffeeButton
                size="lg"
                className="border-2 border-white bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-forest-900 hover:shadow-lg"
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
