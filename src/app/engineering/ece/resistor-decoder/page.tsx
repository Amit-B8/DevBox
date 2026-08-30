'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';

export default function ResistorDecoder() {
  const colorValues: { [key: string]: number } = {
    black: 0,
    brown: 1,
    red: 2,
    orange: 3,
    yellow: 4,
    green: 5,
    blue: 6,
    violet: 7,
    grey: 8,
    white: 9,
  };

  const colorNames = Object.keys(colorValues);
  const colorHex: { [key: string]: string } = {
    black: '#1F2937',
    brown: '#92400E',
    red: '#DC2626',
    orange: '#F97316',
    yellow: '#EAB308',
    green: '#16A34A',
    blue: '#2563EB',
    violet: '#7C3AED',
    grey: '#6B7280',
    white: '#F3F4F6',
  };

  const [band1, setBand1] = useState('brown');
  const [band2, setBand2] = useState('black');
  const [band3, setBand3] = useState('red');
  const [tolerance, setTolerance] = useState('gold');

  const toleranceValues: { [key: string]: string } = {
    gold: '±5%',
    silver: '±10%',
    brown: '±1%',
    red: '±2%',
    green: '±0.5%',
    blue: '±0.25%',
    violet: '±0.1%',
  };

  const calculateResistance = () => {
    const firstDigit = colorValues[band1];
    const secondDigit = colorValues[band2];
    const multiplier = colorValues[band3];

    // Base value
    const baseValue = firstDigit * 10 + secondDigit;

    // Apply multiplier (10^multiplier)
    const resistance = baseValue * Math.pow(10, multiplier);

    return resistance;
  };

  const formatResistance = (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2).replace(/\.?0+$/, '') + ' MΩ';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2).replace(/\.?0+$/, '') + ' kΩ';
    } else {
      return value.toFixed(2).replace(/\.?0+$/, '') + ' Ω';
    }
  };

  const resistance = calculateResistance();
  const toleranceValue = toleranceValues[tolerance] || '±5%';

  const examples = [
    { name: 'Common 1kΩ', band1: 'brown', band2: 'black', band3: 'red', tolerance: 'gold' },
    { name: '10kΩ', band1: 'brown', band2: 'black', band3: 'orange', tolerance: 'gold' },
    { name: '100kΩ', band1: 'brown', band2: 'black', band3: 'yellow', tolerance: 'gold' },
    { name: '47Ω (precision)', band1: 'yellow', band2: 'violet', band3: 'black', tolerance: 'brown' },
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
          Back to Engineering & Systems
        </Link>

        {/* Header */}
        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">Resistor Color Decoder</h1>
          </div>
          <p className="text-gray-400">Decode 4-band resistor color codes to find the resistance value in ohms. Essential tool for electronics and PCB assembly.</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Decoder Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resistor Visual */}
            <div className="p-8 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-6">Select Color Bands</p>
              
              {/* Resistor Visualization */}
              <div className="flex justify-center items-center gap-2 mb-8">
                {/* Resistor body */}
                <div className="flex items-center gap-1 px-8 py-6 bg-gradient-to-b from-gray-700 to-gray-600 rounded-full border-2 border-gray-500">
                  {/* Band 1 */}
                  <div
                    className="w-4 h-16 rounded-full border border-gray-800"
                    style={{ backgroundColor: colorHex[band1] }}
                    title={`Band 1: ${band1} = ${colorValues[band1]}`}
                  />
                  {/* Band 2 */}
                  <div
                    className="w-4 h-16 rounded-full border border-gray-800"
                    style={{ backgroundColor: colorHex[band2] }}
                    title={`Band 2: ${band2} = ${colorValues[band2]}`}
                  />
                  <div className="w-2 h-16 bg-gray-500" /> {/* Space */}
                  {/* Band 3 (Multiplier) */}
                  <div
                    className="w-4 h-16 rounded-full border border-gray-800"
                    style={{ backgroundColor: colorHex[band3] }}
                    title={`Band 3 (Multiplier): ${band3} = 10^${colorValues[band3]}`}
                  />
                  <div className="w-2 h-16 bg-gray-500" /> {/* Space */}
                  {/* Tolerance */}
                  <div
                    className="w-4 h-16 rounded-full border border-gray-800"
                    style={{ backgroundColor: colorHex[tolerance] }}
                    title={`Tolerance: ${tolerance} = ${toleranceValue}`}
                  />
                </div>
              </div>

              {/* Band Labels */}
              <div className="text-center text-xs text-gray-500 space-y-2">
                <p>Bands: [1st Digit] [2nd Digit] [Multiplier] [Tolerance]</p>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4 p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Band 1 (1st Digit)</label>
                <select
                  value={band1}
                  onChange={(e) => setBand1(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {colorNames.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)} ({colorValues[color]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Band 2 (2nd Digit)</label>
                <select
                  value={band2}
                  onChange={(e) => setBand2(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {colorNames.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)} ({colorValues[color]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Band 3 (Multiplier)</label>
                <select
                  value={band3}
                  onChange={(e) => setBand3(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {colorNames.map((color) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)} (×10<sup>{colorValues[color]}</sup>)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Band 4 (Tolerance)</label>
                <select
                  value={tolerance}
                  onChange={(e) => setTolerance(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(toleranceValues).map(([color, value]) => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)} ({value})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Calculated Resistance</p>
              <div className="space-y-4">
                <div>
                  <p className="text-4xl font-bold text-blue-400">{formatResistance(resistance)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500">Tolerance</p>
                    <p className="text-lg font-mono text-gray-300">{toleranceValue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ohms Value</p>
                    <p className="text-lg font-mono text-gray-300">{resistance.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Common Examples</h3>
            <div className="space-y-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBand1(example.band1);
                    setBand2(example.band2);
                    setBand3(example.band3);
                    setTolerance(example.tolerance);
                  }}
                  className="w-full text-left p-3 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
                >
                  <p className="font-medium text-sm text-gray-100">{example.name}</p>
                  <div className="flex gap-1 mt-2">
                    {[example.band1, example.band2, example.band3, example.tolerance].map((band, i) => (
                      <div
                        key={i}
                        className="flex-1 h-4 rounded border border-gray-700"
                        style={{ backgroundColor: colorHex[band] }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Color Reference */}
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-xs font-semibold text-gray-300 mb-3">Color Values</p>
              <div className="space-y-2 text-xs">
                {colorNames.slice(0, 5).map((color) => (
                  <div key={color} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-700"
                      style={{ backgroundColor: colorHex[color] }}
                    />
                    <span className="text-gray-400">{color}: {colorValues[color]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
