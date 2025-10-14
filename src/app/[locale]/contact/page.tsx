import { type Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';
import { Button } from '@/presentation/components/ui';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Label } from '@/presentation/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  
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

export default async function ContactPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-forest-50 to-emerald-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4">
                <MessageSquare className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Contact Us
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Ready to start your coffee journey? Get in touch with our expert team 
              for personalized solutions and premium Vietnamese coffee.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 text-3xl font-bold text-forest-900">Get in Touch</h2>
                  <p className="text-lg text-forest-600">
                    Our team is ready to help you find the perfect coffee solution. 
                    Reach out to us through any of the channels below.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                          <Mail className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold text-forest-900">Email Us</h3>
                          <p className="text-forest-600">
                            <a href="mailto:info@greatbeans.coffee" className="hover:text-emerald-600">
                              info@greatbeans.coffee
                            </a>
                          </p>
                          <p className="text-forest-600">
                            <a href="mailto:sales@greatbeans.coffee" className="hover:text-emerald-600">
                              sales@greatbeans.coffee
                            </a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                          <Phone className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold text-forest-900">Call Us</h3>
                          <p className="text-forest-600">
                            <a href="tel:+84123456789" className="hover:text-emerald-600">
                              +84 123 456 789
                            </a>
                          </p>
                          <p className="text-sm text-forest-500">International Sales</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                          <MapPin className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold text-forest-900">Visit Us</h3>
                          <p className="text-forest-600">
                            123 Coffee Export Street<br />
                            Dak Lak Province, Vietnam<br />
                            630000
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                          <Clock className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold text-forest-900">Business Hours</h3>
                          <p className="text-forest-600">
                            Monday - Friday: 8:00 AM - 6:00 PM (GMT+7)<br />
                            Saturday: 9:00 AM - 4:00 PM (GMT+7)<br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-forest-900">Send us a Message</CardTitle>
                    <p className="text-forest-600">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            required 
                            placeholder="Your first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            required 
                            placeholder="Your last name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          required 
                          placeholder="your.email@company.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input 
                          id="company" 
                          name="company" 
                          placeholder="Your company name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input 
                          id="subject" 
                          name="subject" 
                          required 
                          placeholder="What can we help you with?"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          required 
                          rows={6}
                          placeholder="Tell us about your coffee needs, quantity requirements, or any questions you have..."
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">Find Us</h2>
              <p className="text-lg text-forest-600">
                Located in the heart of Vietnam's coffee region
              </p>
            </div>
            
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-forest-100 p-8">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
                    <h3 className="mb-2 text-xl font-semibold text-forest-900">
                      Interactive Map Coming Soon
                    </h3>
                    <p className="text-forest-600">
                      We're working on integrating an interactive map to help you find us easily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">Frequently Asked Questions</h2>
              <p className="text-lg text-forest-600">
                Quick answers to common questions
              </p>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-semibold text-forest-900">
                    What is your minimum order quantity?
                  </h3>
                  <p className="text-forest-600">
                    Our minimum order quantity varies by product type. For green coffee beans, 
                    we typically require a minimum of 1 container (approximately 18-20 tons). 
                    Contact us to discuss your specific needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-semibold text-forest-900">
                    How long does shipping take?
                  </h3>
                  <p className="text-forest-600">
                    Shipping times depend on your location and chosen method. Sea freight 
                    typically takes 15-30 days, while air freight takes 3-7 days. We'll 
                    provide detailed timelines with your quote.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-semibold text-forest-900">
                    Do you provide samples?
                  </h3>
                  <p className="text-forest-600">
                    Yes! We provide free samples for serious buyers. Sample shipping costs 
                    apply, but we'll deduct this from your first order. Contact us to 
                    request samples.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-semibold text-forest-900">
                    What certifications do you have?
                  </h3>
                  <p className="text-forest-600">
                    We hold various certifications including Organic, Fair Trade, Rainforest 
                    Alliance, and UTZ. We can also arrange for specific certifications 
                    based on your market requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}