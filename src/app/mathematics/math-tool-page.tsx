import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MathCalculator from './math-calculator';

export default function MathToolPage({ title, description, kind, explanation }: {
  title: string; description: string; kind: 'percentage' | 'quadratic' | 'statistics'; explanation: string;
}) {
  return <main className="min-h-screen bg-gray-950 text-white">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/mathematics" className="mb-8 inline-flex items-center text-sm text-slate-400 hover:text-slate-200"><ArrowLeft className="mr-2 h-4 w-4" />Back to Mathematics</Link>
      <header className="mb-8 border-b border-gray-800 pb-6"><h1 className="mb-3 text-3xl font-bold tracking-tight">{title}</h1><p className="text-gray-400">{description}</p></header>
      <MathCalculator kind={kind} />
      <section className="mt-8"><h2 className="mb-3 text-xl font-semibold">How it works</h2><p className="leading-relaxed text-gray-400">{explanation}</p></section>
    </div>
  </main>;
}
