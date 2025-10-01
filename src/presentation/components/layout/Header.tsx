'use client';

import { Coffee } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <Coffee className="h-8 w-8 text-green-600" />
          <span className="text-xl font-bold text-green-800">
            The Great Beans
          </span>
        </Link>

        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}`}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {t('home')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{t('products')}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-green-500/50 to-green-700/50 p-6 no-underline outline-none focus:shadow-md"
                        href={`/${locale}/products`}
                      >
                        <Coffee className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Premium Coffee
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Discover our exceptional Vietnamese coffee beans
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid gap-2">
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/products/robusta`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Robusta
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Premium Vietnamese Robusta beans
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/products/arabica`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Arabica
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          High-altitude Vietnamese Arabica
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{t('solutions')}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                  <div className="grid gap-2">
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/vietnam-robusta-suppliers`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Vietnam Robusta Suppliers
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Premium Robusta with direct farm sourcing
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/specialty-arabica-sourcing`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Specialty Arabica Sourcing
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Highland Arabica with full traceability
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/clusters/private-label-coffee-manufacturing`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Private Label Manufacturing
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          End-to-end manufacturing solutions
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="flex flex-col justify-center space-y-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-green-500/50 to-green-700/50 p-4 no-underline outline-none focus:shadow-md"
                        href={`/${locale}/clusters`}
                      >
                        <Coffee className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-sm font-medium">
                          View All Solutions
                        </div>
                        <p className="text-xs leading-tight text-muted-foreground">
                          Explore our complete range of coffee expertise
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Why Choose Us?</div>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• 500+ global clients</li>
                        <li>• 15+ years experience</li>
                        <li>• Quality assured</li>
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
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {t('about')}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}/contact`}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
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
      </div>
    </header>
  );
}
