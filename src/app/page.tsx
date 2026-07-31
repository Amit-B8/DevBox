import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">DevBox <span className="text-blue-500">.</span></h1>
        <p className="text-xl text-gray-400">Select your workspace to begin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        
        {/* Engineering Hub Path */}
        <Link 
          href="/engineering" 
          className="group flex flex-col items-center justify-center p-12 bg-gray-900 border border-gray-800 rounded-3xl hover:border-blue-500 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] transition-all duration-300 text-center cursor-pointer"
        >
          <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
            ⚙️
          </div>
          <h2 className="text-2xl font-bold mb-4">Engineering & Dev Tools</h2>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            Heavy-duty developer utilities. Everything from JSON parsing and JWT decoding to low-level hardware base conversions.
          </p>
        </Link>

        {/* General Utilities Path */}
        <Link 
          href="/utilities" 
          className="group flex flex-col items-center justify-center p-12 bg-gray-900 border border-gray-800 rounded-3xl hover:border-emerald-500 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] transition-all duration-300 text-center cursor-pointer"
        >
          <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
            📂
          </div>
          <h2 className="text-2xl font-bold mb-4">General Utilities</h2>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            Universal everyday tools. Image converters, document formatters, secure password generators, and fast data utilities.
          </p>
        </Link>

      </div>
    </main>
  );
}