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
          // On successful scan
          if (decodedText.includes('/menu')) {
            scannerRef.current?.stop();
            router.push(decodedText);
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
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Scan Menu QR Code</h2>
        <p className="text-gray-600 mb-6">Point your camera at the QR code to view the menu</p>
        
        <div id="qr-reader" className="w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100"></div>
        
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        
        {!scanning ? (
          <button
            onClick={startScanning}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
}
