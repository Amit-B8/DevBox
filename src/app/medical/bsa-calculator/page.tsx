'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Activity } from 'lucide-react';

export default function BSACalculator() {
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');

  const bsa = useMemo(() => {
    const height = Number(heightCm);
    const weight = Number(weightKg);

    if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) {
      return null;
    }

    const result = Math.sqrt((height * weight) / 3600);
    return Number(result.toFixed(2));
  }, [heightCm, weightKg]);

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
            <Activity className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">Body Surface Area Calculator</h1>
          </div>
          <p className="text-gray-400">Estimate body surface area using the Mosteller formula for clinical and perioperative planning.</p>
        </header>

        <div className="space-y-8">
          <div className="space-y-4 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
              <input
                type="number"
                step="1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {bsa !== null && (
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-2">Body Surface Area</p>
              <p className="text-3xl font-bold text-blue-400">{bsa} m²</p>
            </div>
          )}

          <div className="p-5 bg-gray-900 rounded-lg border border-gray-800 text-sm text-gray-400 leading-relaxed">
            Formula used: BSA = sqrt((height × weight) / 3600) where height is in cm and weight is in kg.
          </div>
        </div>
      </div>
    </main>
  );
}
