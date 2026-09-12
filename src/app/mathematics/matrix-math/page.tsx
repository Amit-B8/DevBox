'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Grid2x2 } from 'lucide-react';

export default function MatrixMathTool() {
  const [matrixA, setMatrixA] = useState('[[1, 2], [3, 4]]');
  const [matrixB, setMatrixB] = useState('[[5, 6], [7, 8]]');
  const [operation, setOperation] = useState('add');

  const parseMatrix = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length === 2 && parsed.every((row) => Array.isArray(row) && row.length === 2)) {
        return parsed.map((row) => row.map(Number));
      }
    } catch {
      return null;
    }

    return null;
  };

  const result = useMemo(() => {
    const a = parseMatrix(matrixA);
    const b = parseMatrix(matrixB);

    if (!a || !b) {
      return 'Please enter valid 2x2 matrices in JSON-like format, e.g. [[1, 2], [3, 4]]';
    }

    const add = a.map((row: number[], i: number) => row.map((value: number, j: number) => value + b[i][j]));
    const subtract = a.map((row: number[], i: number) => row.map((value: number, j: number) => value - b[i][j]));
    const transposeA = a[0].map((_: number, j: number) => a.map((row: number[]) => row[j]));
    const determinantA = a[0][0] * a[1][1] - a[0][1] * a[1][0];

    switch (operation) {
      case 'add':
        return JSON.stringify(add, null, 2);
      case 'subtract':
        return JSON.stringify(subtract, null, 2);
      case 'transposeA':
        return JSON.stringify(transposeA, null, 2);
      case 'determinantA':
        return `${determinantA}`;
      default:
        return JSON.stringify(add, null, 2);
    }
  }, [matrixA, matrixB, operation]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,_#020817_0%,_#020b18_100%)] text-white">
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
              <Grid2x2 className="h-6 w-6 text-sky-300" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50">Matrix Math Tool</h1>
          </div>
          <p className="text-base text-slate-400">
            Run quick 2x2 matrix operations for research, study, and calculations.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Matrix A</label>
              <textarea
                value={matrixA}
                onChange={(event) => setMatrixA(event.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 font-mono text-base text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Matrix B</label>
              <textarea
                value={matrixB}
                onChange={(event) => setMatrixB(event.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 font-mono text-base text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Operation</label>
              <select
                value={operation}
                onChange={(event) => setOperation(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="add">Add matrices</option>
                <option value="subtract">Subtract matrices</option>
                <option value="transposeA">Transpose Matrix A</option>
                <option value="determinantA">Determinant of Matrix A</option>
              </select>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Result</p>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-100">{result}</pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
