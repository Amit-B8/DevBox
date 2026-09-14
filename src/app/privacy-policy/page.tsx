import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200">
          ← Back to DevBox
        </Link>

        <header className="mb-8 border-b border-gray-800 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        </header>

        <div className="space-y-6 text-gray-300">
          <p>
            DevBox is a static utility website. We do not require account creation and we do not intentionally collect personal
            data from visitors beyond basic server logs that may be provided by the hosting environment.
          </p>

          <p>
            Some tools may store preferences locally in the browser using standard browser storage such as localStorage for a better
            user experience. That data stays on the device and is not transmitted to us unless your browser or hosting provider
            automatically sends it as part of normal web traffic.
          </p>

          <p>
            If you use the site for any purpose, you are responsible for confirming the accuracy and suitability of tool outputs for
            your own needs, especially in medical, clinical, or financial contexts.
          </p>
        </div>
      </div>
    </main>
  );
}
