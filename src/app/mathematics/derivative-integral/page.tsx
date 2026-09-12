'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, FunctionSquare } from 'lucide-react';

const formatValue = (value: number) => {
  if (!Number.isFinite(value)) {
    return 'undefined';
  }

  return value.toFixed(4).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '');
};

const normalizeExpression = (expression: string) => {
  return expression
    .replace(/\s+/g, '')
    .replace(/\^/g, '**')
    .replace(/sin\(/gi, 'Math.sin(')
    .replace(/cos\(/gi, 'Math.cos(')
    .replace(/tan\(/gi, 'Math.tan(')
    .replace(/sqrt\(/gi, 'Math.sqrt(')
    .replace(/abs\(/gi, 'Math.abs(')
    .replace(/exp\(/gi, 'Math.exp(')
    .replace(/ln\(/gi, 'Math.log(')
    .replace(/log\(/gi, 'Math.log(')
    .replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\be\b/gi, 'Math.E');
};

const evaluateExpression = (expression: string, x: number) => {
  const normalized = normalizeExpression(expression).replace(/x/gi, `(${x})`);
  const evaluator = new Function(`"use strict"; return (${normalized});`);
  return evaluator();
};

const numericalDerivative = (expression: string, x: number) => {
  const h = 1e-4;
  const forward = evaluateExpression(expression, x + h);
  const backward = evaluateExpression(expression, x - h);

  return (forward - backward) / (2 * h);
};

const numericalIntegral = (expression: string, start: number, end: number, steps = 1000) => {
  if (start === end) {
    return 0;
  }

  const n = Math.max(2, steps);
  const h = (end - start) / n;

  let sum = evaluateExpression(expression, start) + evaluateExpression(expression, end);

  for (let i = 1; i < n; i += 1) {
    const x = start + i * h;
    const value = evaluateExpression(expression, x);
    sum += i % 2 === 0 ? 2 * value : 4 * value;
  }

  return (h / 3) * sum;
};

export default function DerivativeIntegralExplorer() {
  const [expression, setExpression] = useState('x^2 + 3x + 1');
  const [point, setPoint] = useState('2');
  const [result, setResult] = useState<string>('');

  const evaluateDerivative = () => {
    try {
      const x = Number(point);

      if (!Number.isFinite(x)) {
        setResult('Please enter a valid number for x.');
        return;
      }

      const value = evaluateExpression(expression, x);
      const derivative = numericalDerivative(expression, x);
      const integral = numericalIntegral(expression, 0, x);

      setResult(
        `Expression value at x = ${formatValue(x)}: ${formatValue(value)}\n` +
          `Derivative at x = ${formatValue(x)}: ${formatValue(derivative)}\n` +
          `Integral from 0 to ${formatValue(x)}: ${formatValue(integral)}`
      );
    } catch {
      setResult('Unable to evaluate this expression. Try a simpler form.');
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_30%),linear-gradient(180deg,_#020817_0%,_#020b18_100%)] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-slate-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to DevBox
        </Link>

        <header className="mb-10 border-b border-slate-800 pb-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-2.5 shadow-[0_0_20px_rgba(59,130,246,0.18)]">
              <FunctionSquare className="h-6 w-6 text-sky-300" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50">Derivative & Integral Explorer</h1>
          </div>
          <p className="text-base text-slate-400">
            Estimate common derivatives, values, and simple integrals for expressions like x^2 + 3x + 1.
          </p>
        </header>

        <div className="space-y-6 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Expression</label>
              <input
                type="text"
                value={expression}
                onChange={(event) => setExpression(event.target.value)}
                placeholder="x^2 + 3x + 1"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Evaluate at x =</label>
              <input
                type="number"
                value={point}
                onChange={(event) => setPoint(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={evaluateDerivative}
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Evaluate
            </button>
            <div className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Supports: x, sin, cos, tan, sqrt, exp, log, pi, e
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Result</p>
            <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-100">{result || 'No result yet.'}</pre>
          </div>
        </div>
      </div>
    </main>
  );
}
