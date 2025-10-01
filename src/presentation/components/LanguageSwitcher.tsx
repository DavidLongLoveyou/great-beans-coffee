'use client';

import { Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import type { Locale } from '@/i18n';
import { Button } from '@/presentation/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import {
  getAllLocales,
  getLocaleFromPathname,
  addLocaleToPathname,
  removeLocaleFromPathname,
} from '@/shared/utils/locale';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const allLocales = getAllLocales();

  const currentLocaleData = allLocales.find(
    locale => locale.code === currentLocale
  );

  const handleLocaleChange = (newLocale: string) => {
    const cleanPathname = removeLocaleFromPathname(pathname);
    const newPath = addLocaleToPathname(cleanPathname, newLocale as Locale);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <span className="mr-2 text-base">
            {currentLocaleData?.flag || '🌐'}
          </span>
          <span className="hidden sm:inline">
            {currentLocaleData?.name || 'Language'}
          </span>
          <span className="sm:hidden">{currentLocale.toUpperCase()}</span>
          <Globe className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {allLocales.map(locale => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className={`cursor-pointer ${
              locale.code === currentLocale
                ? 'bg-accent text-accent-foreground'
                : ''
            }`}
          >
            <span className="mr-3 text-base">{locale.flag}</span>
            <span className="flex-1">{locale.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {locale.code.toUpperCase()}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
