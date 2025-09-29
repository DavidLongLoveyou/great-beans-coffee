import { type Locale } from '@/i18n';
import { MarketInfo } from '@/presentation/components/features/MarketInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';

interface MarketInfoPageProps {
  params: {
    locale: Locale;
  };
}

export default function MarketInfoPage({ params: { locale } }: MarketInfoPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                Market Information
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive market-specific information for coffee export operations, 
              including currency, shipping details, certifications, and business requirements.
            </p>
          </div>
        </div>

        {/* Market Info Component */}
        <MarketInfo 
          showPorts={true}
          showCertifications={true}
          showPaymentTerms={true}
          className="mb-8"
        />

        {/* Additional Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Market Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Our market configuration system provides localized information for each supported region, 
                ensuring that our B2B coffee export operations are tailored to local requirements and preferences.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Currency & Pricing:</strong> Local currency formatting and pricing display</li>
                <li><strong>Shipping Information:</strong> Major ports, transit times, and preferred Incoterms</li>
                <li><strong>Business Hours:</strong> Local timezone and operating hours</li>
                <li><strong>Quality Standards:</strong> Market-specific coffee grading systems</li>
                <li><strong>Payment Terms:</strong> Preferred payment methods and standard terms</li>
                <li><strong>Certifications:</strong> Required, preferred, and optional certifications</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported Markets:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🇺🇸</div>
                  <div className="text-sm font-medium">United States</div>
                  <div className="text-xs text-gray-500">USD, EST/EDT</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🇩🇪</div>
                  <div className="text-sm font-medium">Germany</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🇯🇵</div>
                  <div className="text-sm font-medium">Japan</div>
                  <div className="text-xs text-gray-500">JPY, JST</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🇫🇷</div>
                  <div className="text-sm font-medium">France</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🇮🇹</div>
                  <div className="text-sm font-medium">Italy</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🇪🇸</div>
                  <div className="text-sm font-medium">Spain</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🇳🇱</div>
                  <div className="text-sm font-medium">Netherlands</div>
                  <div className="text-xs text-gray-500">EUR, CET/CEST</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🇰🇷</div>
                  <div className="text-sm font-medium">South Korea</div>
                  <div className="text-xs text-gray-500">KRW, KST</div>
                </div>
              </div>

              <p className="text-gray-700">
                This information is automatically updated based on your selected locale and helps ensure 
                compliance with local regulations and business practices.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}