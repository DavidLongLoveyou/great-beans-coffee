'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface NextIntlProviderProps {
  children: ReactNode;
  messages: any;
  locale: string;
}

export function NextIntlProvider({ children, messages, locale }: NextIntlProviderProps) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}