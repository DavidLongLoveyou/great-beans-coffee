import { type Metadata } from 'next';
import { Shield, Eye, Lock, Users, FileText, Mail } from 'lucide-react';
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

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title:
      'Privacy Policy - Data Protection & Privacy Rights - The Great Beans',
    description:
      'Privacy policy for The Great Beans coffee export platform. Learn how we collect, use, and protect your personal information and data privacy rights.',
    openGraph: {
      title: 'Privacy Policy - The Great Beans',
      description:
        'Our commitment to protecting your privacy and personal data in compliance with international privacy laws.',
      type: 'website',
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-blue-100 p-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information.
            </p>
            <p className="text-forest-600">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Privacy at a Glance
              </h2>
              <p className="text-lg text-forest-600">
                Key points about how we handle your personal information
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Transparency
                  </h3>
                  <p className="text-forest-600">
                    We clearly explain what data we collect, why we collect it,
                    and how we use it for our coffee export services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <Lock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Security
                  </h3>
                  <p className="text-forest-600">
                    Your data is protected with industry-standard security
                    measures including encryption and secure storage systems.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Your Rights
                  </h3>
                  <p className="text-forest-600">
                    You have full control over your personal data with rights to
                    access, correct, delete, or export your information.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-12">
              {/* Information We Collect */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  1. Information We Collect
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Personal Information
                    </h3>
                    <p className="mb-4 text-forest-600">
                      We collect personal information that you provide directly
                      to us when you:
                    </p>
                    <ul className="ml-6 space-y-2 text-forest-600">
                      <li>• Create an account or register for our services</li>
                      <li>• Request quotes or submit inquiries</li>
                      <li>
                        • Subscribe to our newsletter or marketing
                        communications
                      </li>
                      <li>
                        • Contact us through our website or customer support
                      </li>
                      <li>• Participate in surveys or feedback forms</li>
                    </ul>
                    <p className="mt-4 text-forest-600">
                      This may include your name, email address, phone number,
                      company information, job title, and business requirements.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Business Information
                    </h3>
                    <p className="mb-4 text-forest-600">
                      For our B2B coffee export services, we may collect:
                    </p>
                    <ul className="ml-6 space-y-2 text-forest-600">
                      <li>• Company name, address, and registration details</li>
                      <li>• Business license and certification information</li>
                      <li>• Import/export documentation requirements</li>
                      <li>• Product specifications and order history</li>
                      <li>• Payment and billing information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Technical Information
                    </h3>
                    <p className="mb-4 text-forest-600">
                      We automatically collect certain technical information
                      when you visit our website:
                    </p>
                    <ul className="ml-6 space-y-2 text-forest-600">
                      <li>• IP address and location data</li>
                      <li>• Browser type and version</li>
                      <li>• Device information and operating system</li>
                      <li>• Pages visited and time spent on our website</li>
                      <li>• Referral sources and search terms</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  2. How We Use Your Information
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    We use the information we collect for the following
                    purposes:
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Service Delivery
                      </h4>
                      <ul className="space-y-2 text-forest-600">
                        <li>• Process and fulfill your orders</li>
                        <li>• Provide customer support</li>
                        <li>• Send service-related communications</li>
                        <li>• Manage your account and preferences</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Business Operations
                      </h4>
                      <ul className="space-y-2 text-forest-600">
                        <li>• Process payments and billing</li>
                        <li>• Comply with legal requirements</li>
                        <li>• Prevent fraud and ensure security</li>
                        <li>• Improve our services and website</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Marketing & Communication
                      </h4>
                      <ul className="space-y-2 text-forest-600">
                        <li>• Send newsletters and updates</li>
                        <li>• Provide relevant product information</li>
                        <li>• Conduct market research</li>
                        <li>• Personalize your experience</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Analytics & Improvement
                      </h4>
                      <ul className="space-y-2 text-forest-600">
                        <li>• Analyze website usage patterns</li>
                        <li>• Optimize user experience</li>
                        <li>• Develop new features and services</li>
                        <li>• Generate business insights</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Sharing */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  3. Information Sharing and Disclosure
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    We do not sell, trade, or rent your personal information to
                    third parties. We may share your information only in the
                    following circumstances:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Service Providers
                      </h4>
                      <p className="text-forest-600">
                        We may share information with trusted third-party
                        service providers who assist us in operating our
                        business, such as payment processors, shipping
                        companies, and technology service providers.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Legal Requirements
                      </h4>
                      <p className="text-forest-600">
                        We may disclose information when required by law, court
                        order, or government regulation, or to protect our
                        rights, property, or safety.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Business Transfers
                      </h4>
                      <p className="text-forest-600">
                        In the event of a merger, acquisition, or sale of
                        assets, your information may be transferred as part of
                        the business transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  4. Data Security
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    We implement appropriate technical and organizational
                    security measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or
                    destruction.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Technical Safeguards
                      </h4>
                      <ul className="space-y-1 text-forest-600">
                        <li>• SSL/TLS encryption for data transmission</li>
                        <li>• Encrypted data storage</li>
                        <li>• Regular security audits and updates</li>
                        <li>• Secure access controls and authentication</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Organizational Measures
                      </h4>
                      <ul className="space-y-1 text-forest-600">
                        <li>• Employee training on data protection</li>
                        <li>• Limited access on a need-to-know basis</li>
                        <li>• Regular privacy impact assessments</li>
                        <li>• Incident response procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  5. Your Privacy Rights
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    Depending on your location, you may have the following
                    rights regarding your personal information:
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Access & Portability
                      </h4>
                      <ul className="space-y-1 text-forest-600">
                        <li>• Request access to your personal data</li>
                        <li>
                          • Receive a copy of your data in a portable format
                        </li>
                        <li>• Request information about data processing</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Control & Correction
                      </h4>
                      <ul className="space-y-1 text-forest-600">
                        <li>• Correct inaccurate or incomplete data</li>
                        <li>• Request deletion of your personal data</li>
                        <li>• Restrict or object to data processing</li>
                      </ul>
                    </div>
                  </div>

                  <p className="mt-4 text-forest-600">
                    To exercise these rights, please contact us using the
                    information provided below. We will respond to your request
                    within the timeframe required by applicable law.
                  </p>
                </div>
              </div>

              {/* Cookies and Tracking */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  6. Cookies and Tracking Technologies
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    We use cookies and similar tracking technologies to enhance
                    your browsing experience and analyze website usage. You can
                    control cookie settings through your browser preferences.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Types of Cookies We Use
                      </h4>
                      <ul className="ml-6 space-y-2 text-forest-600">
                        <li>
                          • <strong>Essential Cookies:</strong> Required for
                          website functionality
                        </li>
                        <li>
                          • <strong>Analytics Cookies:</strong> Help us
                          understand website usage
                        </li>
                        <li>
                          • <strong>Marketing Cookies:</strong> Used for
                          personalized advertising
                        </li>
                        <li>
                          • <strong>Preference Cookies:</strong> Remember your
                          settings and preferences
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* International Transfers */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  7. International Data Transfers
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    As a global coffee export business, we may transfer your
                    personal information to countries outside your jurisdiction.
                    We ensure appropriate safeguards are in place to protect
                    your data during international transfers.
                  </p>

                  <p className="text-forest-600">
                    These safeguards may include adequacy decisions, standard
                    contractual clauses, or other legally recognized transfer
                    mechanisms to ensure your data receives adequate protection.
                  </p>
                </div>
              </div>

              {/* Data Retention */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  8. Data Retention
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    We retain your personal information only for as long as
                    necessary to fulfill the purposes for which it was
                    collected, comply with legal obligations, resolve disputes,
                    and enforce our agreements.
                  </p>

                  <div className="space-y-2">
                    <p className="text-forest-600">
                      <strong>Account Information:</strong> Retained while your
                      account is active and for a reasonable period after
                      account closure.
                    </p>
                    <p className="text-forest-600">
                      <strong>Transaction Records:</strong> Retained for the
                      period required by applicable tax and business laws.
                    </p>
                    <p className="text-forest-600">
                      <strong>Marketing Data:</strong> Retained until you
                      unsubscribe or withdraw consent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Children's Privacy */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  9. Children's Privacy
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    Our services are designed for business use and are not
                    intended for children under the age of 16. We do not
                    knowingly collect personal information from children. If we
                    become aware that we have collected personal information
                    from a child, we will take steps to delete such information.
                  </p>
                </div>
              </div>

              {/* Changes to Privacy Policy */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  10. Changes to This Privacy Policy
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    We may update this Privacy Policy from time to time to
                    reflect changes in our practices, technology, legal
                    requirements, or other factors. We will notify you of any
                    material changes by posting the updated policy on our
                    website and updating the "Last updated" date.
                  </p>

                  <p className="text-forest-600">
                    We encourage you to review this Privacy Policy periodically
                    to stay informed about how we protect your information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                  Contact Us About Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-forest-600">
                  If you have any questions about this Privacy Policy, want to
                  exercise your privacy rights, or need to report a privacy
                  concern, please contact us:
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Privacy Officer
                    </h4>
                    <p className="text-forest-600">
                      Email: privacy@thegreatbeans.com
                      <br />
                      Phone: +84 (0) 123 456 789
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Mailing Address
                    </h4>
                    <p className="text-forest-600">
                      The Great Beans Coffee Export
                      <br />
                      Privacy Department
                      <br />
                      Ho Chi Minh City, Vietnam
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button asChild>
                    <Link href={`/${params.locale}/contact`}>
                      Contact Privacy Team
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/${params.locale}/terms`}>
                      View Terms of Service
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
