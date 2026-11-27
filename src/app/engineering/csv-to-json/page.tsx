"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { csvToRecords } from '@/lib/csv';

export default function CsvToJson() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState('');

  const downloadJson = () => {
    if (!jsonOutput) return;
    const url = URL.createObjectURL(new Blob([jsonOutput], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devbox-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleConvert = (input: string) => {
    setCsvInput(input);
    
    if (!input.trim()) {
      setJsonOutput('');
      setError('');
      return;
    }

    try {
      const result = csvToRecords(input);

      setJsonOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV format.');
      setJsonOutput('');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col">
        
        <Link href="/engineering" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Engineering Tools
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">CSV to JSON Converter</h1>
          <p className="text-gray-400 mt-1">Instantly structure comma-separated spreadsheet data into JSON arrays.</p>
          <p id="csv-help" className="mt-3 text-sm text-gray-400">Supports quoted commas, doubled quotes, and multiline fields. Use unique column headers; values stay as strings. Maximum 200,000 characters. Nothing is uploaded.</p>
          <button type="button" onClick={() => handleConvert('name,note\nAda,"Hello, world"\nSam,"Said ""hello"""')} className="mt-4 rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-gray-800">Load quoted CSV example</button>
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
              aria-label="CSV input"
              aria-describedby="csv-help csv-error"
              aria-invalid={!!error}
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
              <button type="button" disabled={!jsonOutput} onClick={downloadJson} className="min-h-11 rounded-lg px-3 text-sm text-blue-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">Download .json</button>
            </div>
            <p id="csv-error" role="alert" className="px-4 pt-3 text-sm text-red-400">{error}</p>
            <pre className="w-full flex-grow min-h-[300px] bg-gray-950/50 p-4 text-sm font-mono text-blue-400 overflow-auto">
              {jsonOutput || '// Your formatted JSON will appear here...'}
            </pre>
          </div>

        </div>
      </div>
    </main>
  );
}
