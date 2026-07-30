import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">DevBox Dashboard</h1>
          <p className="text-gray-400 mt-1">Select a utility tool to begin.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tool Card Placeholder */}
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition">
            <h2 className="text-xl font-semibold mb-2">JSON Prettifier</h2>
            <p className="text-gray-400 text-sm">Format, validate, and inspect JSON payloads.</p>
          </div>
        </section>
      </div>
    </main>
  );
}