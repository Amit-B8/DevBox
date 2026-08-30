"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function CsvToJson() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = (input: string) => {
    setCsvInput(input);
    
    if (!input.trim()) {
      setJsonOutput('');
      setError('');
      return;
    }

    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must contain at least a header row and one data row.');
      }

      const headers = lines[0].split(',').map(header => header.trim());
      
      const result = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] ? values[index].trim() : '';
        });
        return obj;
      });

      setJsonOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV format.');
      setJsonOutput('');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col">
        
        <Link href="/engineering" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Engineering Hub
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">CSV to JSON Converter</h1>
          <p className="text-gray-400 mt-1">Instantly structure comma-separated spreadsheet data into JSON arrays.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow pb-12">
          
          {/* Input Area */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col shadow-xl overflow-hidden">
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">CSV Input</h3>
              <button 
                onClick={() => handleConvert('')}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={csvInput}
              onChange={(e) => handleConvert(e.target.value)}
              placeholder="id, name, role&#10;1, John Doe, Admin&#10;2, Jane Smith, Developer"
              className="w-full flex-grow min-h-[300px] bg-gray-950/50 p-4 text-sm font-mono text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Output Area */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col shadow-xl overflow-hidden">
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">JSON Output</h3>
              {error && <span className="text-xs text-red-400">{error}</span>}
            </div>
            <pre className="w-full flex-grow min-h-[300px] bg-gray-950/50 p-4 text-sm font-mono text-blue-400 overflow-auto">
              {jsonOutput || '// Your formatted JSON will appear here...'}
            </pre>
          </div>

        </div>
      </div>
    </main>
  );
}