import type { Metadata } from 'next';
import MathToolPage from '../math-tool-page';

const title = "Statistics Calculator";
const description = "Find mean, median, range, variance, and standard deviation for a set of numbers.";
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: '/mathematics/statistics-calculator' },
  openGraph: { title, description, url: '/mathematics/statistics-calculator' },
  twitter: { card: 'summary', title, description },
};

export default function Page() {
  return <MathToolPage title={title} description={description} kind="statistics" explanation="The mean is the sum divided by the count. The median is the middle sorted value, or the average of the two middle values. Population variance divides the sum of squared distances from the mean by n; sample variance divides it by n − 1 and requires at least two values. Standard deviation is the square root of variance. Use population results for a complete group and sample results when estimating a larger population." />;
}

