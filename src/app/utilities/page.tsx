'use client';

import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { getToolsByDiscipline } from '@/data/tools';

export default function UtilitiesHub() {
  const tools = getToolsByDiscipline("General Utilities");

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navigation & Header */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <header className="mb-16 border-b border-gray-800 pb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">General Toolkit</h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Everyday utilities, password generators, and secure data formatters.
          </p>
        </header>

        {/* Tools Grid */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.name}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}