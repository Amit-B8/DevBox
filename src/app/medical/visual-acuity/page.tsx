'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';

export default function VisualAcuityConverter() {
  const [snellenInput, setSnellenInput] = useState('');
  const [logmarResult, setLogmarResult] = useState<number | null>(null);
  const [conversionMode, setConversionMode] = useState<'snellen-to-logmar' | 'logmar-to-snellen'>('snellen-to-logmar');

  // Convert Snellen to LogMAR
  const convertSnellenToLogMAR = (snellen: string) => {
    // Parse "20/20" format
    const parts = snellen.split('/');
    if (parts.length !== 2) return null;
    
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    
    if (!numerator || !denominator || numerator <= 0 || denominator <= 0) return null;
    
    const logmar = Math.log10(denominator / numerator);
    return parseFloat(logmar.toFixed(2));
  };

  // Convert LogMAR to Snellen
  const convertLogMARToSnellen = (logmar: string) => {
    const logmarNum = parseFloat(logmar);
    if (isNaN(logmarNum)) return null;
    
    // Assuming standard 20/x format
    const denominator = 20 * Math.pow(10, logmarNum);
    return `20/${Math.round(denominator)}`;
  };

  const handleConvert = () => {
    if (conversionMode === 'snellen-to-logmar') {
      const result = convertSnellenToLogMAR(snellenInput);
      setLogmarResult(result);
    } else {
      const result = convertLogMARToSnellen(snellenInput);
      setLogmarResult(result as any);
    }
  };

  const commonSnellenValues = [
    { snellen: '20/20', logmar: '0.0', description: 'Normal vision' },
    { snellen: '20/30', logmar: '0.18', description: 'Slight reduction' },
    { snellen: '20/40', logmar: '0.30', description: 'Moderate reduction' },
    { snellen: '20/60', logmar: '0.48', description: 'Significant reduction' },
    { snellen: '20/100', logmar: '0.70', description: 'Legal blindness threshold' },
    { snellen: '20/200', logmar: '1.0', description: 'Legally blind' },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Back Button */}
        <Link
          href="/medical"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Medical Sciences
        </Link>

        {/* Header */}
        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">Visual Acuity Converter</h1>
          </div>
          <p className="text-gray-400">Convert between Snellen fractions and LogMAR values for clinical ophthalmic assessment and research.</p>
        </header>

        {/* Main Content */}
        <div className="space-y-10">
          {/* Conversion Mode Selector */}
          <div className="flex gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="snellen-to-logmar"
                checked={conversionMode === 'snellen-to-logmar'}
                onChange={(e) => setConversionMode(e.target.value as any)}
                className="w-4 h-4 text-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm">Snellen → LogMAR</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="logmar-to-snellen"
                checked={conversionMode === 'logmar-to-snellen'}
                onChange={(e) => setConversionMode(e.target.value as any)}
                className="w-4 h-4 text-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm">LogMAR → Snellen</span>
            </label>
          </div>

          {/* Input Section */}
          <div className="space-y-4 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {conversionMode === 'snellen-to-logmar' ? 'Snellen Fraction' : 'LogMAR Value'}
              </label>
              <input
                type="text"
                value={snellenInput}
                onChange={(e) => setSnellenInput(e.target.value)}
                placeholder={conversionMode === 'snellen-to-logmar' ? 'e.g., 20/20' : 'e.g., 0.0'}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {conversionMode === 'snellen-to-logmar' && (
                <p className="text-xs text-gray-500 mt-2">Format: numerator/denominator (e.g., 20/40)</p>
              )}
            </div>

            <button
              onClick={handleConvert}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors duration-200"
            >
              Convert
            </button>
          </div>

          {/* Result Section */}
          {logmarResult !== null && (
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-2">Result</p>
              <p className="text-3xl font-bold text-blue-400">
                {typeof logmarResult === 'string' ? logmarResult : logmarResult.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {conversionMode === 'snellen-to-logmar' 
                  ? 'LogMAR value (Log of the Minimum Angle of Resolution)'
                  : 'Snellen equivalent (20/x format)'}
              </p>
            </div>
          )}

          {/* Reference Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-100">Reference Chart</h2>
            <div className="overflow-x-auto border border-gray-800 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900 border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-gray-300">Snellen</th>
                    <th className="px-4 py-3 text-left text-gray-300">LogMAR</th>
                    <th className="px-4 py-3 text-left text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {commonSnellenValues.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                      <td className="px-4 py-3 font-mono text-blue-400">{row.snellen}</td>
                      <td className="px-4 py-3 font-mono">{row.logmar}</td>
                      <td className="px-4 py-3 text-gray-400">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
