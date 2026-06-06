'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  url: string;
}

export default function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url).then(setQrCode);
  }, [url]);

  if (!qrCode) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={qrCode} alt="Menu QR Code" className="w-full h-full object-contain" />
  );
}
