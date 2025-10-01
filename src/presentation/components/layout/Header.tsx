'use client';

import { Coffee, Globe, Award, Truck } from 'lucide-react';
import Link from 'next/link';

import { type Locale } from '@/i18n';
import LanguageSwitcher from '@/presentation/components/LanguageSwitcher';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Button,
} from '@/presentation/components/ui';
import { useTranslation } from '@/shared/hooks/useTranslation';

type Props = {
  locale: Locale;
};

export default function Header({ locale }: Props) {
  const { t } = useTranslation('navigation');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-forest-200/20 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container flex h-18 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-3 group">
          <div className="relative">
            <Coffee className="h-9 w-9 text-forest-600 group-hover:text-forest-700 transition-colors duration-200" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full opacity-80"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-forest-800 group-hover:text-forest-900 transition-colors duration-200">
              The Great Beans
            </span>
            <span className="text-xs text-forest-600 font-medium tracking-wide">
              Premium Coffee Export
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}`}
                  className="group inline-flex h-11 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-forest-700 transition-all duration-200 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 focus:text-forest-900 focus:outline-none"
                >
                  {t('home')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 rounded-lg text-forest-700 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 data-[state=open]:bg-forest-100 data-[state=open]:text-forest-900">
                {t('products')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-4 p-6 md:w-[480px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-br from-forest-500/90 to-emerald-600/90 p-6 no-underline outline-none focus:shadow-lg hover:shadow-lg transition-all duration-300"
                        href={`/${locale}/products`}
                      >
                        <Coffee className="h-8 w-8 text-white mb-3" />
                        <div className="mb-2 text-lg font-semibold text-white">
                          Premium Coffee Export
                        </div>
                        <p className="text-sm leading-relaxed text-white/90">
                          Exceptional Vietnamese coffee beans for global B2B markets
                        </p>
                        <div className="mt-3 flex items-center space-x-4 text-xs text-white/80">
                          <span className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            Global Export
                          </span>
                          <span className="flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            Premium Quality
                          </span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid gap-3">
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/products/robusta`}
                        className="block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100"
                      >
                        <div className="text-sm font-semibold text-forest-800 leading-none">
                          Vietnamese Robusta
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          Premium Robusta beans with bold flavor profile
                        </p>
                        <div className="text-xs text-emerald-600 font-medium">
                          Export Grade • Bulk Available
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/products/arabica`}
                        className="block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100"
                      >
                        <div className="text-sm font-semibold text-forest-800 leading-none">
                          Highland Arabica
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          High-altitude specialty Arabica with full traceability
                        </p>
                        <div className="text-xs text-emerald-600 font-medium">
                          Specialty Grade • Sustainable Sourcing
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 rounded-lg text-forest-700 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 data-[state=open]:bg-forest-100 data-[state=open]:text-forest-900">
                {t('solutions')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-4 p-6 md:w-[580px] lg:w-[700px] lg:grid-cols-2">
                  <div className="grid gap-3">
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/vietnam-robusta-suppliers`}
                        className="block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100 border border-transparent hover:border-forest-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-emerald-600" />
                          <div className="text-sm font-semibold text-forest-800 leading-none">
                            Vietnam Robusta Export
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          Direct farm sourcing with guaranteed quality and logistics
                        </p>
                        <div className="text-xs text-emerald-600 font-medium">
                          FOB/CIF Terms • Container Loads
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/specialty-arabica-sourcing`}
                        className="block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100 border border-transparent hover:border-forest-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-emerald-600" />
                          <div className="text-sm font-semibold text-forest-800 leading-none">
                            Specialty Arabica Sourcing
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          Highland specialty coffee with full farm traceability
                        </p>
                        <div className="text-xs text-emerald-600 font-medium">
                          SCA Graded • Sustainable Certified
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/private-label-coffee-manufacturing`}
                        className="block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100 border border-transparent hover:border-forest-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Coffee className="h-4 w-4 text-emerald-600" />
                          <div className="text-sm font-semibold text-forest-800 leading-none">
                            Private Label Manufacturing
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          Complete OEM/ODM solutions for your coffee brand
                        </p>
                        <div className="text-xs text-emerald-600 font-medium">
                          Custom Blends • Packaging Solutions
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="flex flex-col justify-between space-y-4">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-32 w-full select-none flex-col justify-end rounded-xl bg-gradient-to-br from-sage-500/90 to-forest-600/90 p-5 no-underline outline-none focus:shadow-lg hover:shadow-lg transition-all duration-300"
                        href={`/${locale}/clusters`}
                      >
                        <Globe className="h-7 w-7 text-white mb-2" />
                        <div className="mb-1 text-base font-semibold text-white">
                          Global Export Solutions
                        </div>
                        <p className="text-sm leading-relaxed text-white/90">
                          Complete B2B coffee export services worldwide
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <div className="space-y-3 bg-forest-50/50 rounded-lg p-4">
                      <div className="text-sm font-semibold text-forest-800">Why Global Partners Choose Us</div>
                      <ul className="space-y-2 text-sm text-forest-700">
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2"></div>
                          500+ satisfied global clients
                        </li>
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2"></div>
                          15+ years export experience
                        </li>
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2"></div>
                          ISO & Fair Trade certified
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}/services`}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {t('services')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}/about`}
                  className="group inline-flex h-11 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-forest-700 transition-all duration-200 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 focus:text-forest-900 focus:outline-none"
                >
                  {t('about')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}/contact`}
                  className="group inline-flex h-11 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-forest-700 transition-all duration-200 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 focus:text-forest-900 focus:outline-none"
                >
                  {t('contact')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Button asChild>
            <Link href={`/${locale}/quote`}>{t('requestQuote')}</Link>
          </Button>
        </div>
        
        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="emerald" 
            size="sm" 
            className="h-11 px-6 font-semibold shadow-emerald-soft hover:shadow-emerald-medium transition-all duration-300"
            asChild
          >
            <Link href={`/${locale}/quote`}>
              Get Quote
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
