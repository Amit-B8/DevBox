import Link from 'next/link';

export default function UtilitiesHub() {
  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <header className="mb-12 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2">General Utilities</h1>
          <p className="text-gray-400">Everyday tools for media, security, and quick conversions.</p>
        </header>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link href="/utilities/image-converter" className="group block">
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-emerald-500 transition-all h-full">
                <h3 className="text-xl font-semibold mb-2">Image Converter</h3>
                <p className="text-gray-400 text-sm">Convert PNGs to JPGs and resize assets.</p>
              </div>
            </Link>

            <Link href="/utilities/data-anonymizer" className="group block">
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-emerald-500 transition-all h-full">
                <h3 className="text-xl font-semibold mb-2">Data Anonymizer</h3>
                <p className="text-gray-400 text-sm">Strip PII from datasets for medical research and clinical analysis.</p>
              </div>
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}