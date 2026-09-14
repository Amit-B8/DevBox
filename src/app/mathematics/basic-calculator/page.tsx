'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function BasicCalculator() {
  const [input, setInput] = useState('');

  const calculate = () => {
    try {
      const sanitized = input.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function(`"use strict"; return (${sanitized})`)();
      setInput(String(result));
    } catch {
      setInput('Error');
    }
  };

  const appendValue = (value: string) => {
    setInput((current) => (current === 'Error' ? value : current + value));
  };

  const clearInput = () => setInput('');

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to DevBox
        </Link>

        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="mb-3 flex items-center gap-3">
            <Calculator className="h-7 w-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">Basic Calculator</h1>
          </div>
          <p className="text-gray-400">Quick arithmetic for everyday calculations.</p>
        </header>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 rounded-lg border border-gray-700 bg-gray-950 p-4 text-right text-2xl font-semibold text-white">
            {input || '0'}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '(', ')'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => appendValue(value)}
                className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-lg font-medium text-gray-100 transition-colors hover:bg-gray-700"
              >
                {value}
              </button>
            ))}
            <button
              type="button"
              onClick={clearInput}
              className="col-span-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-lg font-medium text-gray-100 transition-colors hover:bg-gray-700"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => appendValue('+')}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-lg font-medium text-gray-100 transition-colors hover:bg-gray-700"
            >
              +
            </button>
            <button
              type="button"
              onClick={calculate}
              className="col-span-1 rounded-lg border border-blue-600 bg-blue-600 px-3 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-500"
            >
              =
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
