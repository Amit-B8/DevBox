"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { toolsData, categories, Category } from '@/data/tools';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("Common Dev");

  // Filter tools based on the currently selected tab
  const filteredTools = toolsData.filter(tool => tool.category === activeCategory);

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">DevBox Dashboard</h1>
          <p className="text-gray-400 mt-1">Select a utility tool to begin.</p>
        </header>

        {/* Category Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 border-b border-gray-800">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeCategory === category 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Tool Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link href={tool.href} key={tool.id}>
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 hover:bg-gray-800 transition cursor-pointer h-full">
                <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
                <p className="text-gray-400 text-sm">{tool.description}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}