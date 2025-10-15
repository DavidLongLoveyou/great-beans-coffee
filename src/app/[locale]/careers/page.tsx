import { type Metadata } from 'next';
import {
  Users,
  Heart,
  TrendingUp,
  Globe,
  Coffee,
  Award,
  MapPin,
  Clock,
  DollarSign,
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
    title: 'Careers - Join Our Team - The Great Beans',
    description:
      'Join The Great Beans team and build your career in the global coffee industry. Explore opportunities in sourcing, quality control, logistics, and more.',
    openGraph: {
      title: 'Careers - The Great Beans',
      description:
        'Build your career with a leading coffee export company. Join our passionate team.',
      type: 'website',
    },
  };
}

export default async function CareersPage({ params }: Props) {
  const jobOpenings = [
    {
      title: 'Senior Coffee Quality Specialist',
      department: 'Quality Assurance',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      experience: '5+ years',
      description:
        'Lead quality control processes and develop quality standards for our premium coffee exports.',
      requirements: [
        'Q Grader certification preferred',
        'Experience in coffee cupping and quality assessment',
        'Knowledge of international coffee standards',
        'Strong analytical and communication skills',
      ],
    },
    {
      title: 'International Sales Manager',
      department: 'Sales & Marketing',
      location: 'Remote / Ho Chi Minh City',
      type: 'Full-time',
      experience: '3+ years',
      description:
        'Develop and manage relationships with international coffee buyers and expand our global market presence.',
      requirements: [
        'Experience in B2B sales, preferably in coffee/agriculture',
        'Strong network in international coffee markets',
        'Excellent English communication skills',
        'Willingness to travel internationally',
      ],
    },
    {
      title: 'Supply Chain Coordinator',
      department: 'Logistics',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      experience: '2+ years',
      description:
        'Coordinate coffee sourcing, processing, and export logistics to ensure timely delivery to global customers.',
      requirements: [
        'Experience in supply chain or logistics',
        'Knowledge of export/import procedures',
        'Strong organizational and problem-solving skills',
        'Proficiency in logistics software',
      ],
    },
    {
      title: 'Sustainability Program Manager',
      department: 'Sustainability',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      experience: '4+ years',
      description:
        'Lead our sustainability initiatives and certification programs to promote responsible coffee sourcing.',
      requirements: [
        'Experience in sustainability or environmental programs',
        'Knowledge of coffee certifications (Fair Trade, Organic, etc.)',
        'Project management experience',
        'Passion for environmental and social responsibility',
      ],
    },
    {
      title: 'Coffee Sourcing Specialist',
      department: 'Sourcing',
      location: 'Multiple locations in Vietnam',
      type: 'Full-time',
      experience: '3+ years',
      description:
        'Work directly with coffee farmers to source high-quality beans and build sustainable partnerships.',
      requirements: [
        'Experience in agricultural sourcing or farming',
        'Knowledge of coffee cultivation and processing',
        'Strong relationship-building skills',
        'Willingness to travel to rural areas',
      ],
    },
    {
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      experience: '2+ years',
      description:
        'Develop and execute digital marketing strategies to promote our brand and services globally.',
      requirements: [
        'Experience in digital marketing and social media',
        'Knowledge of SEO, SEM, and content marketing',
        'Creative thinking and analytical skills',
        'Experience with B2B marketing preferred',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-coffee-50 to-amber-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-coffee-100 p-4">
                <Users className="h-12 w-12 text-coffee-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Join Our Team
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Build your career with a leading coffee export company. Join our
              passionate team and help connect the world through great coffee.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge
                variant="secondary"
                className="bg-coffee-100 text-coffee-800"
              >
                Global Opportunities
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Sustainable Impact
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Career Growth
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Why Work With Us
              </h2>
              <p className="text-lg text-forest-600">
                Join a company that values growth, sustainability, and making a
                positive impact
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-coffee-100 p-3">
                      <Coffee className="h-8 w-8 text-coffee-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Industry Leadership
                  </h3>
                  <p className="text-forest-600">
                    Work with one of Vietnam's leading coffee exporters and
                    shape the future of the industry.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Meaningful Work
                  </h3>
                  <p className="text-forest-600">
                    Make a positive impact on farming communities and contribute
                    to sustainable coffee production.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-blue-100 p-3">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Career Growth
                  </h3>
                  <p className="text-forest-600">
                    Advance your career with comprehensive training, mentorship,
                    and leadership development programs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-purple-100 p-3">
                      <Globe className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Global Reach
                  </h3>
                  <p className="text-forest-600">
                    Work with international clients and partners, expanding your
                    global perspective and network.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Culture */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Benefits & Culture
              </h2>
              <p className="text-lg text-forest-600">
                We invest in our people and create an environment where everyone
                can thrive
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-coffee-600" />
                    Comprehensive Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-coffee-500"></div>
                        <span className="text-forest-600">
                          Competitive salary packages
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-coffee-500"></div>
                        <span className="text-forest-600">
                          Health and dental insurance
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-coffee-500"></div>
                        <span className="text-forest-600">
                          Annual performance bonuses
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-coffee-500"></div>
                        <span className="text-forest-600">
                          Professional development budget
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-coffee-500"></div>
                        <span className="text-forest-600">
                          Flexible working arrangements
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-coffee-500"></div>
                        <span className="text-forest-600">
                          Paid vacation and sick leave
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-coffee-500"></div>
                        <span className="text-forest-600">
                          Retirement savings plan
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-coffee-500"></div>
                        <span className="text-forest-600">
                          Employee wellness programs
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-green-600" />
                    Company Culture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-forest-600">
                          Collaborative team environment
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-forest-600">
                          Innovation and creativity encouraged
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-forest-600">
                          Diversity and inclusion focus
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-forest-600">
                          Work-life balance priority
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-forest-600">
                          Regular team building events
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-forest-600">
                          Open communication culture
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-forest-600">
                          Sustainability commitment
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-forest-600">
                          Continuous learning mindset
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Current Job Openings
              </h2>
              <p className="text-lg text-forest-600">
                Explore exciting opportunities to join our growing team
              </p>
            </div>

            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <Card key={index} className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="mb-2 text-xl font-semibold text-forest-900">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-coffee-100 text-coffee-800"
                              >
                                {job.department}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Clock className="h-3 w-3" />
                                {job.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-forest-600">
                              Experience Required
                            </div>
                            <div className="font-semibold text-forest-900">
                              {job.experience}
                            </div>
                          </div>
                        </div>

                        <p className="mb-4 text-forest-600">
                          {job.description}
                        </p>

                        <div>
                          <h4 className="mb-2 font-semibold text-forest-900">
                            Key Requirements:
                          </h4>
                          <ul className="space-y-1">
                            {job.requirements.map((req, reqIndex) => (
                              <li
                                key={reqIndex}
                                className="flex items-start gap-2 text-sm text-forest-600"
                              >
                                <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-coffee-500"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center gap-4">
                        <Button className="w-full sm:w-auto">Apply Now</Button>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Application Process
              </h2>
              <p className="text-lg text-forest-600">
                Our straightforward hiring process designed to find the best fit
                for both you and our team
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coffee-100 text-2xl font-bold text-coffee-600">
                    1
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-forest-900">
                  Submit Application
                </h3>
                <p className="text-forest-600">
                  Send us your resume and cover letter through our online
                  application system.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
                    2
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-forest-900">
                  Initial Review
                </h3>
                <p className="text-forest-600">
                  Our HR team reviews your application and contacts qualified
                  candidates within 1 week.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                    3
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-forest-900">
                  Interview Process
                </h3>
                <p className="text-forest-600">
                  Participate in 2-3 rounds of interviews with team members and
                  management.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                    4
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-forest-900">
                  Welcome Aboard
                </h3>
                <p className="text-forest-600">
                  Receive your offer and join our comprehensive onboarding
                  program.
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
            <h2 className="mb-6 text-3xl font-bold text-forest-900">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Don't see a position that matches your skills? We're always
              looking for talented individuals to join our team. Send us your
              resume and let's explore opportunities together.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href={`/${params.locale}/contact`}>Send Your Resume</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${params.locale}/about`}>Learn About Us</Link>
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-forest-600">
                Questions about our hiring process?
                <Link
                  href={`/${params.locale}/contact`}
                  className="ml-1 text-coffee-600 hover:underline"
                >
                  Contact our HR team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
