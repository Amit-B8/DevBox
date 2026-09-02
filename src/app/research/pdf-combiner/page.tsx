'use client';

import { ChangeEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, FileStack, Merge, Trash2, Upload } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const MAX_FILES = 10;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfCombiner() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [isMerging, setIsMerging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = '';
    setError('');

    if (selectedFiles.length === 0) return;
    if (selectedFiles.length > MAX_FILES) {
      setError(`Select up to ${MAX_FILES} PDF files at a time.`);
      return;
    }

    const nonPdfFile = selectedFiles.find(
      (file) => file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'),
    );
    if (nonPdfFile) {
      setError('Only PDF files can be combined.');
      return;
    }

    setFiles(selectedFiles);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((currentFiles) => currentFiles.filter((_, index) => index !== indexToRemove));
    setError('');
  };

  const mergeFiles = async () => {
    if (files.length === 0) {
      setError('Add at least one PDF file to begin.');
      return;
    }

    setIsMerging(true);
    setError('');

    try {
      const combinedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBytes = await file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(fileBytes);
        const pages = await combinedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        pages.forEach((page) => combinedPdf.addPage(page));
      }

      const pdfBytes = await combinedPdf.save();
      const pdfBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength,
      ) as ArrayBuffer;
      const downloadUrl = URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' }));
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'combined-document.pdf';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      setError('One of the selected files could not be read as a valid PDF.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white sm:p-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <Link
          href="/research"
          className="mb-8 inline-flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Research &amp; Academic Toolkit
        </Link>

        <header className="mb-8">
          <div className="mb-4 inline-flex rounded-lg border border-gray-800 bg-gray-900 p-3 text-slate-300">
            <FileStack className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">PDF Combiner</h1>
          <p className="mt-2 text-gray-400">Combine up to 10 PDF documents into one ordered file, entirely in your browser.</p>
        </header>

        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-36 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-950 px-6 py-8 text-center transition-colors hover:border-slate-500 hover:bg-gray-800"
          >
            <Upload className="mb-3 h-7 w-7 text-slate-300" />
            <span className="font-semibold text-gray-100">Choose PDF files</span>
            <span className="mt-1 text-sm text-gray-500">Select 1 to 10 files</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            onChange={handleFileSelection}
            className="hidden"
          />

          {files.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Selected files</h2>
                <span className="text-sm text-gray-500">{files.length} / {MAX_FILES}</span>
              </div>
              <ol className="space-y-2">
                {files.map((file, index) => (
                  <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
                    <span className="w-6 shrink-0 text-center font-mono text-sm text-gray-500">{index + 1}</span>
                    <FileStack className="h-5 w-5 shrink-0 text-slate-400" />
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-200" title={file.name}>{file.name}</span>
                    <span className="shrink-0 text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                      title="Remove file"
                      className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {error && (
            <div role="alert" className="mt-5 flex items-start gap-2 rounded-lg border border-red-900/80 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={mergeFiles}
            disabled={files.length === 0 || isMerging}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-200 px-5 py-3 font-semibold text-gray-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500"
          >
            <Merge className="h-5 w-5" />
            {isMerging ? 'Merging PDFs...' : 'Merge & Download'}
          </button>
        </section>
      </div>
    </main>
  );
}
