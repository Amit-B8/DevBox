'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Ruler } from 'lucide-react';

export default function UnitConverter() {
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [result, setResult] = useState<number | null>(null);

  const unitCategories = {
    length: {
      name: 'Length',
      units: {
        'millimeters': { label: 'Millimeters (mm)', toBase: 0.001 },
        'centimeters': { label: 'Centimeters (cm)', toBase: 0.01 },
        'meters': { label: 'Meters (m)', toBase: 1 },
        'kilometers': { label: 'Kilometers (km)', toBase: 1000 },
        'inches': { label: 'Inches (in)', toBase: 0.0254 },
        'feet': { label: 'Feet (ft)', toBase: 0.3048 },
        'yards': { label: 'Yards (yd)', toBase: 0.9144 },
        'miles': { label: 'Miles (mi)', toBase: 1609.34 },
      }
    },
    weight: {
      name: 'Weight / Mass',
      units: {
        'milligrams': { label: 'Milligrams (mg)', toBase: 0.001 },
        'grams': { label: 'Grams (g)', toBase: 1 },
        'kilograms': { label: 'Kilograms (kg)', toBase: 1000 },
        'ounces': { label: 'Ounces (oz)', toBase: 28.3495 },
        'pounds': { label: 'Pounds (lbs)', toBase: 453.592 },
        'tons': { label: 'Metric Tons (t)', toBase: 1000000 },
      }
    },
    temperature: {
      name: 'Temperature',
      units: {
        'celsius': { label: 'Celsius (°C)', special: true },
        'fahrenheit': { label: 'Fahrenheit (°F)', special: true },
        'kelvin': { label: 'Kelvin (K)', special: true },
      }
    },
    volume: {
      name: 'Volume',
      units: {
        'milliliters': { label: 'Milliliters (ml)', toBase: 0.001 },
        'liters': { label: 'Liters (L)', toBase: 1 },
        'gallons': { label: 'Gallons (US)', toBase: 3.78541 },
        'fluid_ounces': { label: 'Fluid Ounces (fl oz)', toBase: 0.0295735 },
      }
    },
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius = 0;
    if (from === 'celsius') celsius = value;
    else if (from === 'fahrenheit') celsius = (value - 32) * (5/9);
    else if (from === 'kelvin') celsius = value - 273.15;

    if (to === 'celsius') return celsius;
    else if (to === 'fahrenheit') return (celsius * 9/5) + 32;
    else if (to === 'kelvin') return celsius + 273.15;
    return celsius;
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }

    const categoryObj = unitCategories[category as keyof typeof unitCategories];
    const fromUnitObj = categoryObj.units[fromUnit as keyof typeof categoryObj.units];
    const toUnitObj = categoryObj.units[toUnit as keyof typeof categoryObj.units];

    if (!fromUnitObj || !toUnitObj) return;

    let convertedValue: number;
    if (categoryObj.name === 'Temperature') {
      convertedValue = convertTemperature(value, fromUnit, toUnit);
    } else {
      const baseValue = value * (fromUnitObj as any).toBase;
      convertedValue = baseValue / (toUnitObj as any).toBase;
    }

    setResult(parseFloat(convertedValue.toFixed(6)));
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const units = Object.keys(unitCategories[newCategory as keyof typeof unitCategories].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setResult(null);
  };

  const currentCategory = unitCategories[category as keyof typeof unitCategories];
  const availableUnits = Object.entries(currentCategory.units).map(([key, val]) => ({
    key,
    ...val
  }));

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
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
            <Ruler className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">Unit Converter</h1>
          </div>
          <p className="text-gray-400">Convert between metric and imperial units. Supports length, weight, temperature, and volume conversions for mechanical and engineering applications.</p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Category Selection */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-300">Select Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(unitCategories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                    category === key
                      ? 'bg-blue-600 text-white border border-blue-500'
                      : 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Converter Section */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-6">
            {/* Input Value */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Value to Convert
              </label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Unit Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  From
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableUnits.map((unit) => (
                    <option key={unit.key} value={unit.key}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  To
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableUnits.map((unit) => (
                    <option key={unit.key} value={unit.key}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors duration-200"
            >
              Convert
            </button>
          </div>

          {/* Result */}
          {result !== null && (
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Result</p>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-blue-400">{result}</p>
                <p className="text-lg text-gray-400">
                  {
                    (unitCategories[category as keyof typeof unitCategories].units[toUnit as keyof typeof currentCategory.units] as any)
                      .label
                  }
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {inputValue} {
                  (unitCategories[category as keyof typeof unitCategories].units[fromUnit as keyof typeof currentCategory.units] as any)
                    .label
                } = {result} {
                  (unitCategories[category as keyof typeof unitCategories].units[toUnit as keyof typeof currentCategory.units] as any)
                    .label
                }
              </p>
            </div>
          )}

          {/* Quick Conversions */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Common Conversions</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-800 rounded text-sm">
                <p className="text-gray-400">1 meter =</p>
                <p className="text-blue-400 font-mono">3.28084 feet</p>
              </div>
              <div className="p-3 bg-gray-800 rounded text-sm">
                <p className="text-gray-400">1 kilogram =</p>
                <p className="text-blue-400 font-mono">2.20462 pounds</p>
              </div>
              <div className="p-3 bg-gray-800 rounded text-sm">
                <p className="text-gray-400">1 liter =</p>
                <p className="text-blue-400 font-mono">0.264172 gallons</p>
              </div>
              <div className="p-3 bg-gray-800 rounded text-sm">
                <p className="text-gray-400">°C to °F =</p>
                <p className="text-blue-400 font-mono">(°C × 9/5) + 32</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
