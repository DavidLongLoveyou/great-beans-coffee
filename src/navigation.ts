import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from './i18n';

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames: {
      '/': '/',
      '/about': '/about',
      '/products': '/products',
      '/services': '/services',
      '/contact': '/contact',
    }
  });