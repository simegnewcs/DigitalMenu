import QRScanner from '@/components/QRScanner';
import Link from 'next/link';
import Image from 'next/image';

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-red-950">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-b-2 border-amber-600/50 shadow-2xl">
        <div className="py-4 px-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Center Banner Text */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-wide">Dagmaros Cafe & Restaurant</h1>
              <p className="text-amber-300/80 text-sm md:text-base mt-1">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
            </div>
            
            {/* Right Side Logo */}
            <Link href="/" className="shrink-0 ml-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-amber-500 shadow-lg">
                <Image 
                  src="/dagmaroslogo.jpg" 
                  alt="Dagmaros Logo" 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <QRScanner />
      </main>

      <footer className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-t-2 border-amber-600/50 py-6 text-center mt-auto">
        <p className="text-amber-400/60 text-sm">Thank you for visiting Dagmaros Cafe & Restaurant</p>
        <p className="text-amber-300/40 text-xs mt-1">አስተማማኝ አገልግሎት እናበርክታለን</p>
        <p className="text-amber-500/50 text-xs mt-3">
          Developed by <a href="https://www.devvoltz.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline transition-colors">DevVoltz Technology PLC</a>
        </p>
      </footer>
    </div>
  );
}
