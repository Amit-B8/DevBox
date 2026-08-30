"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function JWTInspector() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const handleDecode = (inputToken: string) => {
    setToken(inputToken);
    
    if (!inputToken.trim()) {
      handleClear();
      return;
    }

    const parts = inputToken.split('.');
    
    if (parts.length !== 3) {
      setError('Invalid JWT format. A standard JWT must have exactly 3 parts separated by dots.');
      setHeader(null);
      setPayload(null);
      setSignature('');
      return;
    }

    try {
      // Decode Base64URL to a string, safely handling special characters
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad the string with equals signs to make it a multiple of 4
        while (base64.length % 4) {
          base64 += '=';
        }
        
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      setHeader(JSON.parse(base64UrlDecode(parts[0])));
      setPayload(JSON.parse(base64UrlDecode(parts[1])));
      setSignature(parts[2]);
      setError('');
    } catch (err) {
      setError('Failed to decode token. Ensure it is a valid base64url encoded JSON string.');
      setHeader(null);
      setPayload(null);
      setSignature('');
    }
  };

  const handleClear = () => {
    setToken('');
    setHeader(null);
    setPayload(null);
    setSignature('');
    setError('');
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col">
        
        <Link href="/engineering" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Engineering Toolkit
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">JWT Inspector</h1>
          <p className="text-gray-400 mt-1">Decode, verify, and inspect JSON Web Tokens instantly.</p>
        </header>

        {/* Input Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Encoded JWT String
            </label>
            <button 
              onClick={handleClear}
              className="bg-gray-700 hover:bg-red-500/80 border border-gray-600 hover:border-red-500 text-gray-200 px-3 py-1 rounded-md text-xs font-medium transition-all shadow-sm"
            >
              Clear Input
            </button>
          </div>
          <textarea
            value={token}
            onChange={(e) => handleDecode(e.target.value)}
            placeholder="Paste your JSON Web Token here (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            className="w-full h-32 bg-gray-800 border border-gray-600 placeholder-gray-500 rounded-lg p-4 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition"
          />
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 font-medium text-sm">
            {error}
          </div>
        )}

        {/* Output Section */}
        {header && payload && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            
            {/* Header Data */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col shadow-xl overflow-hidden">
              <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Header</h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-500/30">Algorithm & Type</span>
              </div>
              <pre className="p-4 text-sm font-mono text-emerald-400 overflow-x-auto flex-grow bg-gray-950/50">
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>

            {/* Payload Data */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col shadow-xl overflow-hidden">
              <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Payload</h3>
                <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-500/30">Data & Claims</span>
              </div>
              <pre className="p-4 text-sm font-mono text-blue-400 overflow-x-auto flex-grow bg-gray-950/50">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>

            {/* Signature Data */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden md:col-span-2">
              <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Signature</h3>
                <span className="text-xs font-mono text-purple-400 bg-purple-900/30 px-2 py-1 rounded border border-purple-500/30">Verification Hash</span>
              </div>
              <div className="p-4 bg-gray-950/50 text-purple-400 font-mono text-sm break-all leading-relaxed">
                {signature}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}