import { type Metadata } from 'next';
import {
  Leaf,
  Heart,
  Users,
  Recycle,
  Award,
  TreePine,
  Droplets,
  Sun,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { type Locale } from '@/i18n';
import { Button } from '@/presentation/components/ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title:
      'Sustainability - Environmental & Social Responsibility - The Great Beans',
    description:
      'Our commitment to sustainable coffee farming, environmental protection, and social responsibility. Learn about our sustainability initiatives and certifications.',
    openGraph: {
      title: 'Sustainability - The Great Beans',
      description:
        'Building a sustainable future for coffee through environmental stewardship and social responsibility.',
      type: 'website',
    },
  };
}

export default async function SustainabilityPage({ params }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <Leaf className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Sustainability
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Building a sustainable future for coffee through environmental
              stewardship, social responsibility, and ethical business
              practices.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Carbon Neutral
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Fair Trade Certified
              </Badge>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800"
              >
                Rainforest Alliance
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Our Sustainability Commitment
              </h2>
              <p className="text-lg text-forest-600">
                We believe that great coffee should not come at the expense of
                our planet or people
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <TreePine className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Environmental
                  </h3>
                  <p className="text-forest-600">
                    Protecting ecosystems, reducing carbon footprint, and
                    promoting sustainable farming practices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-blue-100 p-3">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Social
                  </h3>
                  <p className="text-forest-600">
                    Supporting farming communities, ensuring fair wages, and
                    improving livelihoods.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-purple-100 p-3">
                      <Heart className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Ethical
                  </h3>
                  <p className="text-forest-600">
                    Maintaining transparency, ethical sourcing, and responsible
                    business practices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-amber-100 p-3">
                      <Award className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Quality
                  </h3>
                  <p className="text-forest-600">
                    Delivering premium coffee while maintaining sustainable and
                    responsible standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Initiatives */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Environmental Initiatives
              </h2>
              <p className="text-lg text-forest-600">
                Our comprehensive approach to environmental protection and
                conservation
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Droplets className="h-6 w-6 text-blue-600" />
                    Water Conservation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-forest-600">
                    We implement advanced water management systems to minimize
                    consumption and protect local water resources.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-forest-600">
                        Water recycling and treatment systems
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-forest-600">
                        Efficient irrigation techniques
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-forest-600">
                        Watershed protection programs
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-forest-600">
                        50% reduction in water usage since 2020
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Recycle className="h-6 w-6 text-green-600" />
                    Waste Reduction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-forest-600">
                    Comprehensive waste management and circular economy
                    practices throughout our supply chain.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-forest-600">
                        Coffee pulp composting programs
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-forest-600">
                        Biodegradable packaging materials
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-forest-600">
                        Zero waste to landfill goal
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-forest-600">
                        85% waste diversion rate achieved
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sun className="h-6 w-6 text-amber-600" />
                    Carbon Neutrality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-forest-600">
                    Committed to achieving carbon neutrality through renewable
                    energy, efficiency improvements, and offset programs.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-forest-600">
                        Solar-powered processing facilities
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-forest-600">
                        Energy-efficient equipment upgrades
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-forest-600">
                        Reforestation and carbon offset projects
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-forest-600">
                        30% reduction in carbon emissions
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TreePine className="h-6 w-6 text-green-600" />
                    Biodiversity Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-forest-600">
                    Preserving natural habitats and promoting biodiversity
                    through sustainable farming and conservation practices.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-forest-600">
                        Shade-grown coffee cultivation
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-forest-600">
                        Wildlife corridor preservation
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-forest-600">
                        Native species protection programs
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-forest-600">
                        1,000+ hectares of forest protected
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Social Impact & Community Development
              </h2>
              <p className="text-lg text-forest-600">
                Empowering coffee farming communities and creating positive
                social change
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Fair Trade Practices
                  </h3>
                  <p className="mb-4 text-forest-600">
                    Ensuring fair wages and working conditions for all farmers
                    and workers in our supply chain.
                  </p>
                  <ul className="space-y-2 text-sm text-forest-600">
                    <li>• Premium prices above market rates</li>
                    <li>• Long-term partnership agreements</li>
                    <li>• Direct trade relationships</li>
                    <li>• Transparent pricing structures</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Education & Training
                  </h3>
                  <p className="mb-4 text-forest-600">
                    Providing education and training programs to improve farming
                    techniques and business skills.
                  </p>
                  <ul className="space-y-2 text-sm text-forest-600">
                    <li>• Sustainable farming workshops</li>
                    <li>• Quality improvement training</li>
                    <li>• Financial literacy programs</li>
                    <li>• Youth education initiatives</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Community Health
                  </h3>
                  <p className="mb-4 text-forest-600">
                    Supporting healthcare access and wellness programs in
                    coffee-growing communities.
                  </p>
                  <ul className="space-y-2 text-sm text-forest-600">
                    <li>• Mobile health clinics</li>
                    <li>• Clean water access projects</li>
                    <li>• Nutrition education programs</li>
                    <li>• Emergency medical support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Sustainability Certifications
              </h2>
              <p className="text-lg text-forest-600">
                Our commitment verified by leading international certification
                bodies
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-forest-900">
                    Organic Certified
                  </h3>
                  <p className="text-sm text-forest-600">
                    USDA Organic and EU Organic certified coffee products
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-blue-100 p-3">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-forest-900">
                    Fair Trade
                  </h3>
                  <p className="text-sm text-forest-600">
                    Fair Trade USA and Fairtrade International certified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-amber-100 p-3">
                      <TreePine className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-forest-900">
                    Rainforest Alliance
                  </h3>
                  <p className="text-sm text-forest-600">
                    Rainforest Alliance certified sustainable farming
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-purple-100 p-3">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-forest-900">
                    UTZ Certified
                  </h3>
                  <p className="text-sm text-forest-600">
                    UTZ certification for sustainable coffee production
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Our Impact by Numbers
              </h2>
              <p className="text-lg text-forest-600">
                Measurable progress toward our sustainability goals
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-green-600">
                  5,000+
                </div>
                <div className="text-lg font-semibold text-forest-900">
                  Farmers Supported
                </div>
                <div className="text-forest-600">
                  Direct partnerships with coffee farmers
                </div>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-blue-600">30%</div>
                <div className="text-lg font-semibold text-forest-900">
                  Carbon Reduction
                </div>
                <div className="text-forest-600">
                  Decrease in carbon emissions since 2020
                </div>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-amber-600">
                  1,000
                </div>
                <div className="text-lg font-semibold text-forest-900">
                  Hectares Protected
                </div>
                <div className="text-forest-600">
                  Forest and biodiversity conservation
                </div>
              </div>

              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-purple-600">
                  85%
                </div>
                <div className="text-lg font-semibold text-forest-900">
                  Waste Diverted
                </div>
                <div className="text-forest-600">
                  From landfills through recycling programs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                2030 Sustainability Goals
              </h2>
              <p className="text-lg text-forest-600">
                Our ambitious targets for the next decade
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-forest-900">
                        Environmental Goals
                      </h3>
                      <ul className="space-y-2 text-forest-600">
                        <li>
                          • Achieve carbon neutrality across all operations
                        </li>
                        <li>• Reduce water consumption by 50%</li>
                        <li>• Achieve zero waste to landfill</li>
                        <li>• Protect 5,000 hectares of forest</li>
                        <li>• 100% renewable energy usage</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-forest-900">
                        Social Goals
                      </h3>
                      <ul className="space-y-2 text-forest-600">
                        <li>• Support 10,000+ farming families</li>
                        <li>• Provide education to 5,000 children</li>
                        <li>• Establish 50 community health centers</li>
                        <li>• Train 2,000 farmers in sustainable practices</li>
                        <li>• Achieve gender equality in leadership</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900">
              Join Us in Building a Sustainable Future
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Partner with us to create positive impact in the coffee industry.
              Together, we can build a more sustainable and equitable future for
              coffee.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href={`/${params.locale}/contact`}>Partner With Us</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${params.locale}/certifications`}>
                  View Certifications
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
