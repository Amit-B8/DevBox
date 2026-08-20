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
          &larr; Back to Utilities Hub
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