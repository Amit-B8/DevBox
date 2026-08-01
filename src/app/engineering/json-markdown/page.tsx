"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';

export default function JsonToMarkdown() {
  const [inputJson, setInputJson] = useState('{\n  "projectName": "DevBox",\n  "status": "Active"\n}');
  const [outputMd, setOutputMd] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved JSON from localStorage when the component mounts
  useEffect(() => {
    const saved = localStorage.getItem('devbox-json-input');
    if (saved) {
      setInputJson(saved);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever inputJson changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('devbox-json-input', inputJson);
    }
  }, [inputJson, isLoaded]);

  const handleConvert = () => {
    try {
      setError('');
      const parsed = JSON.parse(inputJson);
      
      let markdown = `### JSON Payload\n\n`;
      markdown += `| Key | Value |\n|---|---|\n`;
      
      for (const [key, value] of Object.entries(parsed)) {
        const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        markdown += `| **${key}** | \`${formattedValue}\` |\n`;
      }
      
      setOutputMd(markdown);
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        
        <Link href="/engineering" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Engineering Hub
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">JSON ⇄ Markdown</h1>
          <p className="text-gray-400 mt-1">Convert JSON payloads into formatted Markdown tables instantly.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-[500px]">
          
          {/* Input Section */}
          <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 border-b border-gray-700 flex justify-between items-center">
              <span>Input: JSON</span>
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
                defaultLanguage="json"
                theme="vs-dark"
                value={inputJson}
                onChange={(value) => setInputJson(value || '')}
                options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-300 border-b border-gray-700">
              Output: Markdown
            </div>
            {error ? (
              <div className="p-4 text-red-400 text-sm bg-red-950/20 h-full border-t-2 border-red-900/50">
                ⚠️ {error}
              </div>
            ) : (
              <div className="flex-grow pt-2">
                <Editor
                  height="100%"
                  defaultLanguage="markdown"
                  theme="vs-dark"
                  value={outputMd}
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