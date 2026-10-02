'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';

const buttonClass = 'rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400';

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [previousText, setPreviousText] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const revision = useRef(0);
  const stats = useMemo(() => {
    const words = text.match(/\S+/gu)?.length ?? 0;
    return [
      { label: 'Words', value: words.toLocaleString() },
      { label: 'Characters', value: Array.from(text).length.toLocaleString() },
      { label: 'Without whitespace', value: Array.from(text.replace(/\s/gu, '')).length.toLocaleString() },
      { label: 'Paragraphs', value: (text.trim() ? text.trim().split(/\r?\n\s*\r?\n/u).length : 0).toLocaleString() },
      { label: 'Reading time', value: words === 0 ? '0 min' : words < 200 ? '< 1 min' : `${Math.ceil(words / 200)} min` },
    ];
  }, [text]);

  function updateText(value: string) {
    revision.current += 1;
    setText(value);
    setStatus('');
  }

  function transform(value: string, message: string) {
    if (value === text) {
      setStatus('No changes needed.');
      return;
    }
    setPreviousText(text);
    updateText(value);
    setStatus(message);
  }

  async function copyText() {
    const currentRevision = revision.current;
    try {
      await navigator.clipboard.writeText(text);
      if (currentRevision === revision.current) setStatus('Text copied to clipboard.');
    } catch {
      if (currentRevision === revision.current) setStatus('Copy was blocked. Select the text and copy it manually.');
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/utilities" className="mb-6 inline-block text-sm text-blue-400 hover:text-blue-300">&larr; All utilities</Link>
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Text Analyzer</h1>
          <p className="mt-2 text-gray-400">Count words, check reading time, and tidy up your writing.</p>
          <p className="mt-3 text-sm text-emerald-400">Text is processed in your browser. Nothing is uploaded or saved to storage.</p>
        </header>

        <dl className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <dt className="text-sm text-gray-400">{label}</dt>
              <dd className="mt-2 text-2xl font-semibold text-blue-300">{value}</dd>
            </div>
          ))}
        </dl>

        <section aria-label="Text editor" className="rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-6">
          <label htmlFor="analyzer-text" className="mb-2 block text-sm font-medium text-gray-300">Your text</label>
          <textarea
            id="analyzer-text"
            value={text}
            onChange={(event) => {
              updateText(event.target.value);
              setPreviousText(null);
            }}
            rows={12}
            spellCheck={false}
            autoComplete="off"
            placeholder="Type or paste your text here..."
            aria-describedby="count-method"
            className="block w-full resize-y rounded-lg border border-gray-600 bg-gray-950 p-4 leading-relaxed text-gray-100 placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className={buttonClass} disabled={!text} onClick={() => transform(text.toUpperCase(), 'Converted to uppercase.')}>UPPERCASE</button>
            <button type="button" className={buttonClass} disabled={!text} onClick={() => transform(text.toLowerCase(), 'Converted to lowercase.')}>lowercase</button>
            <button type="button" className={buttonClass} disabled={!text} onClick={() => transform(text.split(/\r?\n/u).map((line) => line.replace(/[^\S\r\n]+/gu, ' ').trim()).join('\n').trim(), 'Extra spaces removed. Line breaks preserved.')}>Clean up spaces</button>
            <button type="button" className={buttonClass} disabled={previousText === null} onClick={() => {
              if (previousText !== null) {
                updateText(previousText);
                setPreviousText(null);
                setStatus('Last action undone.');
              }
            }}>Undo last action</button>
            <button type="button" className={buttonClass} disabled={!text} onClick={() => transform('', 'Text cleared. You can undo this action.')}>Clear</button>
            <button type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" disabled={!text} onClick={copyText}>Copy text</button>
          </div>
          <p role="status" className="mt-3 min-h-5 text-sm text-gray-300">{status}</p>
        </section>
        <p id="count-method" className="mt-4 text-sm leading-relaxed text-gray-400">
          Words are separated by whitespace; paragraphs by blank lines. Characters count Unicode code points, including spaces and line breaks. Reading time assumes 200 words per minute.
        </p>
      </div>
    </main>
  );
}
