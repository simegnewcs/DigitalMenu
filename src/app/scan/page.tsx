import QRScanner from '@/components/QRScanner';
import Link from 'next/link';

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-amber-800 text-white py-4 px-4 text-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">Dagmaros Cafe & Restaurant</h1>
          <p className="text-amber-200 text-sm">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8">
        <QRScanner />
      </main>
    </div>
  );
}
