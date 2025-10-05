export default function TestStaticPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Static Route Test</h1>
        <p className="text-lg text-gray-600">
          This is a static route without dynamic [locale] parameter
        </p>
        <p className="mt-4 font-semibold text-green-600">
          ✅ Static routing is working!
        </p>
      </div>
    </div>
  );
}
