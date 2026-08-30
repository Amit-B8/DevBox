"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      setPassword('Select at least one option');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Generate an initial password on mount
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (password === 'Select at least one option') return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
        
        <Link href="/utilities" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to General Toolkit
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Secure Password Generator</h1>
          <p className="text-gray-400 mt-1">Generate strong, random passwords instantly in your browser.</p>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 shadow-xl mb-6">
          
          {/* Password Display */}
          <div className="relative mb-8">
            <div className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 pr-24 text-xl md:text-2xl font-mono text-emerald-400 break-all min-h-[4rem] flex items-center">
              {password}
            </div>
            <button
              onClick={handleCopy}
              className={`absolute right-2 top-2 bottom-2 px-4 rounded-md font-semibold transition-all ${
                copied 
                  ? 'bg-emerald-600 text-white border border-emerald-500' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            
            {/* Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Password Length
                </label>
                <span className="text-xl font-bold text-blue-400">{length}</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">Lowercase (a-z)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">Numbers (0-9)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">Symbols (!@#$...)</span>
              </label>
            </div>
          </div>
          
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:border-blue-500 active:scale-[0.98]"
        >
          🔄 Generate New Password
        </button>

      </div>
    </main>
  );
}