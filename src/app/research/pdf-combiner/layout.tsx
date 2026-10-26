import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';

const title = 'PDF Combiner – Merge PDF Files Online | DevBox';
const description = 'Combine up to 30 PDF files into one document online. Arrange files in your preferred order, then merge and download directly in your browser. No sign-up needed.';
const url = `${siteConfig.siteUrl.replace(/\/$/, '')}/research/pdf-combiner/`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: siteConfig.siteName,
    locale: 'en_US',
    type: 'website',
  },
};

export default function PdfCombinerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
