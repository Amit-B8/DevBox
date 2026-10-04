import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';

export const panel = 'p-6 bg-gray-900 rounded-lg border border-gray-800';
export const input = 'w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500';
export const button = 'px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors';
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export function FinanceTool({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/finance" className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Finance Tools
        </Link>
        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-7 h-7 shrink-0 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-gray-400">{description}</p>
        </header>
        {children}
      </div>
    </main>
  );
}

export function Field({ label, value, onChange, min = 0, max, step = 'any' }: { label: string; value: string; onChange: (value: string) => void; min?: number; max?: number; step?: string | number }) {
  return <label className="block text-sm font-medium text-gray-300">{label}<input type="number" required min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} className={`${input} mt-2`} /></label>;
}

export function Result({ label, value }: { label: string; value: string }) {
  return <div className="p-4 bg-gray-800 rounded border border-gray-700"><p className="text-xs text-gray-400 mb-1">{label}</p><p className="text-2xl font-bold text-green-400 break-words">{value}</p></div>;
}
