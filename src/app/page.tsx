'use client';

import { useMemo, useState } from 'react';
import ToolCard from '@/components/ToolCard';
import { tools, type Tool } from '@/data/tools';

type DashboardSection = {
  id: string;
  label: string;
  description: string;
  accent: {
    border: string;
    header: string;
    badge: string;
    dot: string;
  };
  toolIds: string[];
  emptyState?: string;
};

const dashboardSections: DashboardSection[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Everyday utilities and quick productivity tools for common workflows.',
    accent: {
      border: 'border-slate-700',
      header: 'border-slate-800 bg-slate-900/70',
      badge: 'border-slate-600 bg-slate-800 text-slate-300',
      dot: 'bg-slate-400',
    },
    toolIds: ['data-anonymizer', 'image-converter', 'password-generator', 'pdf-combiner', 'color-converter'],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    description: 'Technical converters, system utilities, and engineering workflows organized by discipline.',
    accent: {
      border: 'border-zinc-700',
      header: 'border-zinc-800 bg-zinc-900/70',
      badge: 'border-zinc-600 bg-zinc-800 text-zinc-300',
      dot: 'bg-zinc-400',
    },
    toolIds: ['jwt-inspector', 'json-markdown', 'csv-to-json', 'base-converter', 'bitwise-calculator', 'logic-simulator', 'resistor-decoder', 'unit-converter', 'thermal-calc'],
  },
  {
    id: 'mathematics',
    label: 'Mathematics',
    description: 'A dedicated math workspace for future calculators and quantitative tools.',
    accent: {
      border: 'border-blue-700',
      header: 'border-blue-900/70 bg-blue-950/40',
      badge: 'border-blue-600 bg-blue-900/50 text-blue-200',
      dot: 'bg-blue-400',
    },
    toolIds: [],
    emptyState: 'Mathematics is currently reserved for future calculation tools. This section is intentionally blank for now.',
  },
  {
    id: 'medical',
    label: 'Medical',
    description: 'Clinical calculators and healthcare utilities for research, nursing, and perioperative workflows.',
    accent: {
      border: 'border-rose-700',
      header: 'border-rose-900/70 bg-rose-950/40',
      badge: 'border-rose-600 bg-rose-900/50 text-rose-200',
      dot: 'bg-rose-400',
    },
    toolIds: ['visual-acuity-converter', 'iol-power-calculator', 'iv-drip-rate-calculator', 'bsa-calculator'],
  },
  {
    id: 'finance',
    label: 'Finance',
    description: 'Business performance and investment analysis tools for quick decisions.',
    accent: {
      border: 'border-emerald-700',
      header: 'border-emerald-900/70 bg-emerald-950/40',
      badge: 'border-emerald-600 bg-emerald-900/50 text-emerald-200',
      dot: 'bg-emerald-400',
    },
    toolIds: ['roi-calculator'],
  },
];

const groupToolsByDiscipline = (sectionTools: Tool[]) => {
  const groups = new Map<string, Tool[]>();

  sectionTools.forEach((tool) => {
    const current = groups.get(tool.discipline) ?? [];
    groups.set(tool.discipline, [...current, tool]);
  });

  return Array.from(groups.entries()).map(([name, toolsInGroup]) => ({
    name,
    tools: toolsInGroup,
  }));
};

const getToolMatchScore = (tool: Tool, query: string) => {
  const normalizedQuery = query.toLowerCase();
  const name = tool.name.toLowerCase();
  const discipline = tool.discipline.toLowerCase();
  const subcategory = tool.subcategory?.toLowerCase() ?? '';
  const description = tool.description.toLowerCase();

  if (name === normalizedQuery || tool.id.toLowerCase() === normalizedQuery) {
    return 100;
  }

  if (name.includes(normalizedQuery)) {
    return 80;
  }

  if (discipline.includes(normalizedQuery) || subcategory.includes(normalizedQuery)) {
    return 70;
  }

  if (description.includes(normalizedQuery)) {
    return 20;
  }

  return 0;
};

const dashboardStats = {
  categories: dashboardSections.length,
  tools: tools.length,
  medicalTools: dashboardSections.find((section) => section.id === 'medical')?.toolIds.length ?? 0,
  financeTools: dashboardSections.find((section) => section.id === 'finance')?.toolIds.length ?? 0,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const toolMap = new Map<string, Tool>(tools.map((tool) => [tool.id, tool]));

    return dashboardSections
      .map((section) => {
        const sectionTools = section.toolIds
          .map((toolId) => toolMap.get(toolId))
          .filter((tool): tool is Tool => Boolean(tool));

        const sectionTitleMatch =
          normalizedQuery.length === 0 ||
          section.label.toLowerCase().includes(normalizedQuery) ||
          section.description.toLowerCase().includes(normalizedQuery) ||
          section.id.toLowerCase().includes(normalizedQuery);

        const matchedTools = sectionTitleMatch
          ? sectionTools
          : sectionTools.filter((tool) => getToolMatchScore(tool, normalizedQuery) > 0);

        return {
          ...section,
          tools: matchedTools,
          visible: normalizedQuery.length === 0 || sectionTitleMatch || matchedTools.length > 0,
        };
      })
      .filter((section) => section.visible);
  }, [searchQuery]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/85 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">DevBox</p>
                <h1 className="text-lg font-semibold text-gray-100">Professional Utility Suite</h1>
              </div>

              <div className="w-full max-w-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tools, categories, or disciplines..."
                  className="w-full border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                />
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {dashboardSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className="rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors duration-200 hover:border-slate-500 hover:text-white"
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        <section className="mb-10 rounded-3xl border border-gray-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">DevBox overview</p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome to DevBox.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-gray-400 leading-relaxed">
                Find the right utility in seconds with one app-like workspace for engineering, medical tools, finance, and everyday productivity.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {dashboardSections.map((section) => (
                  <button
                    key={`overview-${section.id}`}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${section.accent.badge}`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-700 bg-gray-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">DevBox categories</p>
                <p className="mt-3 text-3xl font-semibold text-white">{dashboardStats.categories}</p>
              </div>

              <div className="rounded-2xl border border-gray-700 bg-gray-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">DevBox tools</p>
                <p className="mt-3 text-3xl font-semibold text-white">{dashboardStats.tools}</p>
              </div>
            </div>
          </div>
        </section>

        {filteredSections.length > 0 ? (
          filteredSections.map((section) => {
            const engineeringGroups =
              section.id === 'engineering' && section.tools.length > 0
                ? groupToolsByDiscipline(section.tools)
                : [];

            return (
              <section
                key={section.id}
                id={section.id}
                className={`scroll-mt-32 mb-8 overflow-hidden rounded-2xl border ${section.accent.border} bg-gray-900/50`}
              >
                <div className={`flex items-center justify-between border-b px-4 py-3 sm:px-6 ${section.accent.header}`}>
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${section.accent.dot}`} />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Section</p>
                      <h3 className="text-xl font-semibold text-white">{section.label}</h3>
                    </div>
                  </div>

                  <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${section.accent.badge}`}>
                    {section.tools.length} tools
                  </span>
                </div>

                <div className="px-4 py-4 sm:px-6 sm:py-6">
                  <p className="mb-5 text-sm text-gray-400">{section.description}</p>

                  {section.tools.length > 0 ? (
                    section.id === 'engineering' ? (
                      <div className="space-y-6">
                        {engineeringGroups.map((group) => (
                          <div key={group.name} className="space-y-3">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                              {group.name}
                            </p>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                              {group.tools.map((tool) => (
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
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                    )
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-950/50 p-6">
                      <p className="text-sm text-gray-300">
                        {section.emptyState ?? 'This section is currently empty.'}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            );
          })
        ) : (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-10 text-center">
            <p className="text-lg font-medium text-gray-200">No tools match your search.</p>
            <p className="mt-2 text-sm text-gray-400">
              Try a specific category like “engineering”, “medical”, or a tool name such as “ROI".
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
