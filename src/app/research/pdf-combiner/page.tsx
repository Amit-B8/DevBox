'use client';

import { ChangeEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, FileStack, GripVertical, Merge, Trash2, Upload } from 'lucide-react';
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [orderAnnouncement, setOrderAnnouncement] = useState('');
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

  const moveFile = (from: number, to: number) => {
    if (isMerging || from === to || to < 0 || to >= files.length) return;
    setFiles((currentFiles) => {
      const reordered = [...currentFiles];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      return reordered;
    });
    setOrderAnnouncement(`${files[from].name} moved to position ${to + 1} of ${files.length}.`);
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
          Back to Research &amp; Academic Tools
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
            disabled={isMerging}
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
            disabled={isMerging}
            onChange={handleFileSelection}
            className="hidden"
          />

          {files.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">PDF order</h2>
                <span className="text-sm text-gray-500">{files.length} / {MAX_FILES}</span>
              </div>
              <p className="mb-4 text-sm text-gray-400">Drag files or use the arrows to reorder. PDFs combine from top to bottom.</p>
              <p role="status" className="sr-only">{orderAnnouncement}</p>
              <ol className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    draggable={!isMerging && files.length > 1}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(index));
                      setDraggedIndex(index);
                    }}
                    onDragOver={(event) => {
                      if (draggedIndex === null || isMerging) return;
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                      setDropIndex(index);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (draggedIndex !== null) moveFile(draggedIndex, index);
                      setDraggedIndex(null);
                      setDropIndex(null);
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDropIndex(null);
                    }}
                    className={`flex flex-wrap items-center gap-2 rounded-lg border bg-gray-950 px-3 py-3 sm:gap-3 sm:px-4 ${dropIndex === index && draggedIndex !== index ? 'border-slate-400 ring-1 ring-slate-400' : 'border-gray-800'} ${draggedIndex === index ? 'opacity-50' : ''} ${!isMerging && files.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  >
                    <GripVertical aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-500" />
                    <span className="w-6 shrink-0 text-center font-mono text-sm text-gray-500">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-200" title={file.name}>{file.name}</span>
                    <span className="hidden shrink-0 text-xs text-gray-500 sm:inline">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => moveFile(index, index - 1)}
                      disabled={isMerging || index === 0}
                      aria-label={`Move ${file.name} up`}
                      title="Move up"
                      className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFile(index, index + 1)}
                      disabled={isMerging || index === files.length - 1}
                      aria-label={`Move ${file.name} down`}
                      title="Move down"
                      className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isMerging}
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
