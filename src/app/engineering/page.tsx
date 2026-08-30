'use client';

import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { getToolsByDiscipline } from '@/data/tools';

export default function EngineeringHub() {
  const disciplines = [
    "Computer Science" as const,
    "Electrical & Embedded" as const,
    "Mechanical & Aerospace" as const,
  ];

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
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Engineering & Systems</h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Professional tools for computer science, electrical engineering, and mechanical systems. Accelerate your workflow with precision utilities.
          </p>
        </header>

        {/* Disciplines Sections */}
        <div className="space-y-16">
          {disciplines.map((discipline) => {
            const disciplineTools = getToolsByDiscipline(discipline);
            
            if (disciplineTools.length === 0) return null;

            return (
              <section key={discipline}>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-100">
                  {discipline}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {disciplineTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      title={tool.name}
                      description={tool.description}
                      href={tool.href}
                      icon={tool.icon}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}