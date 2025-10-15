import { type Metadata } from 'next';
import {
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  Globe,
  Truck,
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

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Terms of Service - Legal Terms & Conditions - The Great Beans',
    description:
      'Terms of service and legal conditions for using The Great Beans coffee export platform. Review our terms, conditions, and legal agreements.',
    openGraph: {
      title: 'Terms of Service - The Great Beans',
      description:
        'Legal terms and conditions governing the use of our coffee export services and platform.',
      type: 'website',
    },
  };
}

export default async function TermsPage({ params }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-slate-100 p-4">
                <FileText className="h-12 w-12 text-slate-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Terms of Service
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Legal terms and conditions governing the use of our coffee export
              services and platform.
            </p>
            <p className="text-forest-600">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Key Terms Overview */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Key Terms Overview
              </h2>
              <p className="text-lg text-forest-600">
                Important highlights from our terms of service
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Scale className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Fair Trading
                  </h3>
                  <p className="text-forest-600">
                    All transactions are governed by international trade laws
                    and fair business practices with transparent pricing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Quality Assurance
                  </h3>
                  <p className="text-forest-600">
                    We guarantee the quality of our coffee products and provide
                    comprehensive quality certifications and testing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Truck className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Delivery Terms
                  </h3>
                  <p className="text-forest-600">
                    Clear shipping terms, delivery schedules, and logistics
                    responsibilities for international coffee exports.
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
              {/* Acceptance of Terms */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    By accessing and using The Great Beans website and services,
                    you accept and agree to be bound by the terms and provision
                    of this agreement. If you do not agree to abide by the
                    above, please do not use this service.
                  </p>

                  <p className="text-forest-600">
                    These Terms of Service ("Terms") govern your use of our
                    website, services, and any related applications or platforms
                    operated by The Great Beans Coffee Export ("Company", "we",
                    "us", or "our").
                  </p>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                      <div>
                        <h4 className="mb-1 font-semibold text-amber-900">
                          Important Notice
                        </h4>
                        <p className="text-sm text-amber-800">
                          By using our services, you confirm that you are
                          authorized to enter into binding agreements on behalf
                          of your company or organization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  2. Service Description
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    The Great Beans provides B2B coffee export services
                    including but not limited to:
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Core Services
                      </h4>
                      <ul className="space-y-2 text-forest-600">
                        <li>• Coffee sourcing and procurement</li>
                        <li>• Quality testing and certification</li>
                        <li>• Custom roasting and blending</li>
                        <li>• Packaging and labeling services</li>
                        <li>• International shipping and logistics</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Additional Services
                      </h4>
                      <ul className="space-y-2 text-forest-600">
                        <li>• OEM manufacturing solutions</li>
                        <li>• Private label development</li>
                        <li>• Market research and consulting</li>
                        <li>• Supply chain management</li>
                        <li>• Documentation and compliance support</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-forest-600">
                    We reserve the right to modify, suspend, or discontinue any
                    aspect of our services at any time with reasonable notice to
                    our clients.
                  </p>
                </div>
              </div>

              {/* User Responsibilities */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  3. User Responsibilities
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Account Registration
                    </h3>
                    <p className="mb-4 text-forest-600">
                      When creating an account with us, you agree to:
                    </p>
                    <ul className="ml-6 space-y-2 text-forest-600">
                      <li>
                        • Provide accurate, current, and complete information
                      </li>
                      <li>• Maintain and update your account information</li>
                      <li>
                        • Keep your login credentials secure and confidential
                      </li>
                      <li>• Notify us immediately of any unauthorized use</li>
                      <li>
                        • Accept responsibility for all activities under your
                        account
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Business Compliance
                    </h3>
                    <p className="mb-4 text-forest-600">
                      As a business user, you represent and warrant that:
                    </p>
                    <ul className="ml-6 space-y-2 text-forest-600">
                      <li>
                        • You have the legal authority to enter into this
                        agreement
                      </li>
                      <li>
                        • Your business is properly licensed and registered
                      </li>
                      <li>
                        • You comply with all applicable import/export
                        regulations
                      </li>
                      <li>
                        • You have necessary permits for coffee importation
                      </li>
                      <li>
                        • You will provide accurate business documentation when
                        requested
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Prohibited Uses
                    </h3>
                    <p className="mb-4 text-forest-600">
                      You agree not to use our services for:
                    </p>
                    <ul className="ml-6 space-y-2 text-forest-600">
                      <li>
                        • Any unlawful purpose or in violation of applicable
                        laws
                      </li>
                      <li>• Fraudulent or deceptive practices</li>
                      <li>• Circumventing trade restrictions or sanctions</li>
                      <li>
                        • Interfering with the security or functionality of our
                        platform
                      </li>
                      <li>
                        • Competing directly with our business using our
                        proprietary information
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Orders and Payments */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  4. Orders and Payments
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Order Process
                    </h3>
                    <div className="space-y-4">
                      <p className="text-forest-600">
                        All orders are subject to acceptance by The Great Beans.
                        We reserve the right to refuse or cancel orders for any
                        reason, including but not limited to:
                      </p>
                      <ul className="ml-6 space-y-2 text-forest-600">
                        <li>• Product availability limitations</li>
                        <li>• Pricing or product information errors</li>
                        <li>• Credit verification issues</li>
                        <li>• Compliance or regulatory concerns</li>
                        <li>• Force majeure events affecting supply</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Pricing and Payment Terms
                    </h3>
                    <div className="space-y-4">
                      <p className="text-forest-600">
                        All prices are quoted in USD unless otherwise specified
                        and are subject to change without notice. Payment terms
                        include:
                      </p>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-forest-900">
                            Payment Methods
                          </h4>
                          <ul className="space-y-1 text-forest-600">
                            <li>• Letter of Credit (L/C)</li>
                            <li>• Telegraphic Transfer (T/T)</li>
                            <li>• Documentary Collection</li>
                            <li>• Other agreed payment methods</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-2 font-semibold text-forest-900">
                            Payment Schedule
                          </h4>
                          <ul className="space-y-1 text-forest-600">
                            <li>• Deposit: 30% upon order confirmation</li>
                            <li>• Balance: Before shipment or as agreed</li>
                            <li>• Late payment fees may apply</li>
                            <li>• Currency fluctuation adjustments</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Delivery and Risk Transfer
                    </h3>
                    <div className="space-y-4">
                      <p className="text-forest-600">
                        Delivery terms are governed by Incoterms 2020 as
                        specified in each contract. Common terms include:
                      </p>
                      <ul className="ml-6 space-y-2 text-forest-600">
                        <li>
                          • <strong>FOB (Free on Board):</strong> Risk transfers
                          at port of shipment
                        </li>
                        <li>
                          • <strong>CIF (Cost, Insurance, Freight):</strong> We
                          arrange shipping and insurance
                        </li>
                        <li>
                          • <strong>EXW (Ex Works):</strong> Buyer arranges all
                          transportation
                        </li>
                        <li>
                          • <strong>DDP (Delivered Duty Paid):</strong> We
                          handle all delivery costs
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality and Warranties */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  5. Quality Assurance and Warranties
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Quality Standards
                    </h3>
                    <p className="mb-4 text-forest-600">
                      We warrant that all coffee products will:
                    </p>
                    <ul className="ml-6 space-y-2 text-forest-600">
                      <li>
                        • Meet the specifications agreed upon in the contract
                      </li>
                      <li>• Comply with applicable food safety standards</li>
                      <li>
                        • Be free from defects in materials and processing
                      </li>
                      <li>
                        • Match approved samples within acceptable tolerances
                      </li>
                      <li>• Include proper certifications and documentation</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Quality Claims
                    </h3>
                    <p className="mb-4 text-forest-600">
                      Quality claims must be:
                    </p>
                    <ul className="ml-6 space-y-2 text-forest-600">
                      <li>• Reported within 30 days of delivery</li>
                      <li>• Supported by independent laboratory analysis</li>
                      <li>• Documented with proper evidence and samples</li>
                      <li>• Submitted through our official claims process</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Limitation of Warranties
                    </h3>
                    <p className="text-forest-600">
                      Our warranties are limited to replacement or refund of
                      defective products. We disclaim all other warranties,
                      express or implied, including warranties of
                      merchantability and fitness for a particular purpose,
                      except as required by law.
                    </p>
                  </div>
                </div>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  6. Intellectual Property
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    All content on our website and platform, including but not
                    limited to text, graphics, logos, images, software, and data
                    compilations, is the property of The Great Beans or its
                    licensors and is protected by copyright, trademark, and
                    other intellectual property laws.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Permitted Use
                      </h4>
                      <p className="text-forest-600">
                        You may use our content solely for the purpose of
                        evaluating and purchasing our coffee products and
                        services. Any other use requires our written permission.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Trademarks
                      </h4>
                      <p className="text-forest-600">
                        "The Great Beans" and related marks are trademarks of
                        our company. You may not use our trademarks without our
                        prior written consent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  7. Limitation of Liability
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    To the maximum extent permitted by law, The Great Beans
                    shall not be liable for:
                  </p>

                  <ul className="ml-6 space-y-2 text-forest-600">
                    <li>
                      • Indirect, incidental, special, or consequential damages
                    </li>
                    <li>
                      • Loss of profits, revenue, or business opportunities
                    </li>
                    <li>• Delays or failures due to force majeure events</li>
                    <li>• Third-party actions or government regulations</li>
                    <li>
                      • Market price fluctuations or currency exchange
                      variations
                    </li>
                  </ul>

                  <p className="text-forest-600">
                    Our total liability for any claim shall not exceed the value
                    of the specific transaction giving rise to the claim.
                  </p>
                </div>
              </div>

              {/* Force Majeure */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  8. Force Majeure
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    Neither party shall be liable for any failure or delay in
                    performance under this agreement due to force majeure
                    events, including but not limited to:
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Natural Events
                      </h4>
                      <ul className="space-y-1 text-forest-600">
                        <li>• Natural disasters and weather conditions</li>
                        <li>• Crop failures or agricultural issues</li>
                        <li>• Epidemics or pandemics</li>
                        <li>• Environmental catastrophes</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Human Events
                      </h4>
                      <ul className="space-y-1 text-forest-600">
                        <li>• War, terrorism, or civil unrest</li>
                        <li>• Government actions or sanctions</li>
                        <li>• Labor strikes or disputes</li>
                        <li>• Transportation disruptions</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-forest-600">
                    The affected party must promptly notify the other party and
                    use reasonable efforts to minimize the impact of such
                    events.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  9. Governing Law and Dispute Resolution
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Applicable Law
                    </h3>
                    <p className="text-forest-600">
                      These Terms shall be governed by and construed in
                      accordance with the laws of Vietnam, without regard to its
                      conflict of law provisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-forest-900">
                      Dispute Resolution
                    </h3>
                    <div className="space-y-4">
                      <p className="text-forest-600">
                        Any disputes arising from these Terms or our services
                        shall be resolved through:
                      </p>

                      <ol className="ml-6 space-y-2 text-forest-600">
                        <li>
                          1. <strong>Negotiation:</strong> Good faith
                          discussions between parties
                        </li>
                        <li>
                          2. <strong>Mediation:</strong> Neutral third-party
                          mediation if negotiation fails
                        </li>
                        <li>
                          3. <strong>Arbitration:</strong> Binding arbitration
                          under ICC Rules in Singapore
                        </li>
                      </ol>

                      <p className="text-forest-600">
                        The arbitration shall be conducted in English, and the
                        decision shall be final and binding on both parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Termination */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  10. Termination
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    Either party may terminate this agreement with 30 days
                    written notice. We may terminate immediately if you:
                  </p>

                  <ul className="ml-6 space-y-2 text-forest-600">
                    <li>• Breach any material term of this agreement</li>
                    <li>• Fail to make payments when due</li>
                    <li>• Engage in fraudulent or illegal activities</li>
                    <li>• Violate applicable laws or regulations</li>
                  </ul>

                  <p className="text-forest-600">
                    Upon termination, all outstanding obligations shall remain
                    in effect, and you must cease using our services and return
                    any confidential information.
                  </p>
                </div>
              </div>

              {/* Modifications */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  11. Modifications to Terms
                </h2>
                <div className="space-y-4">
                  <p className="text-forest-600">
                    We reserve the right to modify these Terms at any time.
                    Material changes will be communicated through:
                  </p>

                  <ul className="ml-6 space-y-2 text-forest-600">
                    <li>• Email notification to registered users</li>
                    <li>• Prominent notice on our website</li>
                    <li>• Updated "Last modified" date on this page</li>
                  </ul>

                  <p className="text-forest-600">
                    Continued use of our services after modifications
                    constitutes acceptance of the updated Terms.
                  </p>
                </div>
              </div>

              {/* Miscellaneous */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  12. Miscellaneous
                </h2>
                <div className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Severability
                      </h4>
                      <p className="text-forest-600">
                        If any provision of these Terms is found to be
                        unenforceable, the remaining provisions shall remain in
                        full force and effect.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Entire Agreement
                      </h4>
                      <p className="text-forest-600">
                        These Terms constitute the entire agreement between you
                        and The Great Beans regarding the use of our services.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Assignment
                      </h4>
                      <p className="text-forest-600">
                        You may not assign your rights under these Terms without
                        our written consent. We may assign our rights at any
                        time.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-forest-900">
                        Waiver
                      </h4>
                      <p className="text-forest-600">
                        No waiver of any term shall be deemed a further or
                        continuing waiver of such term or any other term.
                      </p>
                    </div>
                  </div>
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
                  <Globe className="h-6 w-6 text-blue-600" />
                  Legal and Contract Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-forest-600">
                  For questions about these Terms of Service, contract
                  negotiations, or legal matters, please contact our legal
                  department:
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Legal Department
                    </h4>
                    <p className="text-forest-600">
                      Email: legal@thegreatbeans.com
                      <br />
                      Phone: +84 (0) 123 456 789
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Business Address
                    </h4>
                    <p className="text-forest-600">
                      The Great Beans Coffee Export
                      <br />
                      Legal Department
                      <br />
                      Ho Chi Minh City, Vietnam
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button asChild>
                    <Link href={`/${params.locale}/contact`}>
                      Contact Legal Team
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/${params.locale}/privacy`}>
                      View Privacy Policy
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
