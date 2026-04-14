'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UploadArea from '../../components/UploadArea';
import Chatbot from '../../components/Chatbot';

export default function UploadPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      // Wrap XHR in a Promise for better async/await handling
      const response = await new Promise((resolve, reject) => {
        xhr.open("POST", `${baseUrl}/api/upload`);
        xhr.onload = () => resolve(xhr);
        xhr.onerror = () => reject(new Error("Network error while uploading file"));
        xhr.onabort = () => reject(new Error("Upload was cancelled"));
        xhr.send(form);
      });

      if (response.status >= 400) {
        let errorInfo = "Upload failed";
        try {
          const errorResponse = JSON.parse(response.responseText);
          errorInfo = errorResponse.error || `Upload failed with status ${response.status}`;
        } catch (e) {
          // Ignore if response is not JSON
        }
        throw new Error(errorInfo);
      }

      let responseBody;
      try {
        responseBody = JSON.parse(response.responseText);
      } catch (err) {
        console.error("Failed to parse JSON response:", err);
        throw new Error("Invalid response from server");
      }
      
      console.log("Upload successful:", responseBody);
      
      // Store the parsed data in session storage
      sessionStorage.setItem('analysisResults', JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        ...responseBody
      }));
      
      // Redirect to results page
      router.push('/results');
      
    } catch (err) {
      console.error("Upload failed:", err);
      // Show user-friendly error message
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <Header showUploadButton={false} />

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-gray-300 text-sm">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upload your <span className="gradient-text">document</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Drop a PDF file below and our AI will simplify it for you in seconds.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <UploadArea
            onFileSelect={handleFileSelect}
            file={file}
            onRemove={handleRemove}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
          
          {/* Action Buttons */}
          {file && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 btn-glow bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 disabled:shadow-none"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze Document
                  </span>
                )}
              </button>
              <button
                onClick={handleRemove}
                disabled={uploading}
                className="px-6 py-4 glass hover:bg-white/10 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {/* What we look for */}
          <div className="glass-card rounded-2xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white text-lg">What we analyze</h3>
            </div>
            <div className="space-y-3">
              {[
                { text: 'Data collection practices', color: 'emerald' },
                { text: 'Third-party sharing details', color: 'cyan' },
                { text: 'Your privacy rights', color: 'purple' },
                { text: 'Security measures', color: 'amber' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className={`w-6 h-6 rounded-lg bg-${item.color}-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <svg className={`w-3.5 h-3.5 text-${item.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="glass-card rounded-2xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white text-lg">What you get</h3>
            </div>
            <div className="space-y-3">
              {[
                { text: 'Plain English summary', icon: '📝' },
                { text: 'Key points highlighted', icon: '🎯' },
                { text: 'Risk assessment', icon: '⚠️' },
                { text: 'AI chat for questions', icon: '💬' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-125 transition-transform">
                    {item.icon}
                  </div>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-medium">Your files are secure</p>
              <p className="text-gray-400 text-xs">Documents are processed securely and never stored</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
}