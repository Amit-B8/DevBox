import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200">
          ← Back to DevBox
        </Link>

        <header className="mb-8 border-b border-gray-800 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">About</p>
          <h1 className="text-4xl font-bold tracking-tight">About DevBox</h1>
        </header>

        <div className="space-y-6 text-gray-300">
          <p>
            DevBox is a collection of useful, browser-based tools for developers, engineers, researchers, and technical teams.
            The goal is to make common workflows faster, clearer, and easier to repeat without leaving the browser.
          </p>

          <p>
            The site is organized into practical categories so visitors can quickly find the tool they need for engineering,
            mathematics, medical reference, finance, creative work, and general productivity.
          </p>

          <p>
            DevBox is built with Next.js, TypeScript, and Tailwind CSS, and it is designed to stay lightweight, readable,
            and easy to extend over time.
          </p>
        </div>
      </div>
    </main>
  );
}
