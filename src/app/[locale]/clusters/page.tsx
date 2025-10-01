import { type Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import ClusterNavigation from '@/presentation/components/navigation/ClusterNavigation';
import { Button } from '@/presentation/components/ui';
import { isValidLocale } from '@/shared/utils/locale';
import { SEOHead } from '@/presentation/components/SEO/SEOHead';
import { generateOrganizationSchema } from '@/shared/utils/seo-utils';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  if (!isValidLocale(typedLocale)) {
    return {};
  }

  return {
    title: 'Coffee Solutions & Expertise | The Great Beans',
    description:
      'Discover our specialized coffee solutions: Vietnam Robusta suppliers, specialty Arabica sourcing, and private label manufacturing. Expert solutions for your coffee business needs.',
    keywords:
      'coffee solutions, vietnam robusta suppliers, arabica sourcing, private label coffee, coffee manufacturing, coffee export services',
    openGraph: {
      title: 'Coffee Solutions & Expertise | The Great Beans',
      description:
        'Specialized coffee solutions for global businesses. From premium Robusta sourcing to private label manufacturing.',
      type: 'website',
    },
    alternates: {
      canonical: `/${typedLocale}/clusters`,
      languages: {
        en: '/en/clusters',
        de: '/de/clusters',
        fr: '/fr/clusters',
        es: '/es/clusters',
        it: '/it/clusters',
        ja: '/ja/clusters',
        ko: '/ko/clusters',
        nl: '/nl/clusters',
      },
    },
  };
}

export default async function ClustersPage({ params }: Props) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  if (!isValidLocale(typedLocale)) {
    notFound();
  }

  // Temporarily removed getTranslations to fix i18n issue
  // const t = await getTranslations({
  //   locale: typedLocale,
  //   namespace: 'clusters',
  // });

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Coffee Solutions & Expertise',
    description: 'Specialized coffee solutions for global businesses. From premium Robusta sourcing to private label manufacturing.',
    url: `https://thegreatbeans.com/${typedLocale}/clusters`,
    mainEntity: {
      '@type': 'Service',
      name: 'Coffee Business Solutions',
      description: 'Comprehensive coffee solutions including sourcing, manufacturing, and export services',
      provider: organizationSchema,
      serviceType: ['Coffee Sourcing', 'Private Label Manufacturing', 'Export Services'],
      areaServed: 'Worldwide',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://thegreatbeans.com/${typedLocale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Solutions',
          item: `https://thegreatbeans.com/${typedLocale}/clusters`,
        },
      ],
    },
  };

  const structuredData = [organizationSchema, webPageSchema];

  return (
    <>
      <SEOHead structuredData={structuredData} />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-green-800 md:text-5xl">
            Coffee Solutions & Expertise
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground">
            Discover our specialized coffee solutions designed for global
            businesses. From premium Vietnamese Robusta sourcing to complete
            private label manufacturing, we provide expert solutions tailored to
            your specific needs.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/${locale}/quote`}>Request Quote</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/${locale}/contact`}>Learn About Our Process</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-green-800">
              Our Specialized Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Each solution is backed by years of expertise, direct farm
              partnerships, and a commitment to quality that has earned the
              trust of 500+ global clients.
            </p>
          </div>

          <ClusterNavigation
            locale={typedLocale}
            variant="grid"
            showIcons={true}
            className="mb-16"
          />
        </div>
      </section>

      {/* Why Choose Our Solutions */}
      <section className="bg-green-50 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-green-800">
              Why Choose Our Solutions?
            </h2>
            <p className="text-lg text-muted-foreground">
              Built on decades of experience in Vietnamese coffee export and
              global supply chain management.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                <span className="text-xl font-bold text-white">500+</span>
              </div>
              <h3 className="mb-2 font-semibold">Global Clients</h3>
              <p className="text-sm text-muted-foreground">
                Trusted by importers, roasters, and distributors worldwide
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                <span className="text-xl font-bold text-white">6+</span>
              </div>
              <h3 className="mb-2 font-semibold">Years Experience</h3>
              <p className="text-sm text-muted-foreground">
                Established in 2018 with deep expertise in Vietnamese coffee
                export and quality control
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                <span className="text-xl font-bold text-white">100%</span>
              </div>
              <h3 className="mb-2 font-semibold">Quality Assured</h3>
              <p className="text-sm text-muted-foreground">
                Rigorous testing and quality control at every stage
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                <span className="text-xl font-bold text-white">24/7</span>
              </div>
              <h3 className="mb-2 font-semibold">Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated account management and logistics support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-green-800">
            Ready to Start Your Coffee Partnership?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join 500+ global partners who trust us for their coffee sourcing needs. Get a custom quote today.
          </p>
          <Button asChild size="lg">
            <Link href={`/${locale}/quote`}>Get Started</Link>
          </Button>
        </div>
      </section>
      </div>
    </>
  );
}
