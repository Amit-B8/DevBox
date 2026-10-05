import type { Metadata } from 'next';
import MathToolPage from '../math-tool-page';

const title = "Quadratic Equation Solver";
const description = "Solve quadratic equations with real or complex roots, including linear special cases.";
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: '/mathematics/quadratic-solver' },
  openGraph: { title, description, url: '/mathematics/quadratic-solver' },
  twitter: { card: 'summary', title, description },
};

export default function Page() {
  return <MathToolPage title={title} description={description} kind="quadratic" explanation="Enter a, b, and c for ax² + bx + c = 0. The quadratic formula is x = (−b ± √(b² − 4ac)) / (2a). A positive discriminant gives two real roots, zero gives a repeated root, and a negative discriminant gives complex roots. If a is zero, the solver handles the remaining linear equation. For example, x² − 3x + 2 = 0 has roots 1 and 2." />;
}

