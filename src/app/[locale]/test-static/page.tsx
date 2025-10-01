export default function TestStaticPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Static Route Test</h1>
        <p className="text-lg text-gray-600">
          This is a static route without dynamic [locale] parameter
        </p>
        <p className="mt-4 text-green-600 font-semibold">
          ✅ Static routing is working!
        </p>
      </div>
    </div>
  );
}