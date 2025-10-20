import { type Metadata } from 'next';
import { FileText, Scale, Shield, AlertTriangle } from '@/components/ui/icons';

import Link from 'next/link';

import { type Locale } from '@/i18n';
import { Button } from '@/presentation/components/ui';
import { Card, CardContent } from '@/presentation/components/ui/card';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params: _params,
}: Props): Promise<Metadata> {
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

export default async function TermsPage({ params: _params }: Props) {
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
            <p className="text-forest-800">Last updated: December 2024</p>
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
              <p className="text-lg text-forest-800">
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
                  <p className="text-forest-800">
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
                  <p className="text-forest-800">
                    We guarantee the quality of our coffee products and provide
                    comprehensive quality certifications and testing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Liability Limits
                  </h3>
                  <p className="text-forest-800">
                    Our liability is limited as outlined in these terms, with
                    clear guidelines for dispute resolution and claims.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-12">
              {/* Acceptance of Terms */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  1. Acceptance of Terms
                </h2>
                <p className="text-forest-800">
                  By accessing and using The Great Beans website and services,
                  you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </div>

              {/* Use License */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  2. Use License
                </h2>
                <p className="text-forest-800">
                  Permission is granted to temporarily download one copy of the
                  materials on The Great Beans website for personal,
                  non-commercial transitory viewing only. This is the grant of a
                  license, not a transfer of title, and under this license you
                  may not:
                </p>
                <div className="mt-4">
                  <ul className="space-y-2 text-forest-800">
                    <li>• modify or copy the materials</li>
                    <li>
                      • use the materials for any commercial purpose or for any
                      public display (commercial or non-commercial)
                    </li>
                    <li>
                      • attempt to decompile or reverse engineer any software
                      contained on the website
                    </li>
                    <li>
                      • remove any copyright or other proprietary notations from
                      the materials
                    </li>
                  </ul>
                </div>
                <div className="mt-4">
                  <ul className="space-y-2 text-forest-800">
                    <li>
                      • This license shall automatically terminate if you
                      violate any of these restrictions and may be terminated by
                      The Great Beans at any time.
                    </li>
                    <li>
                      • Upon terminating your viewing of these materials or upon
                      the termination of this license, you must destroy any
                      downloaded materials in your possession whether in
                      electronic or printed format.
                    </li>
                  </ul>
                </div>
                <p className="text-forest-800">
                  This license shall automatically terminate if you violate any
                  of these restrictions and may be terminated by The Great Beans
                  at any time. Upon terminating your viewing of these materials
                  or upon the termination of this license, you must destroy any
                  downloaded materials in your possession whether in electronic
                  or printed format.
                </p>
              </div>

              {/* Disclaimer */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  3. Disclaimer
                </h2>
                <p className="mb-4 text-forest-800">
                  The materials on The Great Beans website are provided on an
                  &apos;as is&apos; basis. The Great Beans makes no warranties,
                  expressed or implied, and hereby disclaims and negates all
                  other warranties including without limitation, implied
                  warranties or conditions of merchantability, fitness for a
                  particular purpose, or non-infringement of intellectual
                  property or other violation of rights.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>
                    • The Great Beans does not warrant or make any
                    representations concerning the accuracy, likely results, or
                    reliability of the use of the materials on its website or
                    otherwise relating to such materials or on any sites linked
                    to this site.
                  </li>
                  <li>
                    • The materials may include technical, typographical, or
                    photographic errors. The Great Beans does not warrant that
                    any of the materials on its website are accurate, complete,
                    or current.
                  </li>
                  <li>
                    • The Great Beans may make changes to the materials
                    contained on its website at any time without notice.
                    However, The Great Beans does not make any commitment to
                    update the materials.
                  </li>
                </ul>
              </div>

              {/* Limitations */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  4. Limitations
                </h2>
                <p className="mb-4 text-forest-800">
                  In no event shall The Great Beans or its suppliers be liable
                  for any damages (including, without limitation, damages for
                  loss of data or profit, or due to business interruption)
                  arising out of the use or inability to use the materials on
                  The Great Beans website, even if The Great Beans or a The
                  Great Beans authorized representative has been notified orally
                  or in writing of the possibility of such damage. Because some
                  jurisdictions do not allow limitations on implied warranties,
                  or limitations of liability for consequential or incidental
                  damages, these limitations may not apply to you.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>
                    • The Great Beans total liability to you for all damages,
                    losses, and causes of action (whether in contract, tort, or
                    otherwise) will not exceed the amount paid by you, if any,
                    for accessing this site.
                  </li>
                  <li>
                    • The Great Beans will not be liable for any indirect,
                    special, incidental, or consequential damages arising out of
                    or in connection with your use of the website or services.
                  </li>
                  <li>
                    • Some jurisdictions do not allow the exclusion or
                    limitation of incidental or consequential damages, so the
                    above limitation or exclusion may not apply to you.
                  </li>
                  <li>
                    • The Great Beans reserves the right to modify these
                    limitations at any time with or without notice.
                  </li>
                  <li>
                    • If any provision of these limitations is found to be
                    unenforceable, the remainder will remain in full force and
                    effect.
                  </li>
                  <li>
                    • These limitations will survive any termination of your
                    account or use of the services.
                  </li>
                  <li>
                    • The Great Beans liability is limited to the maximum extent
                    permitted by applicable law.
                  </li>
                  <li>
                    • You acknowledge that you have read this limitation of
                    liability and understand its contents.
                  </li>
                  <li>
                    • You agree that the limitations of liability set forth
                    herein are reasonable and reflect a reasonable allocation of
                    risk.
                  </li>
                  <li>
                    • The limitations of liability set forth herein will apply
                    even if The Great Beans has been advised of the possibility
                    of such damages.
                  </li>
                </ul>
              </div>

              {/* Accuracy of Materials */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  5. Accuracy of Materials
                </h2>
                <p className="text-forest-800">
                  The materials appearing on The Great Beans website could
                  include technical, typographical, or photographic errors. The
                  Great Beans does not warrant that any of the materials on its
                  website are accurate, complete, or current. The Great Beans
                  may make changes to the materials contained on its website at
                  any time without notice. However, The Great Beans does not
                  make any commitment to update the materials.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>
                    • Product specifications, prices, and availability are
                    subject to change without notice.
                  </li>
                  <li>
                    • Coffee quality grades and certifications are based on
                    industry standards and may vary.
                  </li>
                  <li>
                    • Shipping information and delivery times are estimates and
                    may be affected by external factors.
                  </li>
                </ul>
              </div>

              {/* Links */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  6. Links
                </h2>
                <p className="text-forest-800">
                  The Great Beans has not reviewed all of the sites linked to
                  our website and is not responsible for the contents of any
                  such linked site. The inclusion of any link does not imply
                  endorsement by The Great Beans of the site. Use of any such
                  linked website is at the user&apos;s own risk.
                </p>
                <div className="mt-4">
                  <h3 className="mb-2 text-lg font-semibold text-forest-900">
                    External Links Policy
                  </h3>
                  <ul className="space-y-1 text-forest-800">
                    <li>
                      • We are not responsible for external website content
                    </li>
                    <li>• External links are provided for convenience only</li>
                    <li>
                      • We do not endorse external website products or services
                    </li>
                    <li>
                      • External websites have their own terms and privacy
                      policies
                    </li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="mb-2 text-lg font-semibold text-forest-900">
                    Linking to Our Site
                  </h3>
                  <ul className="space-y-1 text-forest-800">
                    <li>
                      • You may link to our homepage with prior written consent
                    </li>
                    <li>
                      • Deep linking to specific pages requires permission
                    </li>
                    <li>• Commercial linking requires a formal agreement</li>
                    <li>
                      • We reserve the right to request removal of any link
                    </li>
                  </ul>
                </div>
                <p className="text-forest-800">
                  If you would like to link to our website, please contact us
                  for permission and guidelines.
                </p>
              </div>

              {/* Modifications */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  7. Modifications
                </h2>
                <p className="text-forest-800">
                  The Great Beans may revise these terms of service for its
                  website at any time without notice. By using this website, you
                  are agreeing to be bound by the then current version of these
                  terms of service.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>
                    • We will notify users of significant changes via email or
                    website notice
                  </li>
                  <li>
                    • Continued use of the website constitutes acceptance of
                    modified terms
                  </li>
                  <li>
                    • Users are responsible for regularly reviewing these terms
                  </li>
                  <li>
                    • If you disagree with modifications, you must discontinue
                    use of the website
                  </li>
                </ul>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  8. Governing Law
                </h2>
                <p className="mb-4 text-forest-800">
                  These terms and conditions are governed by and construed in
                  accordance with the laws of Vietnam and you irrevocably submit
                  to the exclusive jurisdiction of the courts in that State or
                  location.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>• Any disputes will be resolved in Vietnamese courts</li>
                  <li>
                    • Vietnamese law applies to all aspects of these terms
                  </li>
                  <li>
                    • International trade disputes may be subject to arbitration
                  </li>
                  <li>
                    • Force majeure events are governed by Vietnamese commercial
                    law
                  </li>
                </ul>
              </div>

              {/* Privacy Policy */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  9. Privacy Policy
                </h2>
                <p className="mb-4 text-forest-800">
                  Your privacy is important to us. Our Privacy Policy explains
                  how we collect, use, and protect your information when you use
                  our service. By using our service, you agree to the collection
                  and use of information in accordance with our Privacy Policy.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>
                    • We collect information necessary to provide our services
                  </li>
                  <li>
                    • Personal data is protected according to international
                    standards
                  </li>
                  <li>
                    • We do not sell or share personal information with third
                    parties
                  </li>
                  <li>
                    • Users have rights to access, modify, and delete their data
                  </li>
                </ul>
              </div>

              {/* Account Terms */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  10. Account Terms
                </h2>
                <p className="text-forest-800">
                  When you create an account with us, you must provide
                  information that is accurate, complete, and current at all
                  times. You are responsible for safeguarding the password and
                  for all activities that occur under your account.
                </p>
              </div>

              {/* Prohibited Uses */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  11. Prohibited Uses
                </h2>
                <p className="text-forest-800">
                  You may not use our service for any illegal or unauthorized
                  purpose. You must not, in the use of the service, violate any
                  laws in your jurisdiction.
                </p>
              </div>

              {/* Products and Services */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  12. Products and Services
                </h2>
                <p className="text-forest-800">
                  Certain products or services may be available exclusively
                  online through the website. These products or services may
                  have limited quantities and are subject to return or exchange
                  only according to our Return Policy.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>• Product availability is subject to stock levels</li>
                  <li>• Prices are subject to change without notice</li>
                  <li>• Quality specifications are guaranteed as described</li>
                  <li>
                    • Custom orders may have different terms and conditions
                  </li>
                </ul>
              </div>

              {/* Billing and Account Information */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  13. Billing and Account Information
                </h2>
                <p className="text-forest-800">
                  We reserve the right to refuse any order you place with us. We
                  may, in our sole discretion, limit or cancel quantities
                  purchased per person, per household, or per order.
                </p>
              </div>

              {/* Optional Tools */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  14. Optional Tools
                </h2>
                <p className="text-forest-800">
                  We may provide you with access to third-party tools over which
                  we neither monitor nor have any control nor input. You
                  acknowledge and agree that we provide access to such tools
                  &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any
                  warranties, representations, or conditions of any kind.
                </p>
              </div>

              {/* Third-Party Links */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  15. Third-Party Links
                </h2>
                <p className="text-forest-800">
                  Certain content, products, and services available via our
                  service may include materials from third parties. Third-party
                  links on this site may direct you to third-party websites that
                  are not affiliated with us.
                </p>
              </div>

              {/* User Comments and Feedback */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  16. User Comments, Feedback and Other Submissions
                </h2>
                <p className="text-forest-800">
                  If, at our request, you send certain specific submissions or,
                  without a request from us, you send creative ideas,
                  suggestions, proposals, plans, or other materials, whether
                  online, by email, by postal mail, or otherwise, you agree that
                  we may, at any time, without restriction, edit, copy, publish,
                  distribute, translate and otherwise use in any medium any
                  comments that you forward to us.
                </p>
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  17. Personal Information
                </h2>
                <p className="text-forest-800">
                  Your submission of personal information through the store is
                  governed by our Privacy Policy, which is incorporated into
                  these Terms of Service by reference.
                </p>
              </div>

              {/* Errors and Inaccuracies */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  18. Errors, Inaccuracies and Omissions
                </h2>
                <p className="text-forest-800">
                  Occasionally there may be information on our site or in the
                  service that contains typographical errors, inaccuracies, or
                  omissions that may relate to product descriptions, pricing,
                  promotions, offers, product shipping charges, transit times,
                  and availability.
                </p>
              </div>

              {/* Prohibited Uses Detail */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  19. Prohibited Uses (Detailed)
                </h2>
                <p className="text-forest-800">
                  In addition to other prohibitions as set forth in the Terms of
                  Service, you are prohibited from using the site or its content
                  for the following purposes:
                </p>
                <ol className="ml-6 space-y-2 text-forest-800">
                  <li>
                    1. For any unlawful purpose or to solicit others to perform
                    unlawful acts
                  </li>
                  <li>
                    2. To violate any international, federal, provincial, or
                    state regulations, rules, laws, or local ordinances
                  </li>
                  <li>
                    3. To infringe upon or violate our intellectual property
                    rights or the intellectual property rights of others
                  </li>
                  <li>
                    4. To harass, abuse, insult, harm, defame, slander,
                    disparage, intimidate, or discriminate
                  </li>
                  <li>5. To submit false or misleading information</li>
                </ol>
              </div>

              {/* Disclaimer of Warranties */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  20. Disclaimer of Warranties; Limitation of Liability
                </h2>
                <p className="text-forest-800">
                  We do not guarantee, represent, or warrant that your use of
                  our service will be uninterrupted, timely, secure, or
                  error-free. We do not warrant that the results that may be
                  obtained from the use of the service will be accurate or
                  reliable.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>
                    • The service is provided on an &ldquo;as is&rdquo; and
                    &ldquo;as available&rdquo; basis
                  </li>
                  <li>• We disclaim all warranties, express or implied</li>
                  <li>
                    • We are not liable for any interruptions or technical
                    issues
                  </li>
                </ul>
                <p className="text-forest-800">
                  You agree that from time to time we may remove the service for
                  indefinite periods of time or cancel the service at any time,
                  without notice to you.
                </p>
              </div>

              {/* Indemnification */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  21. Indemnification
                </h2>
                <p className="text-forest-800">
                  You agree to indemnify, defend, and hold harmless The Great
                  Beans and our parent, subsidiaries, affiliates, partners,
                  officers, directors, agents, contractors, licensors, service
                  providers, subcontractors, suppliers, interns, and employees,
                  harmless from any claim or demand, including reasonable
                  attorneys&apos; fees, made by any third party due to or
                  arising out of your breach of these Terms of Service or the
                  documents they incorporate by reference, or your violation of
                  any law or the rights of a third party.
                </p>
                <ul className="ml-6 space-y-2 text-forest-800">
                  <li>
                    • You are responsible for your actions and their
                    consequences
                  </li>
                  <li>
                    • Legal costs may be recovered from users who breach terms
                  </li>
                  <li>
                    • This indemnification survives termination of your account
                  </li>
                </ul>
              </div>

              {/* Severability */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  22. Severability
                </h2>
                <p className="text-forest-800">
                  In the event that any provision of these Terms of Service is
                  determined to be unlawful, void, or unenforceable, such
                  provision shall nonetheless be enforceable to the fullest
                  extent permitted by applicable law, and the unenforceable
                  portion shall be deemed to be severed from these Terms of
                  Service.
                </p>
              </div>

              {/* Termination */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  23. Termination
                </h2>
                <p className="text-forest-800">
                  The obligations and liabilities of the parties incurred prior
                  to the termination date shall survive the termination of this
                  agreement for all purposes. These Terms of Service are
                  effective unless and until terminated by either you or us.
                </p>
              </div>

              {/* Entire Agreement */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  24. Entire Agreement
                </h2>
                <p className="text-forest-800">
                  The failure of us to exercise or enforce any right or
                  provision of these Terms of Service shall not constitute a
                  waiver of such right or provision. These Terms of Service and
                  any policies or operating rules posted by us on this site or
                  in respect to the service constitutes the entire agreement and
                  understanding between you and us.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  25. Changes to Terms of Service
                </h2>
                <p className="text-forest-800">
                  You can review the most current version of the Terms of
                  Service at any time at this page. We reserve the right, at our
                  sole discretion, to update, change, or replace any part of
                  these Terms of Service by posting updates and changes to our
                  website.
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-forest-900">
                  26. Contact Information
                </h2>
                <p className="text-forest-800">
                  Questions about the Terms of Service should be sent to us at
                  legal@thegreatbeans.com or through our contact page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900">
              Questions About Our Terms?
            </h2>
            <p className="mb-8 text-lg text-forest-800">
              Our legal team is here to help clarify any questions you may have
              about our terms of service.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Contact Legal Team</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
