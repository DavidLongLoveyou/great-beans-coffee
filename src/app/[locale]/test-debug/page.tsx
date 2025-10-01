interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function TestDebugPage({ params }: PageProps) {
  const { locale } = await params;
  
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-green-800">
        Debug Test Page
      </h1>
      <p className="mt-4 text-xl text-gray-600">
        Current locale: <strong>{locale}</strong>
      </p>
      <p className="mt-2 text-lg text-gray-600">
        This page does not use next-intl translations
      </p>
    </div>
  );
}