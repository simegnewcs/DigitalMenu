'use client';

import Link from 'next/link';
import Image from 'next/image';
import QRCodeDisplay from '@/components/QRCodeDisplay';

export default function Home() {
  const menuUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/menu';

  const downloadPage = () => {
    // Get the main content element
    const content = document.querySelector('.min-h-screen');
    if (!content) return;

    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dagmaros Menu - Download</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Times New Roman', Times, serif;
              font-weight: bold;
              background: linear-gradient(to bottom, #450a0a, #7f1d1d, #450a0a);
              min-height: 100vh;
              color: #fbbf24;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }
            header {
              padding: 30px 20px;
              border-bottom: 2px solid #d97706;
              text-align: center;
            }
            .logo {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 3px solid #f59e0b;
              margin: 0 auto 15px;
              display: block;
            }
            h1 {
              font-size: 28px;
              color: #fbbf24;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 16px;
              color: #fcd34d;
            }
            .card {
              background: linear-gradient(to bottom, rgba(127, 29, 29, 0.9), rgba(69, 10, 10, 0.9));
              border: 3px solid #d97706;
              border-radius: 20px;
              padding: 30px;
              margin: 20px 0;
              box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            }
            .card-header {
              background: linear-gradient(to right, #d97706, #fbbf24, #d97706);
              margin: -30px -30px 20px;
              padding: 15px 30px;
              border-radius: 17px 17px 0 0;
              color: #450a0a;
              font-size: 20px;
            }
            .qr-container {
              background: white;
              padding: 20px;
              border-radius: 15px;
              display: inline-block;
              margin: 20px 0;
              box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
            }
            .qr-code {
              width: 250px;
              height: 250px;
            }
            .instructions {
              color: #fcd34d;
              font-size: 14px;
              margin: 15px 0;
            }
            .url {
              color: #d97706;
              font-size: 12px;
              margin-top: 20px;
              word-break: break-all;
            }
            footer {
              padding: 20px;
              border-top: 2px solid #d97706;
              margin-top: 20px;
            }
            .footer-text {
              color: #fbbf24;
              font-size: 14px;
              opacity: 0.8;
            }
            .dev-credit {
              color: #d97706;
              font-size: 12px;
              margin-top: 10px;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <header>
              <img src="/dagmaroslogo.jpg" class="logo" alt="Dagmaros Logo" />
              <h1>Dagmaros Cafe & Restaurant</h1>
              <p class="subtitle">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
            </header>
            
            <div class="card">
              <div class="card-header">Digital Menu</div>
              <p class="instructions">Scan this QR code to view our menu on your phone</p>
              <div class="qr-container">
                <div class="qr-code">
                  ${document.querySelector('[data-qr-container]')?.innerHTML || ''}
                </div>
              </div>
              <p class="url">${menuUrl}</p>
            </div>
            
            <footer>
              <p class="footer-text">Thank you for visiting Dagmaros Cafe & Restaurant</p>
              <p class="footer-text">አስተማማኝ አገልግሎት እናበርክታለን</p>
              <p class="dev-credit">Powered by DevVoltz Technology PLC</p>
            </footer>
          </div>
          <script>
            setTimeout(() => window.print(), 500);
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-red-950">
      <header className="py-6 sm:py-8 px-4 text-center border-b-2 border-amber-600/50">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 rounded-full overflow-hidden border-2 border-amber-500 shadow-xl">
          <Image 
            src="/dagmaroslogo.jpg" 
            alt="Dagmaros Logo" 
            width={80} 
            height={80} 
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-amber-400 tracking-wide">Dagmaros Cafe & Restaurant</h1>
        <p className="text-amber-300/80 text-sm sm:text-base mt-1 sm:mt-2">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-b from-red-900/90 to-red-950/90 rounded-2xl shadow-2xl p-5 sm:p-8 text-center border-2 border-amber-600/30">
            <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-t-xl py-2 sm:py-3 px-4 sm:px-6 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-red-950">Digital Menu</h2>
            </div>
            
            <p className="text-amber-200/80 text-sm sm:text-base mb-4 sm:mb-6">Scan this QR code to view our menu on your phone</p>

            {/* Download Button - Top */}
            <button
              onClick={downloadPage}
              className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-bold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg border-2 border-blue-400 text-sm sm:text-base flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Menu Page
            </button>

            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-xl inline-block shadow-inner">
              <div className="w-48 h-48 sm:w-64 sm:h-64">
                <QRCodeDisplay url={menuUrl} />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Link
                href="/menu"
                className="block w-full bg-gradient-to-r from-amber-600 to-amber-500 text-red-950 py-3 sm:py-4 rounded-lg font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg border-2 border-amber-400 text-sm sm:text-base"
              >
                View Menu
              </Link>
              <Link
                href="/scan"
                className="block w-full bg-red-900/80 text-amber-300 py-3 sm:py-4 rounded-lg font-bold hover:bg-red-800 transition-all border-2 border-amber-600/50 text-sm sm:text-base"
              >
                Scan QR Code
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 sm:py-6 text-center border-t-2 border-amber-600/50 mt-8 sm:mt-12">
        <p className="text-amber-400/60 text-xs sm:text-sm">Thank you for visiting Dagmaros Cafe & Restaurant</p>
        <p className="text-amber-300/40 text-xs mt-1">አስተማማኝ አገልግሎት እናበርክታለን</p>
        <p className="text-amber-500/50 text-xs mt-2 sm:mt-3">
          Developed by <a href="https://www.devvoltz.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline transition-colors">DevVoltz Technology PLC</a>
        </p>
      </footer>
    </div>
  );
}
