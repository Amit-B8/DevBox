'use client';

import { useMemo, useState, useEffect } from 'react';
import ToolCard from '@/components/ToolCard';
import { tools, type Tool, formatToolCount } from '@/data/tools';
import { Star } from 'lucide-react';

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
    toolIds: ['text-analyzer', 'data-anonymizer', 'image-converter', 'password-generator', 'pdf-combiner', 'color-converter'],
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
    description: 'Math utilities for quick arithmetic, percentages, quadratic equations, and statistics.',
    accent: {
      border: 'border-blue-700',
      header: 'border-blue-900/70 bg-blue-950/40',
      badge: 'border-blue-600 bg-blue-900/50 text-blue-200',
      dot: 'bg-blue-400',
    },
    toolIds: tools.filter((tool) => tool.discipline === 'Mathematics').map((tool) => tool.id),
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
    description: 'Budgeting, loan, investment, and subscription tools for everyday financial planning.',
    accent: {
      border: 'border-emerald-700',
      header: 'border-emerald-900/70 bg-emerald-950/40',
      badge: 'border-emerald-600 bg-emerald-900/50 text-emerald-200',
      dot: 'bg-emerald-400',
    },
    toolIds: ['student-budget', 'roi-calculator', 'loan-calculator', 'mortgage-calculator', 'compound-interest', 'subscription-tracker'],
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
};

const FAVORITES_STORAGE_KEY = 'devbox-favorite-tools';
const knownToolIds = new Set(tools.map(tool => tool.id));

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteNotice, setFavoriteNotice] = useState('');

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validIds = [...new Set(parsed.filter((id): id is string => typeof id === 'string' && knownToolIds.has(id)))];
          // Read browser storage after hydration so server and initial client output match.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setFavoriteIds(validIds);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Global Keyboard shortcut listener (Ctrl+K / Cmd+K / '/')
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const isInputOrTextarea =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('tool-search');
        searchInput?.focus();
        if (searchInput instanceof HTMLInputElement) {
          searchInput.select();
        }
      } else if (event.key === '/' && !event.ctrlKey && !event.metaKey && !isInputOrTextarea) {
        event.preventDefault();
        const searchInput = document.getElementById('tool-search');
        searchInput?.focus();
        if (searchInput instanceof HTMLInputElement) {
          searchInput.select();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFavorite = (toolId: string) => {
    const next = favoriteIds.includes(toolId) ? favoriteIds.filter(id => id !== toolId) : [...favoriteIds, toolId];
    setFavoriteIds(next);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      setFavoriteNotice('');
    } catch {
      setFavoriteNotice('Favorites work for this visit, but your browser could not save them.');
    }
  };

  const toolMap = useMemo(() => new Map<string, Tool>(tools.map((t) => [t.id, t])), []);

  const favoriteTools = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const favs = favoriteIds.map((id) => toolMap.get(id)).filter((tool): tool is Tool => Boolean(tool));

    if (!normalizedQuery) {
      return favs;
    }

    return favs.filter((tool) => getToolMatchScore(tool, normalizedQuery) > 0);
  }, [favoriteIds, toolMap, searchQuery]);

  const filteredSections = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

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
  }, [searchQuery, toolMap]);

  const matchingToolCount = new Set([
    ...filteredSections.flatMap(section => section.tools.map(tool => tool.id)),
    ...favoriteTools.map(tool => tool.id),
  ]).size;

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="top-0 z-30 border-b border-gray-800 bg-gray-950/85 backdrop-blur-sm md:sticky">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">DevBox</p>
                <h1 className="text-lg font-semibold text-gray-100">Tools for Developers, Engineers, and Technical Workflows</h1>
              </div>

              <div className="relative w-full md:max-w-xl">
                <label htmlFor="tool-search" className="sr-only">
                  Search DevBox tools and categories
                </label>
                <input
                  id="tool-search"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Escape') setSearchQuery(''); }}
                  placeholder="Search tools, categories, or disciplines..."
                  title="Press Ctrl+K (Cmd+K on Mac) or / to search; Escape clears your search."
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2.5 pl-4 pr-24 text-sm text-white placeholder:text-gray-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                />
                <div className="absolute inset-y-0 right-1.5 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      type="button"
                      aria-label="Clear search"
                      title="Clear search (Escape)"
                      onClick={() => {
                        setSearchQuery('');
                        document.getElementById('tool-search')?.focus();
                      }}
                      className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  ) : (
                    <span className="hidden items-center gap-1 rounded border border-gray-700/80 bg-gray-800/80 px-2 py-0.5 text-[10px] font-medium text-gray-400 sm:flex">
                      <kbd className="font-mono">Ctrl</kbd> <kbd className="font-mono">K</kbd>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {favoriteTools.length > 0 && (
                <button
                  type="button"
                  onClick={() => scrollToSection('favorites')}
                  className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-950/40 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors duration-200 hover:border-amber-400 hover:text-amber-200"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  Favorites ({favoriteIds.length})
                </button>
              )}
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
            <p role="status" aria-atomic="true" className="text-sm text-gray-400">
              {searchQuery.trim() && `${formatToolCount(matchingToolCount)} found`}
            </p>
            <p role="status" className="text-sm text-amber-300">{favoriteNotice}</p>
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
                Find the right utility in seconds with tools for engineering, mathematics, healthcare, finance, and everyday productivity. Press <kbd className="rounded border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-xs font-mono text-gray-300">Ctrl+K</kbd> to search anytime.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {favoriteTools.length > 0 && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('favorites')}
                    className="inline-flex items-center gap-1 rounded-full border border-amber-600 bg-amber-950/50 px-3 py-1.5 text-xs font-medium text-amber-200 transition-colors duration-200 hover:bg-amber-900/60"
                  >
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    Favorites ({favoriteIds.length})
                  </button>
                )}
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

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-700 bg-gray-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Categories</p>
                <p className="mt-3 text-3xl font-semibold text-white">{dashboardStats.categories}</p>
              </div>

              <div className="rounded-2xl border border-gray-700 bg-gray-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Tools</p>
                <p className="mt-3 text-3xl font-semibold text-white">{dashboardStats.tools}</p>
              </div>

              <div className="col-span-2 rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4 sm:col-span-1">
                <p className="text-xs uppercase tracking-[0.18em] text-amber-400">Favorites</p>
                <p className="mt-3 text-3xl font-semibold text-amber-300 flex items-center gap-1">
                  {favoriteIds.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Favorites Pinned Section */}
        {favoriteTools.length > 0 && (
          <section
            id="favorites"
            className="scroll-mt-32 mb-8 overflow-hidden rounded-2xl border border-amber-700/50 bg-amber-950/10"
          >
            <div className="flex items-center justify-between border-b border-amber-800/40 bg-amber-950/30 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80">Pinned Shortcuts</p>
                  <h3 className="text-xl font-semibold text-amber-100">Favorites</h3>
                </div>
              </div>

              <span className="rounded-full border border-amber-600 bg-amber-900/40 px-2.5 py-1 text-xs font-medium text-amber-200">
                {formatToolCount(favoriteTools.length)}
              </span>
            </div>

            <div className="px-4 py-4 sm:px-6 sm:py-6">
              <p className="mb-5 text-sm text-amber-200/80">
                Star a tool to keep it here. Favorites are saved in this browser, not synced across devices.
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {favoriteTools.map((tool) => (
                  <ToolCard
                    key={`fav-${tool.id}`}
                    id={tool.id}
                    title={tool.name}
                    description={tool.description}
                    href={tool.href}
                    icon={tool.icon}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

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
                    {formatToolCount(section.tools.length)}
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
                                  id={tool.id}
                                  title={tool.name}
                                  description={tool.description}
                                  href={tool.href}
                                  icon={tool.icon}
                                  isFavorite={favoriteIds.includes(tool.id)}
                                  onToggleFavorite={toggleFavorite}
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
                            id={tool.id}
                            title={tool.name}
                            description={tool.description}
                            href={tool.href}
                            icon={tool.icon}
                            isFavorite={favoriteIds.includes(tool.id)}
                            onToggleFavorite={toggleFavorite}
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
          favoriteTools.length === 0 && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-10 text-center">
              <p className="text-lg font-medium text-gray-200">No tools match your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  document.getElementById('tool-search')?.focus();
                }}
                className="mt-4 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-700 hover:text-white"
              >
                Show all tools
              </button>
              <p className="mt-2 text-sm text-gray-400">
                Try a specific category like &ldquo;engineering&rdquo;, &ldquo;medical&rdquo;, or a tool name such as &ldquo;ROI&rdquo;.
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
