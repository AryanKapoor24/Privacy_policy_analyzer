'use client';

import { useState, useRef } from 'react';

export default function UploadArea({ onFileSelect, file, onRemove, uploading, uploadProgress }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      alert('Please upload a PDF file only.');
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`glass-card rounded-2xl transition-all duration-300 ${dragActive ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#030712]' : ''}`}>
      {!file ? (
        <div
          className={`rounded-2xl p-12 text-center transition-all cursor-pointer relative overflow-hidden group ${
            dragActive
              ? 'bg-emerald-500/10'
              : 'hover:bg-white/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Animated border gradient on hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent)',
            animation: 'shimmer 2s linear infinite'
          }}></div>

          <div className="relative space-y-6">
            {/* Icon */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <svg className={`w-10 h-10 transition-all ${dragActive ? 'text-emerald-400 scale-110' : 'text-gray-400 group-hover:text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-white text-xl font-semibold mb-2">
                {dragActive ? 'Drop your file here' : 'Drag & drop your PDF here'}
              </p>
              <p className="text-gray-400 mb-4">
                or click to browse from your computer
              </p>
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-400 text-sm">PDF files up to 10MB</span>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute top-4 right-4 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500/30"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-500/30"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500/30"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* File Preview */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-xl blur-md"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate text-lg">{file.name}</p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ready
                </span>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={removeFile}
                className="w-10 h-10 rounded-lg glass hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300 flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing document...
                </span>
                <span className="text-emerald-400 font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-emerald-500 to-cyan-500 relative"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20" style={{
                    animation: 'shimmer 1s linear infinite'
                  }}></div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your file is being processed securely</span>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
