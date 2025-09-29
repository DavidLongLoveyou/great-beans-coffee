interface PageProps {
  params: { locale: string };
}

// Simple translation function
async function getTranslation(locale: string) {
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    // Fallback to English
    const messages = await import(`../../../messages/en.json`);
    return messages.default;
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  
  const messages = await getTranslation(locale);
  const heroMessages = messages.hero || {};
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-amber-900 mb-6">
            {heroMessages.title || 'The Great Beans'}
          </h1>
          <p className="text-xl text-amber-700 mb-8 max-w-2xl mx-auto">
            {heroMessages.subtitle || 'Premium Coffee Export Solutions'}
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Explore Our Coffee
            </button>
            <button className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}