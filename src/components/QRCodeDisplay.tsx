'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  url: string;
}

export default function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    QRCode.toString(url, { type: 'svg' }).then(setQrCode);
  }, [url]);

  if (!qrCode) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  return (
    <div 
      data-qr-container 
      className="w-full h-full flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: qrCode }}
    />
  );
}
