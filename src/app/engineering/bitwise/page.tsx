"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function BitwiseCalculator() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState('AND');
}

  const calculate = () => {
    const val1 = parseInt(num1, 10);
    const val2 = parseInt(num2, 10);

    if (isNaN(val1)) return { dec: 0, bin: '0' };

    let result = 0;
    switch (operation) {
      case 'AND': result = val1 & (isNaN(val2) ? 0 : val2); break;
      case 'OR': result = val1 | (isNaN(val2) ? 0 : val2); break;
      case 'XOR': result = val1 ^ (isNaN(val2) ? 0 : val2); break;
      case 'NOT': result = ~val1; break;
      case 'LSHIFT': result = val1 << (isNaN(val2) ? 0 : val2); break;
      case 'RSHIFT': result = val1 >> (isNaN(val2) ? 0 : val2); break;
    }

    const unsignedResult = result >>> 0;
    
    return {
      dec: result,
      bin: unsignedResult.toString(2).padStart(8, '0')
    };
  };

  const result = calculate();

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-grow">
        
        <Link href="/engineering" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Engineering Hub
        </Link>
        
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Bitwise Calculator</h1>
          <p className="text-gray-400 mt-1">Perform bit-level operations on decimal values instantly.</p>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8">
            
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Value 1 (Dec)
              </label>
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 font-mono focus:border-blue-500 outline-none"
                placeholder="e.g. 12"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Operation
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 font-mono focus:border-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option value="AND">AND (&)</option>
                <option value="OR">OR (|)</option>
                <option value="XOR">XOR (^)</option>
                <option value="NOT">NOT (~)</option>
                <option value="LSHIFT">Left Shift (&lt;&lt;)</option>
                <option value="RSHIFT">Right Shift (&gt;&gt;)</option>
              </select>
            </div>

            <div className={operation === 'NOT' ? 'opacity-30 pointer-events-none' : ''}>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Value 2 (Dec)
              </label>
              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 font-mono focus:border-blue-500 outline-none"
                placeholder="e.g. 4"
                disabled={operation === 'NOT'}
              />
            </div>

          </div>