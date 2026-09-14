'use client';

import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { getToolsByDiscipline } from '@/data/tools';

export default function MathematicsHub() {
  const tools = getToolsByDiscipline('Mathematics');

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <header className="mb-16 border-b border-gray-800 pb-8">
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Mathematics Tools</h1>
          <p className="max-w-2xl text-lg text-gray-400">
            Arithmetic, calculus, and matrix tools for quick calculations, technical exploration, and education.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}
