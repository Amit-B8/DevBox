'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Palette } from 'lucide-react';

export default function ColorConverter() {
  const [hexInput, setHexInput] = useState('#FF6B6B');
  const [rInput, setRInput] = useState('255');
  const [gInput, setGInput] = useState('107');
  const [bInput, setBInput] = useState('107');
  const [conversionMode, setConversionMode] = useState<'hex-to-rgb' | 'rgb-to-hex'>('hex-to-rgb');

  // Convert HEX to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  };

  // Handle HEX input change
  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (conversionMode === 'hex-to-rgb') {
      const rgb = hexToRgb(value);
      if (rgb) {
        setRInput(rgb.r.toString());
        setGInput(rgb.g.toString());
        setBInput(rgb.b.toString());
      }
    }
  };

  // Handle RGB input changes
  const handleRgbChange = (r: string, g: string, b: string) => {
    setRInput(r);
    setGInput(g);
    setBInput(b);
    if (conversionMode === 'rgb-to-hex') {
      const rNum = parseInt(r) || 0;
      const gNum = parseInt(g) || 0;
      const bNum = parseInt(b) || 0;
      if (rNum >= 0 && rNum <= 255 && gNum >= 0 && gNum <= 255 && bNum >= 0 && bNum <= 255) {
        setHexInput(rgbToHex(rNum, gNum, bNum));
      }
    }
  };

  const currentRgb = hexToRgb(hexInput) || { r: 0, g: 0, b: 0 };

  // Palette suggestions
  const colorPalettes = [
    { name: 'Blue', hex: '#3B82F6', desc: 'Primary Blue' },
    { name: 'Green', hex: '#10B981', desc: 'Emerald Green' },
    { name: 'Purple', hex: '#A855F7', desc: 'Royal Purple' },
    { name: 'Pink', hex: '#EC4899', desc: 'Hot Pink' },
    { name: 'Orange', hex: '#F97316', desc: 'Vibrant Orange' },
    { name: 'Gray', hex: '#6B7280', desc: 'Neutral Gray' },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back Button */}
        <Link
          href="/creative"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Creative & Design
        </Link>

        {/* Header */}
        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Palette className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">HEX / RGB Color Converter</h1>
          </div>
          <p className="text-gray-400">Seamlessly convert between HEX and RGB color formats. Perfect for web design, UI prototyping, and digital asset creation.</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Converter Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selector */}
            <div className="flex gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="hex-to-rgb"
                  checked={conversionMode === 'hex-to-rgb'}
                  onChange={() => setConversionMode('hex-to-rgb')}
                  className="w-4 h-4 text-blue-500 cursor-pointer"
                />
                <span className="ml-2 text-sm">HEX → RGB</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="rgb-to-hex"
                  checked={conversionMode === 'rgb-to-hex'}
                  onChange={() => setConversionMode('rgb-to-hex')}
                  className="w-4 h-4 text-blue-500 cursor-pointer"
                />
                <span className="ml-2 text-sm">RGB → HEX</span>
              </label>
            </div>

            {/* Input Section */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">HEX Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#FF6B6B"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                  <div
                    className="w-12 h-10 rounded border-2 border-gray-700"
                    style={{ backgroundColor: hexInput }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">RGB Values</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Red (0-255)</label>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={rInput}
                      onChange={(e) => handleRgbChange(e.target.value, gInput, bInput)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Green (0-255)</label>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={gInput}
                      onChange={(e) => handleRgbChange(rInput, e.target.value, bInput)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Blue (0-255)</label>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={bInput}
                      onChange={(e) => handleRgbChange(rInput, gInput, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RGB Display */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Current Color</p>
              <div className="flex items-end gap-4">
                <div
                  className="w-24 h-24 rounded border-2 border-gray-700"
                  style={{ backgroundColor: hexInput }}
                />
                <div className="flex-1 space-y-2">
                  <div className="p-2 bg-gray-800 rounded font-mono text-sm">
                    <p className="text-gray-400">HEX: <span className="text-blue-400">{hexInput}</span></p>
                  </div>
                  <div className="p-2 bg-gray-800 rounded font-mono text-sm">
                    <p className="text-gray-400">RGB: <span className="text-green-400">rgb({currentRgb.r}, {currentRgb.g}, {currentRgb.b})</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Palette Sidebar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Color Palette</h3>
            <div className="space-y-2">
              {colorPalettes.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHexChange(color.hex)}
                  className="w-full text-left p-3 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded border-2 border-gray-700"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-100">{color.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Reference */}
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-xs font-semibold text-gray-300 mb-3">Color Format Tips</p>
              <div className="space-y-2 text-xs text-gray-400">
                <p><span className="text-gray-300">HEX:</span> #RRGGBB format</p>
                <p><span className="text-gray-300">RGB:</span> 0-255 per channel</p>
                <p><span className="text-gray-300">HSL:</span> Hue, Saturation, Lightness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
