import Link from 'next/link';
import Image from 'next/image';
import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function Home() {
  const menuUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/menu';

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-red-950">
      <header className="py-8 px-4 text-center border-b-2 border-amber-600/50">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-amber-500 shadow-xl">
          <Image 
            src="/dagmaroslogo.jpg" 
            alt="Dagmaros Logo" 
            width={80} 
            height={80} 
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-amber-400 tracking-wide">Dagmaros Cafe & Restaurant</h1>
        <p className="text-amber-300/80 mt-2">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-b from-red-900/90 to-red-950/90 rounded-2xl shadow-2xl p-8 text-center border-2 border-amber-600/30">
            <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-t-xl py-3 px-6 -mx-8 -mt-8 mb-6">
              <h2 className="text-xl font-bold text-red-950">Digital Menu</h2>
            </div>
            
            <p className="text-amber-200/80 mb-6">Scan this QR code to view our menu on your phone</p>
            
            <div className="mb-8 p-6 bg-white rounded-xl inline-block shadow-inner">
              <QRCodeDisplay url={menuUrl} />
            </div>

            <div className="space-y-4">
              <Link
                href="/menu"
                className="block w-full bg-gradient-to-r from-amber-600 to-amber-500 text-red-950 py-4 rounded-lg font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg border-2 border-amber-400"
              >
                View Menu
              </Link>
              <Link
                href="/scan"
                className="block w-full bg-red-900/80 text-amber-300 py-4 rounded-lg font-bold hover:bg-red-800 transition-all border-2 border-amber-600/50"
              >
                Scan QR Code
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center border-t-2 border-amber-600/50 mt-12">
        <p className="text-amber-400/60 text-sm">Thank you for visiting Dagmaros Cafe & Restaurant</p>
        <p className="text-amber-300/40 text-xs mt-1">አስተማማኝ አገልግሎት እናበርክታለን</p>
        <p className="text-amber-500/50 text-xs mt-3">
          Developed by <a href="https://www.devvoltz.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline transition-colors">DevVoltz Technology PLC</a>
        </p>
      </footer>
    </div>
  );
}
