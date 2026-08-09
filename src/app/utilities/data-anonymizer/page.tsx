"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function DataAnonymizer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Toggles for which data to scrub
  const [scrubEmail, setScrubEmail] = useState(true);
  const [scrubPhone, setScrubPhone] = useState(true);
  const [scrubSSN, setScrubSSN] = useState(true);

  const handleAnonymize = () => {
    let processedText = inputText;

    if (scrubEmail) {
      // Matches standard email formats
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      processedText = processedText.replace(emailRegex, '[REDACTED_EMAIL]');
    }

    if (scrubPhone) {
      // Matches various US phone formats like (123) 456-7890, 123-456-7890, 123.456.7890
      const phoneRegex = /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g;
      processedText = processedText.replace(phoneRegex, '[REDACTED_PHONE]');
    }

    if (scrubSSN) {
      // Matches standard 9-digit US Social Security Numbers
      const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
      processedText = processedText.replace(ssnRegex, '[REDACTED_SSN]');
    }

    setOutputText(processedText);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };
  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
        
        <Link href="/utilities" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Utilities Hub
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Data Anonymizer</h1>
          <p className="text-gray-400 mt-1">Scrub Personally Identifiable Information (PII) from raw text or CSV data.</p>
        </header>

        {/* Configuration Options */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex gap-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={scrubEmail} 
              onChange={(e) => setScrubEmail(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded bg-gray-800 border-gray-700"
            />
            <span className="text-sm font-medium text-gray-300">Scrub Emails</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={scrubPhone} 
              onChange={(e) => setScrubPhone(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded bg-gray-800 border-gray-700"
            />
            <span className="text-sm font-medium text-gray-300">Scrub Phone Numbers</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={scrubSSN} 
              onChange={(e) => setScrubSSN(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded bg-gray-800 border-gray-700"
            />
            <span className="text-sm font-medium text-gray-300">Scrub SSNs</span>
          </label>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-[400px]">
          
          {/* Input Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 border border-gray-700 rounded-t-xl flex justify-between items-center">
              <span>Raw Data</span>
              <button 
                onClick={handleClear}
                className="text-gray-400 hover:text-white text-xs"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your raw text, JSON, or CSV data here...&#10;&#10;Example: John Doe can be reached at john.doe@email.com or (555) 123-4567."
              className="flex-grow w-full bg-gray-950 border border-t-0 border-gray-700 rounded-b-xl p-4 text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Action Button (Mobile vertical, Desktop horizontal) */}
          <div className="flex items-center justify-center">
            <button 
              onClick={handleAnonymize}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-sm w-full lg:w-auto"
            >
              Anonymize &rarr;
            </button>
          </div>

          {/* Output Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 border border-gray-700 rounded-t-xl">
              Sanitized Output
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder="Scrubbed data will appear here..."
              className="flex-grow w-full bg-gray-950 border border-t-0 border-gray-700 rounded-b-xl p-4 text-sm font-mono text-emerald-400 focus:outline-none resize-none"
            />
          </div>

        </div>
      </div>
    </main>
  );
}