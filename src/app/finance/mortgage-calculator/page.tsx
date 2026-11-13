import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';
import MortgageCalculator from './mortgage-calculator';

const title = 'Mortgage Calculator – Estimate Monthly Payments | DevBox';
const description = 'Estimate fixed-rate mortgage payments with property tax, homeowners insurance, HOA and PMI. View total interest and a yearly amortization summary.';
const url = `${siteConfig.siteUrl.replace(/\/$/, '')}/finance/mortgage-calculator/`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: siteConfig.siteName, type: 'website' },
};

export default function Page() {
  return <MortgageCalculator />;
}
