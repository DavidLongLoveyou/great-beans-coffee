'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Coffee, Mail, Phone, MapPin } from 'lucide-react';
import { type Locale } from '@/i18n';

type Props = {
  locale: Locale;
};

export default function Footer({ locale }: Props) {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');

  return (
    <footer className="bg-green-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">The Great Beans</span>
            </div>
            <p className="text-green-100">
              Premium Vietnamese coffee export company connecting global markets with exceptional coffee beans.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-green-400" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-green-400" />
                <span>info@thegreatbeans.com</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">{t('products')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/products/robusta`} className="text-green-100 hover:text-white transition-colors">
                  Robusta Coffee
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/arabica`} className="text-green-100 hover:text-white transition-colors">
                  Arabica Coffee
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/blends`} className="text-green-100 hover:text-white transition-colors">
                  Specialty Blends
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/instant`} className="text-green-100 hover:text-white transition-colors">
                  Instant Coffee
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">{t('services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/services/oem`} className="text-green-100 hover:text-white transition-colors">
                  OEM Manufacturing
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/private-label`} className="text-green-100 hover:text-white transition-colors">
                  Private Label
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/sourcing`} className="text-green-100 hover:text-white transition-colors">
                  Coffee Sourcing
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/logistics`} className="text-green-100 hover:text-white transition-colors">
                  Logistics & Shipping
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/about`} className="text-green-100 hover:text-white transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/certifications`} className="text-green-100 hover:text-white transition-colors">
                  {t('certifications')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-green-100 hover:text-white transition-colors">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-green-100 hover:text-white transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-green-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-green-100">
              © 2024 The Great Beans. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href={`/${locale}/privacy`} className="text-green-100 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href={`/${locale}/terms`} className="text-green-100 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}