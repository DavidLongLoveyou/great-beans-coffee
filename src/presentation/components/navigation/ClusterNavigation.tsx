'use client';

import { ArrowRight, Coffee, Factory, Leaf } from 'lucide-react';
import Link from 'next/link';

import { type Locale } from '@/i18n';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui';
import { useTranslation } from '@/shared/hooks/useTranslation';

type Props = {
  locale: Locale;
  variant?: 'grid' | 'list' | 'compact';
  showIcons?: boolean;
  className?: string;
};

const clusterIcons = {
  'vietnam-robusta-suppliers': Coffee,
  'specialty-arabica-sourcing': Leaf,
  'private-label-coffee-manufacturing': Factory,
};

const clusterKeys = [
  'vietnamRobustaSuppliers',
  'specialtyArabicaSourcing',
  'privateLabelManufacturing',
] as const;

const clusterSlugs = [
  'vietnam-robusta-suppliers',
  'specialty-arabica-sourcing',
  'private-label-coffee-manufacturing',
] as const;

export default function ClusterNavigation({
  locale,
  variant = 'grid',
  showIcons = true,
  className = '',
}: Props) {
  const { t } = useTranslation('clusters');

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {clusterKeys.map((key, index) => {
          const slug = clusterSlugs[index];
          const Icon = clusterIcons[slug];

          return (
            <Link
              key={key}
              href={`/${locale}/clusters/${slug}`}
              className="group flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-accent"
            >
              {showIcons && (
                <Icon className="h-5 w-5 text-green-600 group-hover:text-green-700" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium group-hover:text-green-700">
                  {t(`${key}.title`)}
                </div>
                <div className="line-clamp-1 text-xs text-muted-foreground">
                  {t(`${key}.description`)}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-green-600" />
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {clusterKeys.map((key, index) => {
          const slug = clusterSlugs[index];
          const Icon = clusterIcons[slug];

          return (
            <div
              key={key}
              className="flex items-start space-x-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              {showIcons && (
                <div className="flex-shrink-0 rounded-lg bg-green-50 p-2">
                  <Icon className="h-6 w-6 text-green-600" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">{t(`${key}.title`)}</h3>
                <p className="text-muted-foreground">
                  {t(`${key}.description`)}
                </p>
                <Link
                  href={`/${locale}/clusters/${slug}`}
                  className="group inline-flex items-center font-medium text-green-600 hover:text-green-700"
                >
                  {t('learnMore')}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {clusterKeys.map((key, index) => {
        const slug = clusterSlugs[index];
        const Icon = clusterIcons[slug];

        return (
          <Card key={key} className="group transition-shadow hover:shadow-lg">
            <CardHeader>
              {showIcons && (
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-green-50 p-2">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              )}
              <CardTitle className="text-lg">{t(`${key}.title`)}</CardTitle>
              <CardDescription>{t(`${key}.description`)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {(() => {
                    const benefits = t(`${key}.benefits`);
                    const benefitsArray = Array.isArray(benefits)
                      ? benefits
                      : [];
                    return benefitsArray.slice(0, 3).map(benefit => (
                      <li key={benefit} className="flex items-start">
                        <span className="mr-2 text-green-600">•</span>
                        {benefit}
                      </li>
                    ));
                  })()}
                </ul>
                <Link
                  href={`/${locale}/clusters/${slug}`}
                  className="group inline-flex items-center font-medium text-green-600 hover:text-green-700"
                >
                  {t('viewDetails')}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
