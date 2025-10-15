import { type Metadata } from 'next';
import { Coffee, Users, Award, Globe, Leaf, Heart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { Button } from '@/presentation/components/ui';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale,
    namespace: 'about',
  });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const _t = await getTranslations({
    locale: locale,
    namespace: 'about',
  });
  const _nav = await getTranslations({
    locale: locale,
    namespace: 'navigation',
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-forest-50 to-emerald-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4">
                <Coffee className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              About The Great Beans
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Connecting global markets with premium Vietnamese coffee since
              2010. We are passionate about delivering exceptional quality and
              building lasting partnerships.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href={`/${locale}/contact`}>Get in Touch</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/products`}>
                  View Our Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Our Story
              </h2>
              <p className="text-lg text-forest-600">
                From humble beginnings to global partnerships
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <p className="text-lg text-forest-700">
                  Founded in 2010 in the heart of Vietnam&rsquo;s coffee region,
                  The Great Beans began as a small family business with a big
                  vision: to share the exceptional quality of Vietnamese coffee
                  with the world.
                </p>
                <p className="text-lg text-forest-700">
                  Today, we are a leading coffee export company, working
                  directly with local farmers and cooperatives to source the
                  finest Robusta and Arabica beans. Our commitment to quality,
                  sustainability, and fair trade practices has earned us
                  partnerships with distributors and roasters across 40+
                  countries.
                </p>
                <p className="text-lg text-forest-700">
                  Every bean tells a story of dedication, from the careful
                  cultivation in Vietnam&rsquo;s highland regions to the
                  meticulous processing that preserves the unique
                  characteristics that make Vietnamese coffee exceptional.
                </p>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-100 to-forest-100 p-8">
                  <div className="flex h-full flex-col justify-center space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600">
                        14+
                      </div>
                      <div className="text-forest-600">Years of Excellence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600">
                        40+
                      </div>
                      <div className="text-forest-600">Countries Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600">
                        500+
                      </div>
                      <div className="text-forest-600">Partner Farmers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Our Values
              </h2>
              <p className="text-lg text-forest-600">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Quality Excellence
                </h3>
                <p className="text-forest-600">
                  We maintain the highest standards in every step of our
                  process, from farm to export, ensuring consistent premium
                  quality.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Sustainability
                </h3>
                <p className="text-forest-600">
                  Environmental responsibility and sustainable farming practices
                  are at the core of our operations and partnerships.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Heart className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Fair Partnership
                </h3>
                <p className="text-forest-600">
                  We believe in fair trade and building long-term relationships
                  that benefit farmers, partners, and communities.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Globe className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Global Reach
                </h3>
                <p className="text-forest-600">
                  Connecting Vietnamese coffee culture with global markets while
                  respecting local traditions and practices.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Team Excellence
                </h3>
                <p className="text-forest-600">
                  Our experienced team combines deep local knowledge with
                  international expertise to serve our global partners.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Coffee className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Coffee Passion
                </h3>
                <p className="text-forest-600">
                  Every decision we make is driven by our genuine passion for
                  coffee and commitment to excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Ready to Partner with Us?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Join hundreds of satisfied partners worldwide who trust The Great
              Beans for their premium Vietnamese coffee needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href={`/${locale}/contact`}>
                  Start Partnership
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/quote`}>Request Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
