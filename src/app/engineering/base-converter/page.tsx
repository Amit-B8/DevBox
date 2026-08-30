"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BaseConverter() {
  const [values, setValues] = useState({
    dec: '',
    hex: '',
    bin: '',
    oct: ''
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('devbox-base-converter');
    if (saved) {
      setValues(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage automatically
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('devbox-base-converter', JSON.stringify(values));
    }
  }, [values, isLoaded]);

  const handleInputChange = (base: 'dec' | 'hex' | 'bin' | 'oct', val: string) => {
    // Remove spaces for easier parsing
    const cleanVal = val.replace(/\s/g, '');
    
    if (cleanVal === '') {
      setValues({ dec: '', hex: '', bin: '', oct: '' });
      return;
    }

    try {
      let decimalValue: number;

      // Parse input based on the field being typed in
      switch (base) {
        case 'dec':
          if (!/^\d+$/.test(cleanVal)) return; // Only numbers
          decimalValue = parseInt(cleanVal, 10);
          break;
        case 'hex':
          if (!/^[0-9A-Fa-f]+$/.test(cleanVal)) return; // Valid hex chars
          decimalValue = parseInt(cleanVal, 16);
          break;
        case 'bin':
          if (!/^[01]+$/.test(cleanVal)) return; // Only 0s and 1s
          decimalValue = parseInt(cleanVal, 2);
          break;
        case 'oct':
          if (!/^[0-7]+$/.test(cleanVal)) return; // Valid octal chars
          decimalValue = parseInt(cleanVal, 8);
          break;
      }

      if (isNaN(decimalValue)) return;

      // Update all fields instantly
      setValues({
        dec: decimalValue.toString(10),
        hex: decimalValue.toString(16).toUpperCase(),
        bin: decimalValue.toString(2),
        oct: decimalValue.toString(8)
      });
    } catch (e) {
      // Ignore invalid intermediate typing states
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-grow">
        
        <Link href="/engineering" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Engineering Toolkit
        </Link>
        
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Base Converter</h1>
          <p className="text-gray-400 mt-1">Real-time conversion between Decimal, Hexadecimal, Binary, and Octal formats.</p>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6 shadow-xl">
          
          {/* Decimal Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Decimal (Base 10)
            </label>
            <input
              type="text"
              value={values.dec}
              onChange={(e) => handleInputChange('dec', e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-lg font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. 255"
            />
          </div>

          {/* Hexadecimal Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Hexadecimal (Base 16)
            </label>
            <input
              type="text"
              value={values.hex}
              onChange={(e) => handleInputChange('hex', e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-lg font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. FF"
            />
          </div>

          {/* Binary Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Binary (Base 2)
            </label>
            <input
              type="text"
              value={values.bin}
              onChange={(e) => handleInputChange('bin', e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-lg font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. 11111111"
            />
          </div>

          {/* Octal Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Octal (Base 8)
            </label>
            <input
              type="text"
              value={values.oct}
              onChange={(e) => handleInputChange('oct', e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-lg font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. 377"
            />
          </div>

        </div>
      </div>
    </main>
  );
}