'use client';

import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { getToolsByDiscipline } from '@/data/tools';

const medicalSections = [
  {
    title: 'Ophthalmology & Optometry',
    tools: ['visual-acuity-converter', 'iol-power-calculator'],
  },
  {
    title: 'Nursing',
    tools: ['iv-drip-rate-calculator'],
  },
  {
    title: 'Surgery',
    tools: ['bsa-calculator'],
  },
];

export default function MedicalHub() {
  const tools = getToolsByDiscipline('Medical Sciences');

  const groupedTools = medicalSections
    .map((section) => ({
      ...section,
      tools: section.tools
        .map((toolId) => tools.find((tool) => tool.id === toolId))
        .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool)),
    }))
    .filter((section) => section.tools.length > 0);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <header className="mb-10 border-b border-gray-800 pb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Medical Toolkit</h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Clinical calculators, dose converters, and diagnostic utilities for healthcare professionals.
          </p>
        </header>

        <div className="space-y-10">
          {groupedTools.length > 0 ? (
            groupedTools.map((section) => (
              <section key={section.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-800" />
                  <h2 className="text-lg font-semibold text-gray-200">{section.title}</h2>
                  <div className="h-px flex-1 bg-gray-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {section.tools.map((tool) => (
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
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Medical tools coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
