"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function ImageConverter() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('converted-image');
  const [fileSize, setFileSize] = useState(0);
  const [quality, setQuality] = useState(90);
  const [convertedSize, setConvertedSize] = useState(0);
  const conversionVersion = useRef(0);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png') {
        alert('Please upload a valid PNG file.');
        return;
      }
      
      // Save the original filename without the .png extension
      const nameWithoutExt = file.name.replace(/\.png$/i, '');
      setFileName(nameWithoutExt);

      const reader = new FileReader();
      reader.onload = (event) => {
        conversionVersion.current += 1;
        setImageDimensions(null);
        setFileSize(file.size);
        setSelectedImage(event.target?.result as string);
        setConvertedImage(null); // Reset when a new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = () => {
    if (!selectedImage || !canvasRef.current) return;

    const version = ++conversionVersion.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      if (version !== conversionVersion.current) return;
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        // Fill background with white first (JPGs don't support transparency)
        // If we don't do this, transparent PNG areas turn pitch black
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the uploaded PNG over the white background
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to JPG data URL
        const jpgUrl = canvas.toDataURL('image/jpeg', quality / 100);
        const base64 = jpgUrl.slice(jpgUrl.indexOf(',') + 1);
        const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
        setConvertedSize((base64.length * 3) / 4 - padding);
        setConvertedImage(jpgUrl);
      }
    };
    img.src = selectedImage;
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
        
        <Link href="/utilities" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          &larr; Back to Utilities Tools
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">PNG to JPG Converter</h1>
          <p className="text-gray-400 mt-1">Convert images entirely in your browser. No server uploads required.</p>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-xl">
          
          {/* Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              1. Select a PNG File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 hover:border-blue-500 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="text-4xl mb-3">🖼️</span>
                  <p className="mb-2 text-sm text-gray-300">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG files only</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png" 
                  onChange={handleImageUpload} 
                />
              </label>
            </div>
          </div>

          {/* Hidden Canvas for Image Processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Image Preview */}
          {selectedImage && (
            <div className="flex justify-center mb-6">
              <img
                key={selectedImage}
                src={selectedImage}
                onLoad={(event) => setImageDimensions({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })}
                alt="Preview of uploaded PNG"
                className="max-h-64 max-w-full rounded-lg border border-gray-700 object-contain"
              />
            </div>
          )}

          {/* Conversion Actions */}
          {selectedImage && (
            <div className="flex flex-col items-center border-t border-gray-800 pt-8 mt-4">
              <p className="text-gray-300 mb-4 break-all text-center font-mono text-sm">
                File loaded: {fileName}.png
                <span className="ml-2 whitespace-nowrap text-gray-400">
                  ({fileSize < 1024 ? `${fileSize} B` : fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(1)} KB` : `${(fileSize / (1024 * 1024)).toFixed(1)} MB`})
                </span>
              </p>
              {imageDimensions && (
                <p className="mb-4 text-sm text-gray-400">
                  Dimensions: {imageDimensions.width} &times; {imageDimensions.height} pixels
                </p>
              )}
              
              <div className="mb-6 w-full max-w-md rounded-lg border border-gray-700 bg-gray-950 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label htmlFor="jpg-quality" className="text-sm font-medium text-gray-200">JPG quality</label>
                  <output htmlFor="jpg-quality" className="text-sm font-semibold tabular-nums text-blue-300">{quality}%</output>
                </div>
                <input
                  id="jpg-quality"
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={quality}
                  aria-valuetext={`${quality} percent`}
                  aria-describedby="jpg-quality-help"
                  onChange={(event) => {
                    conversionVersion.current += 1;
                    setQuality(Number(event.target.value));
                    setConvertedImage(null);
                  }}
                  className="w-full cursor-pointer accent-blue-500"
                />
                <div aria-hidden="true" className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>Smaller file</span><span>Higher quality</span>
                </div>
                <p id="jpg-quality-help" className="mt-3 text-xs leading-relaxed text-gray-400">
                  Lower quality usually reduces file size. After adjusting, click Convert to JPG to apply it. Image dimensions stay the same.
                </p>
              </div>

              {!convertedImage ? (
                <button 
                  onClick={handleConvert}
                  className="bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] shadow-lg w-full md:w-auto"
                >
                  Convert to JPG &rarr;
                </button>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-4 mb-6 text-emerald-400 text-center w-full">
                    <p role="status">Conversion successful at {quality}% quality!</p>
                    <p className="mt-1 text-sm">
                      JPG size: {convertedSize < 1024 ? `${convertedSize} B` : convertedSize < 1024 * 1024 ? `${(convertedSize / 1024).toFixed(1)} KB` : `${(convertedSize / (1024 * 1024)).toFixed(1)} MB`}
                    </p>
                  </div>
                  <a 
                    href={convertedImage} 
                    download={`${fileName}-converted.jpg`}
                    className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] shadow-lg w-full md:w-auto text-center"
                  >
                    Download JPG ⬇️
                  </a>                  
                  <button 
                    onClick={() => {
                      conversionVersion.current += 1;
                      setSelectedImage(null);
                      setConvertedImage(null);
                    }}
                    className="mt-6 px-6 py-3 rounded-xl border border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:border-blue-500 hover:text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                  >
                    ← Convert another image
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
