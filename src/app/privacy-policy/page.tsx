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
            DevBox does not require an account. Tool inputs and outputs continue to be processed in your browser.
            Our optional usage reporting is disabled by default. When enabled, it sends only a tool identifier and action;
            the service adds a timestamp. It does not send passwords, JWT contents, documents, or medical or financial inputs.
          </p>

          <p>
            Some tools may store preferences locally in the browser using standard browser storage such as localStorage for a better
            user experience. These saved preferences and tool values are not sent by our usage reporting.
          </p>

          <p>
            When the feedback form is enabled and you submit it, we store your category, message, submission time,
            and an optional tool identifier. Do not include personal or sensitive information. Hosting and abuse-protection
            services may process connection information such as IP addresses; our application does not store IP addresses in the database.
          </p>

          <p>
            Usage reporting uses no tracking cookies or persistent visitor identifiers and respects browser Do Not Track
            and Global Privacy Control signals. Before enabling collection, the deployment must configure retention cleanup
            for usage records older than 30 days and feedback older than 180 days, including an appropriate backup retention policy.
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
