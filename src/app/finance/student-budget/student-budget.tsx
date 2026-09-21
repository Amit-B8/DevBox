'use client';

import Link from 'next/link';
import { useState } from 'react';

const groups = [
  { title: 'Monthly money coming in', fields: ['Take-home pay', 'Family support', 'Other available funds'] },
  { title: 'Monthly costs and savings', fields: ['Rent and utilities', 'Groceries and meals', 'Transport', 'Tuition and books', 'Phone and subscriptions', 'Personal and other costs', 'Savings set aside'] },
];
const labels = groups.flatMap(group => group.fields);
const blank = () => labels.map(() => '');
const money = (cents: number) => (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function StudentBudget() {
  const [values, setValues] = useState<string[]>(blank);
  const [copyStatus, setCopyStatus] = useState('');
  const invalid = values.map(value => value !== '' && (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) > 1000000000));
  const hasError = invalid.some(Boolean);
  const hasInput = values.some(value => value !== '');
  const cents = values.map(value => Math.round(Number(value) * 100));
  const income = cents.slice(0, 3).reduce((sum, value) => sum + value, 0);
  const costs = cents.slice(3).reduce((sum, value) => sum + value, 0);
  const remaining = income - costs;
  const ready = hasInput && !hasError;
  const summary = remaining < 0 ? 'Monthly shortfall' : remaining === 0 ? 'Fully allocated' : 'Left after costs and savings';

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/finance" className="text-sm text-blue-400 hover:text-blue-300">&larr; All finance tools</Link>
        <header className="my-6">
          <h1 className="text-3xl font-bold tracking-tight">Student Budget Calculator</h1>
          <p className="mt-2 text-gray-400">See where your money goes and what’s left each month.</p>
          <p className="mt-3 text-sm text-emerald-400">No sign-up. Calculated in your browser. Your entries aren’t saved.</p>
        </header>

        <section aria-label="Budget summary" aria-live="polite" aria-atomic="true" className="mb-6 rounded-xl border border-gray-700 bg-gray-900 p-5">
          {ready ? <>
            <p className="text-sm text-gray-300">{summary}</p>
            <p className={`mt-1 break-all text-4xl font-bold ${remaining < 0 ? 'text-amber-300' : 'text-emerald-400'}`}>{money(Math.abs(remaining))}</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-gray-400">Monthly income</dt><dd className="mt-1 break-all text-lg">{money(income)}</dd></div>
              <div><dt className="text-gray-400">Costs + savings</dt><dd className="mt-1 break-all text-lg">{money(costs)}</dd></div>
            </dl>
            {remaining < 0 && <p className="mt-3 text-sm text-amber-200">Your planned costs and savings exceed your income by {money(-remaining)} per month.</p>}
          </> : <p className="text-gray-300">{hasError ? 'Check the highlighted amounts below to see your budget.' : 'Enter your monthly amounts or try an example to see your budget.'}</p>}
        </section>

        <div className="mb-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => { setValues(['1200', '300', '0', '650', '250', '80', '100', '50', '120', '100']); setCopyStatus(''); }} className="rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-gray-800">Try an example</button>
          <button type="button" onClick={() => { setValues(blank()); setCopyStatus(''); }} className="rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-gray-800">Clear all</button>
        </div>
        <p id="amount-help" className="mb-5 text-sm text-gray-400">Use the same currency for every amount. Enter monthly amounts with up to two decimal places. Empty fields count as zero.</p>
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group, groupIndex) => <fieldset key={group.title} className="min-w-0 space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-5">
            <legend className="px-1 font-semibold">{group.title}</legend>
            {group.fields.map((label, index) => {
              const fieldIndex = groupIndex === 0 ? index : index + 3;
              return <div key={label}>
                <label htmlFor={`amount-${fieldIndex}`} className="mb-2 block text-sm text-gray-300">{label}</label>
                <input id={`amount-${fieldIndex}`} type="number" inputMode="decimal" min="0" max="1000000000" step="0.01" placeholder="0.00" value={values[fieldIndex]} onChange={event => { setValues(current => current.map((value, i) => i === fieldIndex ? event.target.value : value)); setCopyStatus(''); }} aria-invalid={invalid[fieldIndex]} aria-describedby={invalid[fieldIndex] ? `error-${fieldIndex} amount-help` : 'amount-help'} className={`w-full rounded-lg border bg-gray-950 px-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${invalid[fieldIndex] ? 'border-amber-400' : 'border-gray-600'}`} />
                {invalid[fieldIndex] && <p id={`error-${fieldIndex}`} className="mt-1 text-sm text-amber-300">Enter an amount from 0 to 1,000,000,000 with up to two decimal places.</p>}
              </div>;
            })}
          </fieldset>)}
        </div>
        <button type="button" disabled={!ready} onClick={async () => {
          try {
            await navigator.clipboard.writeText(['Monthly student budget', ...labels.map((label, index) => `${label}: ${money(cents[index])}`), `Total income: ${money(income)}`, `Total costs and savings: ${money(costs)}`, `${summary}: ${money(Math.abs(remaining))}`].join('\n'));
            setCopyStatus('Budget copied.');
          } catch { setCopyStatus('Copy was blocked by your browser. Select and copy your results manually.'); }
        }} className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">Copy budget</button>
        <p role="status" className="mt-2 text-sm text-gray-300">{copyStatus}</p>
        <section className="mt-6 space-y-2 text-sm leading-6 text-gray-400">
          <h2 className="font-semibold text-gray-200">Planning for a semester?</h2>
          <p>Divide a semester’s costs or available funds by the number of months they need to cover before entering them here. Only include funds available for living costs after any direct tuition payments, and avoid counting the same cost twice.</p>
          <p>Money left = monthly income − monthly costs − savings set aside. This is a monthly snapshot; it doesn’t track when bills or payments arrive.</p>
        </section>
      </div>
    </main>
  );
}
