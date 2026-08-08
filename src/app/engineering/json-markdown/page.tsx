"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';

export default function JsonToMarkdown() {
  const [mode, setMode] = useState<'j2m' | 'm2j'>('j2m');
  const [inputText, setInputText] = useState('{\n  "projectName": "DevBox",\n  "status": "Active"\n}');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('devbox-json-md-input');
    const savedMode = localStorage.getItem('devbox-json-md-mode');
    if (saved) setInputText(saved);
    if (savedMode) setMode(savedMode as 'j2m' | 'm2j');
    setIsLoaded(true);
  }, []);

  // Save state
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('devbox-json-md-input', inputText);
      localStorage.setItem('devbox-json-md-mode', mode);
    }
  }, [inputText, mode, isLoaded]);

  const toggleMode = () => {
    setMode(prev => (prev === 'j2m' ? 'm2j' : 'j2m'));
    setInputText(outputText); // Move output to input for easy round-tripping
    setOutputText('');
    setError('');
  };

  const handleConvert = () => {
    setError('');
    
    if (mode === 'j2m') {
      // JSON to Markdown
      try {
        const parsed = JSON.parse(inputText);
        let markdown = `### JSON Payload\n\n`;
        markdown += `| Key | Value |\n|---|---|\n`;
        
        for (const [key, value] of Object.entries(parsed)) {
          const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          markdown += `| **${key}** | \`${formattedValue}\` |\n`;
        }
        setOutputText(markdown);
      } catch (err) {
        setError('Invalid JSON format. Please check your syntax.');
      }
    } else {
      // Markdown to JSON
      try {
        const lines = inputText.split('\n');
        const resultObj: Record<string, any> = {};
        
        for (let line of lines) {
          line = line.trim();
          // Find table rows
          if (line.startsWith('|') && line.endsWith('|')) {
            if (line.includes('---')) continue; // Skip header separator
            
            const parts = line.split('|').map(s => s.trim()).filter(Boolean);
            if (parts.length >= 2) {
              // Skip the header text itself
              if (parts[0].toLowerCase() === 'key' && parts[1].toLowerCase() === 'value') continue;
              
              // Clean formatting (remove ** and backticks)
              const cleanKey = parts[0].replace(/\*\*/g, '').trim();
              const cleanVal = parts[1].replace(/^`|`$/g, '').trim();
              
              // Try to parse the value back to its original type (number, boolean, object)
              try {
                resultObj[cleanKey] = JSON.parse(cleanVal);
              } catch {
                resultObj[cleanKey] = cleanVal; // Keep as string if parsing fails
              }
            }
          }
        }
        
        if (Object.keys(resultObj).length === 0) {
          setError('No valid Markdown table found.');
          return;
        }
        
        setOutputText(JSON.stringify(resultObj, null, 2));
      } catch (err) {
        setError('Failed to parse Markdown table.');
      }
    }
  };

  const inputLang = mode === 'j2m' ? 'json' : 'markdown';
  const outputLang = mode === 'j2m' ? 'markdown' : 'json';

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        
        <Link href="/engineering" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Engineering Hub
        </Link>
        
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">JSON ⇄ Markdown</h1>
            <p className="text-gray-400 mt-1">Convert JSON payloads into formatted Markdown tables and back.</p>
          </div>
          <button 
            onClick={toggleMode}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <span>Swap Direction</span>
            <span>🔁</span>
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-[500px]">
          
          {/* Input Section */}
          <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 border-b border-gray-700 flex justify-between items-center">
              <span>Input: {inputLang.toUpperCase()}</span>
              <button 
                onClick={handleConvert}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition shadow-sm"
              >
                Convert &rarr;
              </button>
            </div>
            <div className="flex-grow pt-2">
              <Editor
                height="100%"
                language={inputLang}
                theme="vs-dark"
                value={inputText}
                onChange={(value) => setInputText(value || '')}
                options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 border-b border-gray-700">
              Output: {outputLang.toUpperCase()}
            </div>
            {error ? (
              <div className="p-4 text-red-400 text-sm bg-red-950/20 h-full border-t-2 border-red-900/50">
                ⚠️ {error}
              </div>
            ) : (
              <div className="flex-grow pt-2">
                <Editor
                  height="100%"
                  language={outputLang}
                  theme="vs-dark"
                  value={outputText}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}