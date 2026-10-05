import type { Metadata } from 'next';
import MathToolPage from '../math-tool-page';

const title = "Percentage Calculator";
const description = "Calculate percentages, ratios, and percentage increases or decreases.";
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: '/mathematics/percentage-calculator' },
  openGraph: { title, description, url: '/mathematics/percentage-calculator' },
  twitter: { card: 'summary', title, description },
};

export default function Page() {
  return <MathToolPage title={title} description={description} kind="percentage" explanation="To find X% of a value, multiply the value by X / 100. To find what percent a part is of a whole, divide the part by the whole and multiply by 100. Percentage change is (new − original) / |original| × 100, so a positive result means an increase. A zero original value has no defined percentage change. For example, going from 150 to 180 is a 20% increase." />;
}

