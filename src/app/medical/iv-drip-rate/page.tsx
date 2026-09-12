'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, HeartPulse } from 'lucide-react';

export default function IVDripRateCalculator() {
  const [volume, setVolume] = useState('500');
  const [timeHours, setTimeHours] = useState('4');
  const [dropFactor, setDropFactor] = useState('15');

  const results = useMemo(() => {
    const vol = Number(volume);
    const hours = Number(timeHours);
    const factor = Number(dropFactor);

    if (!Number.isFinite(vol) || !Number.isFinite(hours) || !Number.isFinite(factor) || hours <= 0) {
      return null;
    }

    const totalMinutes = hours * 60;
    const mlPerHour = vol / hours;
    const gttPerMinute = (vol * factor) / totalMinutes;

    return {
      mlPerHour: Number(mlPerHour.toFixed(2)),
      gttPerMinute: Number(gttPerMinute.toFixed(2)),
    };
  }, [dropFactor, timeHours, volume]);

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
            <HeartPulse className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">IV Drip Rate Calculator</h1>
          </div>
          <p className="text-gray-400">Quickly estimate infusion rate in mL/hr and drops per minute for nursing and clinical workflows.</p>
        </header>

        <div className="space-y-8">
          <div className="space-y-4 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Volume (mL)</label>
              <input
                type="number"
                step="1"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (hours)</label>
              <input
                type="number"
                step="0.1"
                value={timeHours}
                onChange={(e) => setTimeHours(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Drop Factor (gtt/mL)</label>
              <input
                type="number"
                step="1"
                value={dropFactor}
                onChange={(e) => setDropFactor(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {results && (
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Estimated Infusion Rate</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">mL/hr</p>
                  <p className="mt-2 text-3xl font-bold text-blue-400">{results.mlPerHour.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">gtt/min</p>
                  <p className="mt-2 text-3xl font-bold text-blue-400">{results.gttPerMinute.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-5 bg-gray-900 rounded-lg border border-gray-800 text-sm text-gray-400 leading-relaxed">
            Formula used: mL/hr = volume ÷ hours and gtt/min = (volume × drop factor) ÷ total minutes.
          </div>
        </div>
      </div>
    </main>
  );
}
