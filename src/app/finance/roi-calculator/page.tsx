'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [roi, setRoi] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);

    if (!initial || initial <= 0 || isNaN(final)) {
      alert('Please enter valid positive numbers');
      return;
    }

    const profitValue = final - initial;
    const roiValue = (profitValue / initial) * 100;

    setProfit(profitValue);
    setRoi(roiValue);
  };

  const handleClear = () => {
    setInitialInvestment('');
    setFinalValue('');
    setRoi(null);
    setProfit(null);
  };

  const examples = [
    { name: 'Conservative Stock', initial: 10000, final: 11000, roi: 10 },
    { name: 'Growth Stock', initial: 10000, final: 15000, roi: 50 },
    { name: 'Real Estate', initial: 200000, final: 250000, roi: 25 },
    { name: 'Cryptocurrency', initial: 5000, final: 8000, roi: 60 },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Back Button */}
        <Link
          href="/finance"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Finance & Economics
        </Link>

        {/* Header */}
        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">ROI Calculator</h1>
          </div>
          <p className="text-gray-400">Calculate the return on investment percentage for any investment scenario. Understand your gains at a glance.</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Initial Investment ($)
                </label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="Enter initial investment amount"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Final Value ($)
                </label>
                <input
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  placeholder="Enter final value after investment"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={calculateROI}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors duration-200"
                >
                  Calculate
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded font-medium transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Results */}
            {roi !== null && (
              <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-4">
                <h2 className="text-lg font-semibold text-gray-100">Results</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Profit/Loss</p>
                    <p className={`text-2xl font-bold ${profit! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${profit?.toFixed(2)}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">ROI</p>
                    <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {roi.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Formula Display */}
                <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-400 font-mono">
                  <p>ROI = (Final Value - Initial Investment) / Initial Investment × 100</p>
                  <p className="mt-2">
                    ROI = ({finalValue} - {initialInvestment}) / {initialInvestment} × 100 = {roi.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Examples Sidebar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Example Scenarios</h3>
            <div className="space-y-3">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInitialInvestment(example.initial.toString());
                    setFinalValue(example.final.toString());
                  }}
                  className="w-full text-left p-4 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
                >
                  <p className="font-medium text-sm text-gray-100">{example.name}</p>
                  <p className="text-xs text-gray-400 mt-1">${example.initial.toLocaleString()} → ${example.final.toLocaleString()}</p>
                  <p className="text-xs text-green-400 font-mono mt-1">{example.roi}% ROI</p>
                </button>
              ))}
            </div>

            {/* Quick Reference */}
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-xs font-semibold text-gray-300 mb-3">ROI Interpretation</p>
              <div className="space-y-2 text-xs text-gray-400">
                <p><span className="text-green-400">Positive:</span> Profit made</p>
                <p><span className="text-red-400">Negative:</span> Loss incurred</p>
                <p><span className="text-gray-300">&gt; 20%:</span> Strong returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
