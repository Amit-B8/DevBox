'use client';

import { useState } from 'react';
import { FinanceTool, Field, Result, panel, button, money } from '../finance-tool';
import { compoundGrowth } from '../calculations';

export default function CompoundInterest() {
  const [initial, setInitial] = useState('10000');
  const [monthly, setMonthly] = useState('250');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('10');
  const [points, setPoints] = useState<ReturnType<typeof compoundGrowth>>([]);
  const final = points.at(-1);
  const change = (setter: (value: string) => void) => (value: string) => { setter(value); setPoints([]); };
  const line = (key: 'balance' | 'deposits') => points.map((point) => `${40 + point.year / Number(years) * 560},${200 - point[key] / Math.max(1, final?.balance ?? 1) * 170}`).join(' ');

  return (
    <FinanceTool title="Compound Interest Calculator" description="Project savings growth with a starting balance and regular monthly contributions.">
      <form className={`${panel} space-y-4`} onSubmit={(event) => { event.preventDefault(); setPoints(compoundGrowth(Number(initial), Number(monthly), Number(rate), Number(years))); }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Starting balance ($)" value={initial} onChange={change(setInitial)} max={1e9} />
          <Field label="Monthly contribution ($)" value={monthly} onChange={change(setMonthly)} max={1e6} />
          <Field label="Assumed annual rate (%)" value={rate} onChange={change(setRate)} max={50} />
          <Field label="Years to grow" value={years} onChange={change(setYears)} min={1} max={100} step={1} />
        </div>
        <button className={button}>Calculate</button>
      </form>
      {final && <section className={`${panel} mt-6 space-y-4`} aria-live="polite">
        <h2 className="text-lg font-semibold">Results</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Result label="Projected balance" value={money(final.balance)} />
          <Result label="Total contributions" value={money(final.deposits)} />
          <Result label="Interest earned" value={money(final.interest)} />
        </div>
        <div className="flex flex-wrap gap-4 text-xs"><span className="text-green-400">Total balance (solid)</span><span className="text-blue-400">Contributions (dashed)</span></div>
        <svg viewBox="0 0 640 240" role="img" aria-label={`Savings growth over ${years} years to ${money(final.balance)}`} className="w-full">
          <text x="40" y="18" fill="#9ca3af" fontSize="12">{money(final.balance)}</text>
          <line x1="40" y1="200" x2="600" y2="200" stroke="#4b5563" />
          <polyline points={line('balance')} fill="none" stroke="#4ade80" strokeWidth="3" />
          <polyline points={line('deposits')} fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="6 5" />
          <text x="40" y="230" fill="#9ca3af" fontSize="12">Year 0</text><text x="600" y="230" textAnchor="end" fill="#9ca3af" fontSize="12">Year {years}</text>
        </svg>
        <details><summary className="cursor-pointer text-sm text-slate-300">Yearly breakdown</summary>
          <div className="mt-4 max-h-80 overflow-auto"><table className="w-full text-right text-sm">
            <caption className="sr-only">Projected annual savings</caption>
            <thead><tr>{['Year', 'Contributions', 'Interest', 'Balance'].map((label) => <th scope="col" key={label} className="p-2 text-gray-400">{label}</th>)}</tr></thead>
            <tbody>{points.map((point) => <tr key={point.year} className="border-t border-gray-800"><th scope="row" className="p-2">{point.year}</th>{[point.deposits, point.interest, point.balance].map((value, index) => <td key={index} className="p-2 whitespace-nowrap">{money(value)}</td>)}</tr>)}</tbody>
          </table></div>
        </details>
      </section>}
      <p className="mt-6 text-xs text-gray-400">Assumes monthly compounding at the annual rate divided by 12, with contributions at month-end. Excludes taxes, fees, and inflation. This hypothetical growth is not guaranteed.</p>
    </FinanceTool>
  );
}
