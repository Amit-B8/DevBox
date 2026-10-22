'use client';

import { useState } from 'react';
import { formatNumber, percentage, quadratic, readNumber, statistics } from '@/lib/math-tools';

const EXAMPLE_DATASET = '2, 4, 4, 4, 5, 5, 7, 9';

export default function MathCalculator({ kind }: { kind: 'percentage' | 'quadratic' | 'statistics' }) {
  const [mode, setMode] = useState('of');
  const [values, setValues] = useState(kind === 'quadratic' ? ['1', '-3', '2'] : ['20', '150']);
  const [dataset, setDataset] = useState('');
  const isEmptyDataset = kind === 'statistics' && !dataset.trim();
  const labels = kind === 'quadratic' ? ['Coefficient a', 'Coefficient b', 'Coefficient c'] : mode === 'of' ? ['Percentage (%)', 'Base value'] : mode === 'change' ? ['New value', 'Original value'] : ['Part', 'Whole'];
  let error = '';
  let results: [string, string][] = [];
  try {
    if (kind === 'statistics') {
      if (!isEmptyDataset) {
        results = Object.entries(statistics(dataset)).map(([label, value]) => [label, value === null ? 'Requires at least 2 values' : formatNumber(value)]);
      }
    } else {
      const numbers = values.map(readNumber);
      results = kind === 'quadratic'
        ? quadratic(numbers[0], numbers[1], numbers[2]).map((value, index) => [index === 0 ? 'Solution' : 'Additional result', value])
        : [['Result', `${formatNumber(percentage(mode, numbers[0], numbers[1]))}${mode === 'of' ? '' : '%'}`]];
    }
  } catch (caught) {
    error = caught instanceof Error ? caught.message : 'Check your input.';
  }
  const inputClass = 'mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      {kind === 'percentage' && <label className="mb-6 block text-sm text-gray-300">Calculation
        <select className={inputClass} value={mode} onChange={event => setMode(event.target.value)}>
          <option value="of">What is X% of a number?</option>
          <option value="ratio">What percent is one number of another?</option>
          <option value="change">Percentage increase or decrease</option>
        </select>
      </label>}
      {kind === 'statistics' ? <div>
        <button
          type="button"
          onClick={() => setDataset(EXAMPLE_DATASET)}
          className="mb-3 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-blue-500 hover:bg-gray-700 hover:text-white"
        >
          Load example
        </button>
        <label className="block text-sm text-gray-300">Numbers (separated by commas, spaces, or semicolons)
        <textarea className={inputClass} rows={5} value={dataset} onChange={event => setDataset(event.target.value)} aria-describedby="data-help" />
        <span id="data-help" className="mt-2 block text-gray-400">Up to 10,000 numbers. Use a period for decimals; do not use thousands separators.</span>
        </label>
      </div> : <div className="grid gap-4 sm:grid-cols-2">
        {labels.map((label, index) => <label key={label} className="block text-sm text-gray-300">{label}
          <input className={inputClass} type="number" step="any" value={values[index]} onChange={event => setValues(current => current.map((value, i) => i === index ? event.target.value : value))} />
        </label>)}
      </div>}
      <div className="mt-6" aria-live="polite" aria-atomic="true">
        {isEmptyDataset ? <p className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-400">Enter your numbers or click Load example to see statistics.</p> : error ? <p className="rounded-lg border border-amber-800 bg-amber-950/30 p-4 text-amber-200">{error}</p> : <dl className="grid gap-3 sm:grid-cols-2">
          {results.map(([label, value]) => <div key={label} className="rounded-lg border border-gray-700 bg-gray-950 p-4">
            <dt className="text-sm text-gray-400">{label}</dt><dd className="mt-1 break-words text-xl font-semibold">{value}</dd>
          </div>)}
        </dl>}
      </div>
      <p className="mt-4 text-xs text-gray-400">Results update as you type and are rounded to 12 significant digits. Calculations run in your browser.</p>
    </div>
  );
}
