import Link from 'next/link';
import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function Home() {
  const menuUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/menu';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <header className="bg-amber-800 text-white py-6 px-4 text-center">
        <h1 className="text-3xl font-bold">Dagmaros Cafe & Restaurant</h1>
        <p className="text-amber-200 mt-2">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Digital Menu</h2>
          <p className="text-gray-600 mb-8">Scan this QR code to view our menu on your phone</p>
          
          <div className="mb-8 p-4 bg-gray-50 rounded-xl inline-block">
            <QRCodeDisplay url={menuUrl} />
          </div>

          <div className="space-y-4">
            <Link
              href="/menu"
              className="block w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              View Menu
            </Link>
            <Link
              href="/scan"
              className="block w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Scan QR Code
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
