import { getTranslations } from '@/lib/translations';
import { locales, localeLabels } from '@/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations(locale);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">{t('homepage.title')}</h1>
        <p className="text-lg">{t('homepage.description')}</p>
        <p className="text-sm text-gray-600">Current locale: {locale}</p>
        
        <div className="flex gap-4">
          {locales.map((loc) => (
            <a 
              key={loc} 
              href={`/${loc}`} 
              className={`px-4 py-2 rounded ${
                loc === locale 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {localeLabels[loc]}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
