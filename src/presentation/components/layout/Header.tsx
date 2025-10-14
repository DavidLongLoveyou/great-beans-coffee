'use client';

import { Coffee, Globe, Award, Truck, Menu, X } from 'lucide-react';
import Link from 'next/link';

import { type Locale } from '@/i18n';
import LanguageSwitcher from '@/presentation/components/LanguageSwitcher';
import { Button } from '@/presentation/components/ui';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/presentation/components/ui/hydration-safe-navigation-menu';
import { useHydrationSafeBooleanState } from '@/shared/hooks/useHydrationSafeState';
import { useTranslation } from '@/shared/hooks/useTranslation';

type Props = {
  locale: Locale;
};

export default function Header({ locale }: Props) {
  const { t } = useTranslation('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen, isMounted] =
    useHydrationSafeBooleanState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-forest-200/20 bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90"
      role="banner"
    >
      <div className="container flex h-18 items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="group flex items-center space-x-3"
          aria-label="The Great Beans - Home"
        >
          <div className="relative">
            <Coffee className="h-9 w-9 text-forest-600 transition-colors duration-200 group-hover:text-forest-700" />
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 opacity-80"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-forest-800 transition-colors duration-200 group-hover:text-forest-900">
              The Great Beans
            </span>
            <span className="text-xs font-medium tracking-wide text-forest-600">
              Premium Coffee Export
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <NavigationMenu
          id="navigation"
          className="hidden lg:flex bg-white/90 backdrop-blur-md rounded-2xl border border-forest-200/40 shadow-lg shadow-forest-900/5 px-3 py-2 ring-1 ring-forest-100/20"
          role="navigation"
          aria-label="Main navigation"
        >
          <NavigationMenuList className="space-x-1">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}`}
                  className="group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-3 py-2 text-sm font-medium text-forest-700 transition-all duration-200 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 focus:text-forest-900 focus:outline-none"
                >
                  {t('home')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-9 px-3 rounded-lg text-sm font-medium text-forest-700 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 data-[state=open]:bg-forest-100 data-[state=open]:text-forest-900">
                {t('products')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-4 p-6 md:w-[480px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-br from-forest-500/90 to-emerald-600/90 p-6 no-underline outline-none transition-all duration-300 hover:shadow-lg focus:shadow-lg"
                        href={`/${locale}/products`}
                      >
                        <Coffee className="mb-3 h-8 w-8 text-white" />
                        <div className="mb-2 text-lg font-semibold text-white">
                          Premium Coffee Export
                        </div>
                        <p className="text-sm leading-relaxed text-white/90">
                          Exceptional Vietnamese coffee beans for global B2B
                          markets
                        </p>
                        <div className="mt-3 flex items-center space-x-4 text-xs text-white/80">
                          <span className="flex items-center">
                            <Globe className="mr-1 h-3 w-3" />
                            Global Export
                          </span>
                          <span className="flex items-center">
                            <Award className="mr-1 h-3 w-3" />
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
                        <div className="text-sm font-semibold leading-none text-forest-800">
                          Vietnamese Robusta
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          Premium Robusta beans with bold flavor profile
                        </p>
                        <div className="text-xs font-medium text-emerald-600">
                          Export Grade • Bulk Available
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/products/arabica`}
                        className="block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100"
                      >
                        <div className="text-sm font-semibold leading-none text-forest-800">
                          Highland Arabica
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          High-altitude specialty Arabica with full traceability
                        </p>
                        <div className="text-xs font-medium text-emerald-600">
                          Specialty Grade • Sustainable Sourcing
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-9 px-3 rounded-lg text-sm font-medium text-forest-700 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 data-[state=open]:bg-forest-100 data-[state=open]:text-forest-900">
                {t('solutions')}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-4 p-6 md:w-[580px] lg:w-[700px] lg:grid-cols-2">
                  <div className="grid gap-3">
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/vietnam-robusta-suppliers`}
                        className="block select-none space-y-2 rounded-lg border border-transparent p-4 leading-none no-underline outline-none transition-all duration-200 hover:border-forest-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100"
                      >
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-emerald-600" />
                          <div className="text-sm font-semibold leading-none text-forest-800">
                            Vietnam Robusta Export
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          Direct farm sourcing with guaranteed quality and
                          logistics
                        </p>
                        <div className="text-xs font-medium text-emerald-600">
                          FOB/CIF Terms • Container Loads
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/specialty-arabica-sourcing`}
                        className="block select-none space-y-2 rounded-lg border border-transparent p-4 leading-none no-underline outline-none transition-all duration-200 hover:border-forest-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100"
                      >
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-emerald-600" />
                          <div className="text-sm font-semibold leading-none text-forest-800">
                            Specialty Arabica Sourcing
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          Highland specialty coffee with full farm traceability
                        </p>
                        <div className="text-xs font-medium text-emerald-600">
                          SCA Graded • Sustainable Certified
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/private-label-coffee-manufacturing`}
                        className="block select-none space-y-2 rounded-lg border border-transparent p-4 leading-none no-underline outline-none transition-all duration-200 hover:border-forest-200 hover:bg-forest-50 hover:shadow-sm focus:bg-forest-100"
                      >
                        <div className="flex items-center space-x-2">
                          <Coffee className="h-4 w-4 text-emerald-600" />
                          <div className="text-sm font-semibold leading-none text-forest-800">
                            Private Label Manufacturing
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-forest-600">
                          Complete OEM/ODM solutions for your coffee brand
                        </p>
                        <div className="text-xs font-medium text-emerald-600">
                          Custom Blends • Packaging Solutions
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="flex flex-col justify-between space-y-4">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-32 w-full select-none flex-col justify-end rounded-xl bg-gradient-to-br from-sage-500/90 to-forest-600/90 p-5 no-underline outline-none transition-all duration-300 hover:shadow-lg focus:shadow-lg"
                        href={`/${locale}/clusters`}
                      >
                        <Globe className="mb-2 h-7 w-7 text-white" />
                        <div className="mb-1 text-base font-semibold text-white">
                          Global Export Solutions
                        </div>
                        <p className="text-sm leading-relaxed text-white/90">
                          Complete B2B coffee export services worldwide
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <div className="space-y-3 rounded-lg bg-forest-50/50 p-4">
                      <div className="text-sm font-semibold text-forest-800">
                        Why Global Partners Choose Us
                      </div>
                      <ul className="space-y-2 text-sm text-forest-700">
                        <li className="flex items-center">
                          <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                          500+ satisfied global clients
                        </li>
                        <li className="flex items-center">
                          <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                          15+ years export experience
                        </li>
                        <li className="flex items-center">
                          <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
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
                  className="group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-3 py-2 text-sm font-medium text-forest-700 transition-all duration-200 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 focus:text-forest-900 focus:outline-none"
                >
                  {t('services')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}/about`}
                  className="group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-3 py-2 text-sm font-medium text-forest-700 transition-all duration-200 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 focus:text-forest-900 focus:outline-none"
                >
                  {t('about')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}/contact`}
                  className="group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-3 py-2 text-sm font-medium text-forest-700 transition-all duration-200 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-100 focus:text-forest-900 focus:outline-none"
                >
                  {t('contact')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-md rounded-2xl border border-forest-200/40 px-4 py-2 shadow-lg shadow-forest-900/5 ring-1 ring-forest-100/20">
          <div className="hidden md:flex">
            <LanguageSwitcher />
          </div>
          <Button asChild className="hidden md:flex h-9 px-4 text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
            <Link href={`/${locale}/quote`}>{t('requestQuote')}</Link>
          </Button>

          {/* Mobile menu button */}
          {isMounted && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-forest-700 transition-all duration-200 hover:bg-forest-50 hover:shadow-md lg:hidden border border-forest-200/40 bg-white/50 backdrop-blur-sm"
              aria-label={
                isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>


      </div>

      {/* Mobile Menu Overlay */}
      {isMounted && isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-md lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Mobile Menu Popup */}
          <div
            id="mobile-menu"
            className="fixed top-20 right-4 z-[9999] w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-forest-200/60 ring-1 ring-forest-100/30 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between border-b border-forest-200 px-4 py-3">
                <span className="text-lg font-semibold text-forest-800">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-forest-700 transition-colors hover:bg-forest-100"
                  aria-label="Close mobile menu"
                  type="button"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav
                className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
                role="navigation"
                aria-label="Mobile navigation"
              >
                <Link
                  href={`/${locale}`}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-50 hover:text-forest-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>

                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-forest-600 bg-forest-50 rounded-md">
                    {t('products')}
                  </div>
                  <Link
                    href={`/${locale}/products`}
                    className="block rounded-md px-4 py-2 text-sm text-forest-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  <Link
                    href={`/${locale}/products/robusta`}
                    className="block rounded-md px-4 py-2 text-sm text-forest-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vietnamese Robusta
                  </Link>
                  <Link
                    href={`/${locale}/products/arabica`}
                    className="block rounded-md px-4 py-2 text-sm text-forest-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Highland Arabica
                  </Link>
                </div>

                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-forest-600 bg-forest-50 rounded-md">
                    {t('solutions')}
                  </div>
                  <Link
                    href={`/${locale}/solutions/vietnam-robusta-export`}
                    className="block rounded-md px-4 py-2 text-sm text-forest-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vietnam Robusta Export
                  </Link>
                  <Link
                    href={`/${locale}/solutions/specialty-arabica-sourcing`}
                    className="block rounded-md px-4 py-2 text-sm text-forest-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Specialty Arabica Sourcing
                  </Link>
                </div>

                <Link
                  href={`/${locale}/services`}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-50 hover:text-forest-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('services')}
                </Link>

                <Link
                  href={`/${locale}/about`}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-50 hover:text-forest-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('about')}
                </Link>

                <Link
                  href={`/${locale}/contact`}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-50 hover:text-forest-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('contact')}
                </Link>
              </nav>

              {/* Mobile menu footer */}
              <div className="border-t border-forest-100 px-4 py-4 bg-forest-25">
                <div className="flex flex-col space-y-3">
                  <LanguageSwitcher />
                  <Button
                    asChild
                    className="w-full h-10 text-sm font-medium bg-forest-600 hover:bg-forest-700 text-white shadow-md"
                  >
                    <Link href={`/${locale}/contact`}>
                      {t('requestQuote')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
