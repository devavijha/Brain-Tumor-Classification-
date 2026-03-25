'use client';

import { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function ImageUploader({ onImageSelect, loading = false, disabled = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  return (
    <div
      className="group relative rounded-2xl border border-dashed border-gray-300 hover:border-gray-800 transition-colors duration-300 p-12 cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative text-center z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mb-6 text-gray-400 group-hover:scale-110 group-hover:text-gray-900 transition-all duration-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-2">Upload MRI Sequence</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">
          Drag and drop your scan here, or click to browse files from your computer
        </p>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          JPEG, PNG, DICOM up to 10MB
        </p>
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block">
            <div className="spinner w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
