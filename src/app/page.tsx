'use client';

import Link from 'next/link';
import { disciplineHubs } from '@/data/tools';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              DevBox
              <span className="block text-transparent bg-gradient-to-r from-slate-400 to-slate-200 bg-clip-text">
                Professional Utility Suite
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              A comprehensive suite of professional calculators, converters, and data utilities across engineering, medical sciences, finance, and creative disciplines.
            </p>
          </div>
        </div>
      </div>

      {/* Discipline Hubs Grid */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplineHubs.map((hub) => {
            const IconComponent = hub.icon;
            return (
              <Link key={hub.id} href={`/${hub.slug}`}>
                <div className="group h-full p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-slate-600 transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
                  {/* Icon */}
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors duration-200">
                    <IconComponent className="w-7 h-7 text-slate-300 group-hover:text-slate-100 transition-colors duration-200" />
                  </div>

                  {/* Hub Name */}
                  <h2 className="text-xl font-semibold text-gray-100 mb-2 group-hover:text-white transition-colors duration-200">
                    {hub.name}
                  </h2>

                  {/* Hub Description */}
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200 leading-relaxed">
                    {hub.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}