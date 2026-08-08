import Link from 'next/link';

export default function EngineeringHub() {
  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block transition-colors">
          &larr; Back to Home
        </Link>
        
        <header className="mb-12 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Engineering Tools</h1>
          <p className="text-gray-400">Utilities for full-stack architecture and low-level system design.</p>
        </header>

        {/* Section 1: Web & Payloads */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span>🌐</span> Web & Data Payloads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link href="/engineering/json-markdown" className="group block">
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-blue-500 transition-all h-full">
                <h3 className="text-xl font-semibold mb-2">JSON ⇄ Markdown</h3>
                <p className="text-gray-400 text-sm">Convert JSON payloads into formatted Markdown tables.</p>
              </div>
            </Link>

            <Link href="/engineering/jwt" className="group block">
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-blue-500 transition-all h-full">
                <h3 className="text-xl font-semibold mb-2">JWT Inspector</h3>
                <p className="text-gray-400 text-sm">Decode, verify, and inspect JSON Web Tokens.</p>
              </div>
            </Link>

          </div>
        </section>

        {/* Section 2: Hardware & Embedded */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span>🔢</span> Number Systems & Bitwise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link href="/engineering/base-converter" className="group block">
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-blue-500 transition-all h-full">
                <h3 className="text-xl font-semibold mb-2">Hex / Bin / Dec</h3>
                <p className="text-gray-400 text-sm">Convert values between Hexadecimal, Binary, Octal, and Decimal formats seamlessly.</p>
              </div>
            </Link>

            <Link href="/engineering/bitwise" className="group block">
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-blue-500 transition-all h-full">
                <h3 className="text-xl font-semibold mb-2">Bitwise Calculator</h3>
                <p className="text-gray-400 text-sm">Perform AND, OR, XOR, and bit-shifting operations on binary sequences.</p>
              </div>
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}