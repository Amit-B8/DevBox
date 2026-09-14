import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200">
          ← Back to DevBox
        </Link>

        <header className="mb-8 border-b border-gray-800 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Contact</p>
          <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        </header>

        <div className="space-y-6 text-gray-300">
          <p>
            For feedback, corrections, or questions about a tool, please use the project’s public contact channel or repository issue tracker.
          </p>

          <p>
            DevBox is intended for general utility and reference use. For medical, legal, or financial decisions, seek the appropriate
            qualified professional guidance.
          </p>
        </div>
      </div>
    </main>
  );
}
