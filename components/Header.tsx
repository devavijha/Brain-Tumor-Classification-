import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-600"></div>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            NeuroCore
          </h1>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 smooth-transition">
            Platform
          </Link>
          <Link href="/clinical-validation" className="text-sm font-medium text-gray-500 hover:text-gray-900 smooth-transition">
            Clinical Validation
          </Link>
          <Link href="/request-access" className="px-5 py-2 rounded-full text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white smooth-transition">
            Request Access
          </Link>
        </div>
      </div>
    </header>
  );
}
