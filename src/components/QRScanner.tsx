'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      scannerRef.current = new Html5Qrcode('qr-reader');
      
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // On successful scan - redirect to /menu
          scannerRef.current?.stop();
          if (decodedText.includes('/menu')) {
            router.push(decodedText);
          } else {
            // If scanned URL doesn't have /menu, append it
            const url = decodedText.replace(/\/$/, '') + '/menu';
            router.push(url);
          }
        },
        (errorMessage) => {
          // Handle scan error silently
        }
      );
      
      setScanning(true);
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      setScanning(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-gradient-to-b from-red-900/90 to-red-950/90 rounded-2xl shadow-2xl p-6 text-center border-2 border-amber-600/30">
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-xl py-3 px-4 -mx-2 -mt-2 mb-4">
          <h2 className="text-xl font-bold text-red-950">Scan Menu QR Code</h2>
        </div>
        <p className="text-amber-200/80 mb-6">Point your camera at the QR code to view the menu</p>
        
        <div id="qr-reader" className="w-full aspect-square mb-4 rounded-lg overflow-hidden bg-black border-2 border-amber-600/50"></div>
        
        {error && (
          <p className="text-red-400 mb-4 bg-red-950/50 py-2 px-3 rounded">{error}</p>
        )}
        
        {!scanning ? (
          <button
            onClick={startScanning}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-red-950 py-3 rounded-lg font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg border-2 border-amber-400"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="w-full bg-red-900/80 text-amber-300 py-3 rounded-lg font-bold hover:bg-red-800 transition-all border-2 border-amber-600/50"
          >
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
}
