import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200">
          ← Back to DevBox
        </Link>

        <header className="mb-8 border-b border-gray-800 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight">Terms of Use</h1>
        </header>

        <div className="space-y-6 text-gray-300">
          <p>
            DevBox provides informational utilities for general use. The tools are offered as-is, without warranties of any kind,
            and should not be treated as authoritative sources for clinical, financial, or legal decisions.
          </p>

          <p>
            Use the site at your own discretion. You are responsible for reviewing and verifying any results, especially in situations
            where accuracy, safety, or compliance matters.
          </p>

          <p>
            We may update the site, improve tools, or change content at any time without notice. Continued use of the site implies
            your acceptance of the current terms and any applicable changes.
          </p>
        </div>
      </div>
    </main>
  );
}
