'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';

export default function IOLPowerCalculator() {
  const [axialLength, setAxialLength] = useState('23.5');
  const [keratometry, setKeratometry] = useState('43.5');
  const [targetRefraction, setTargetRefraction] = useState('-0.25');
  const [aConstant, setAConstant] = useState('118.8');

  const results = useMemo(() => {
    const al = Number(axialLength);
    const k = Number(keratometry);
    const ref = Number(targetRefraction);
    const a = Number(aConstant);

    if (!Number.isFinite(al) || !Number.isFinite(k) || !Number.isFinite(ref) || !Number.isFinite(a)) {
      return null;
    }

    const approximatePower = a - 2.5 * al - 0.9 * k + 0.5 * (ref * -1);

    const focalLengthMm = 1000 / Math.max(0.1, approximatePower);

    return {
      approximatePower: Number(approximatePower.toFixed(2)),
      focalLengthMm: Number(focalLengthMm.toFixed(1)),
    };
  }, [aConstant, axialLength, keratometry, targetRefraction]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/medical"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Medical Toolkit
        </Link>

        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">IOL Power & Focal Length Calculator</h1>
          </div>
          <p className="text-gray-400">
            A lightweight clinical research estimator for approximate intraocular lens power and corresponding focal length.
          </p>
        </header>

        <div className="space-y-8">
          <div className="space-y-4 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Axial Length (mm)</label>
              <input
                type="number"
                step="0.1"
                value={axialLength}
                onChange={(e) => setAxialLength(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Keratometry (D)</label>
              <input
                type="number"
                step="0.1"
                value={keratometry}
                onChange={(e) => setKeratometry(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Refraction (D)</label>
              <input
                type="number"
                step="0.01"
                value={targetRefraction}
                onChange={(e) => setTargetRefraction(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">A-Constant</label>
              <input
                type="number"
                step="0.1"
                value={aConstant}
                onChange={(e) => setAConstant(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {results && (
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Estimated Results</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">Approx. IOL Power</p>
                  <p className="mt-2 text-3xl font-bold text-blue-400">{results.approximatePower.toFixed(2)} D</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">Equivalent Focal Length</p>
                  <p className="mt-2 text-3xl font-bold text-blue-400">{results.focalLengthMm} mm</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-5 bg-gray-900 rounded-lg border border-gray-800 text-sm text-gray-400 leading-relaxed">
            This calculator uses a simplified clinical estimate and should be interpreted as a research-oriented approximation rather than a validated surgical planning tool.
          </div>
        </div>
      </div>
    </main>
  );
}
