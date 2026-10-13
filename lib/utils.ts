import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatCurrency(amount: number): string {
  return `ETB ${Number(amount).toFixed(2)}`;
}

export function generateQRCodeUrl(slug: string, tableNumber?: number): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  if (tableNumber) {
    return `${baseUrl}/menu/${slug}?table=${tableNumber}`;
  }
  return `${baseUrl}/menu/${slug}`;
}
