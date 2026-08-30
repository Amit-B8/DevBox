'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Thermometer } from 'lucide-react';

export default function ThermalCalculator() {
  const [tempA, setTempA] = useState('25');
  const [tempB, setTempB] = useState('100');
  const [thermalResistance, setThermalResistance] = useState('0.5');
  const [result, setResult] = useState<number | null>(null);

  const calculateHeatFlow = () => {
    const t1 = parseFloat(tempA);
    const t2 = parseFloat(tempB);
    const r = parseFloat(thermalResistance);

    if (isNaN(t1) || isNaN(t2) || isNaN(r)) {
      alert('Please enter valid numbers for all fields');
      return;
    }

    if (r <= 0) {
      alert('Thermal resistance must be greater than 0');
      return;
    }

    // Q = ΔT / R
    const deltaT = Math.abs(t1 - t2);
    const heatFlow = deltaT / r;

    setResult(heatFlow);
  };

  const handleClear = () => {
    setTempA('25');
    setTempB('100');
    setThermalResistance('0.5');
    setResult(null);
  };

  const examples = [
    {
      name: 'Room Temperature Transfer',
      t1: 20,
      t2: 30,
      r: 2.0,
      q: (30 - 20) / 2.0,
      desc: 'Typical room to room'
    },
    {
      name: 'CPU to Heatsink',
      t1: 80,
      t2: 30,
      r: 0.25,
      q: (80 - 30) / 0.25,
      desc: 'Electronic cooling'
    },
    {
      name: 'Insulated System',
      t1: 100,
      t2: 20,
      r: 5.0,
      q: (100 - 20) / 5.0,
      desc: 'Poor heat transfer'
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back Button */}
        <Link
          href="/engineering"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Engineering Toolkit
        </Link>

        {/* Header */}
        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Thermometer className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">Thermal Calculator</h1>
          </div>
          <p className="text-gray-400">Calculate heat flow (Q) based on temperature difference and thermal resistance. Essential for thermal design, cooling systems, and mechanical engineering analysis.</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formula Display */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Heat Transfer Formula</p>
              <div className="p-4 bg-gray-800 rounded border border-gray-700 font-mono text-center">
                <p className="text-lg text-blue-400">Q = ΔT / R</p>
                <p className="text-xs text-gray-500 mt-2">Heat Flow = Temperature Difference / Thermal Resistance</p>
                <p className="text-xs text-gray-500 mt-1">Units: [Watts] = [°C or K] / [°C/W or K/W]</p>
              </div>
            </div>

            {/* Input Section */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-4">
              <h2 className="text-lg font-semibold text-gray-100">Inputs</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperature 1 (°C or K)
                </label>
                <input
                  type="number"
                  value={tempA}
                  onChange={(e) => setTempA(e.target.value)}
                  placeholder="Enter temperature"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., 25 for room temperature</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperature 2 (°C or K)
                </label>
                <input
                  type="number"
                  value={tempB}
                  onChange={(e) => setTempB(e.target.value)}
                  placeholder="Enter temperature"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., 100 for hot surface</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thermal Resistance (°C/W or K/W)
                </label>
                <input
                  type="number"
                  value={thermalResistance}
                  onChange={(e) => setThermalResistance(e.target.value)}
                  placeholder="Enter thermal resistance"
                  step="0.01"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., 0.5 for efficient heat transfer</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={calculateHeatFlow}
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

            {/* Result Section */}
            {result !== null && (
              <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-4">
                <h2 className="text-lg font-semibold text-gray-100">Heat Flow Result</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded border border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Temperature Difference (ΔT)</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {Math.abs(parseFloat(tempA) - parseFloat(tempB)).toFixed(2)}°
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded border border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Heat Flow (Q)</p>
                    <p className="text-2xl font-bold text-green-400">
                      {result.toFixed(2)} W
                    </p>
                  </div>
                </div>

                {/* Formula Breakdown */}
                <div className="p-4 bg-gray-800 rounded border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Calculation Breakdown</p>
                  <div className="font-mono text-sm space-y-1">
                    <p className="text-gray-300">
                      ΔT = |{parseFloat(tempA).toFixed(2)} - {parseFloat(tempB).toFixed(2)}| = {Math.abs(parseFloat(tempA) - parseFloat(tempB)).toFixed(2)}°
                    </p>
                    <p className="text-gray-300">
                      Q = {Math.abs(parseFloat(tempA) - parseFloat(tempB)).toFixed(2)} / {parseFloat(thermalResistance).toFixed(2)} = <span className="text-green-400">{result.toFixed(2)} W</span>
                    </p>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="p-4 bg-gray-800 rounded border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Interpretation</p>
                  <p className="text-sm text-gray-300">
                    {result < 10
                      ? '💧 Low heat flow - Good insulation or small temperature difference'
                      : result < 100
                      ? '🔥 Moderate heat flow - Typical thermal application'
                      : '🌡️ High heat flow - Requires efficient cooling or low thermal resistance'}
                  </p>
                </div>
              </div>
            )}

            {/* Theory Section */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Heat Transfer Fundamentals</h3>
              <div className="space-y-2 text-xs text-gray-400">
                <p><span className="text-gray-300">Thermal Resistance (R):</span> Opposition to heat flow, analogous to electrical resistance</p>
                <p><span className="text-gray-300">Temperature Difference (ΔT):</span> Driving force for heat transfer</p>
                <p><span className="text-gray-300">Heat Flow (Q):</span> Rate of heat energy transfer, measured in Watts</p>
                <p className="pt-2 text-gray-500">Applications: CPU cooling, building insulation, thermal design</p>
              </div>
            </div>
          </div>

          {/* Examples Sidebar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Example Scenarios</h3>
            <div className="space-y-3">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTempA(example.t1.toString());
                    setTempB(example.t2.toString());
                    setThermalResistance(example.r.toString());
                    setResult(example.q);
                  }}
                  className="w-full text-left p-4 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
                >
                  <p className="font-medium text-sm text-gray-100">{example.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{example.desc}</p>
                  <p className="text-xs text-blue-400 font-mono mt-2">
                    ΔT={Math.abs(example.t1 - example.t2)}° R={example.r}°C/W → {example.q.toFixed(1)}W
                  </p>
                </button>
              ))}
            </div>

            {/* Reference Values */}
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-xs font-semibold text-gray-300 mb-3">Typical R Values</p>
              <div className="space-y-2 text-xs text-gray-400 font-mono">
                <p>CPU → Heatsink: ~0.1-0.3 °C/W</p>
                <p>Air gap: ~1.0 °C/W</p>
                <p>Insulation: ~2-10 °C/W</p>
                <p>Foam: ~5-20 °C/W</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
