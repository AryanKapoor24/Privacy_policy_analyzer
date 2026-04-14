'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Timeline from '../../components/Timeline';

// ComparisonView component for side-by-side comparison
const ComparisonView = ({ originalText, simplifiedText, searchTerm, processingStatus }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Simplified Text (left side) */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Simplified Version
          </h2>
        </div>
        <div className="p-5 max-h-[600px] overflow-y-auto">
          {processingStatus && (
            <div className="mb-4 p-4 glass rounded-xl flex items-center">
              <svg className="animate-spin h-5 w-5 text-emerald-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-emerald-400 text-sm">{processingStatus}</span>
            </div>
          )}
          <div className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
            {simplifiedText}
          </div>
        </div>
      </div>

      {/* Original Text (right side) */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-gray-500/10 to-transparent">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <span className="w-3 h-3 bg-gray-500 rounded-full mr-3"></span>
            Original Document
          </h2>
        </div>
        <div className="p-5 max-h-[600px] overflow-y-auto">
          <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">
            {originalText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const [activeTab, setActiveTab] = useState('comparison');
  const [searchTerm, setSearchTerm] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  
  // Initialize state with default values
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [stats, setStats] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  


  // Load data from session storage and fetch simplified text
  useEffect(() => {
    const storedData = sessionStorage.getItem('analysisResults');
    if (!storedData) {
      setError('No analysis data found. Please upload a document first.');
      setLoading(false);
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(storedData);
      setAnalysisData(parsedData);
      // Set original text right away
      setOriginalText(parsedData.text || 'No original text found.');
    } catch (err) {
      console.error('Error parsing analysis data:', err);
      setError('Failed to load analysis results. Please try again.');
      setLoading(false);
      return;
    }

    // Fetch both original and simplified text (with streaming for simplified)
    const fetchTexts = async () => {
      if (!parsedData?.collection_id) {
        setError('Collection ID is missing, cannot fetch texts.');
        setLoading(false);
        return;
      }

      try {
        // Fetch original text first (non-streaming)
        const originalRes = await fetch(`${baseUrl}/api/original-text/${parsedData.collection_id}`);
        if (!originalRes.ok) {
          const errorData = await originalRes.json();
          throw new Error(`Failed to fetch original text: ${errorData.detail}`);
        }
        const originalResult = await originalRes.json();
        setOriginalText(originalResult.text || 'No original text was returned.');

        // Now fetch simplified text with streaming
        setSimplifiedText(''); // Clear any existing text
        setProcessingStatus('Starting analysis...');
        const simplifiedRes = await fetch(`${baseUrl}/api/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection_id: parsedData.collection_id,
            question: 'Summarize key points of this document.',
          }),
        });

        if (!simplifiedRes.ok) {
          throw new Error('Failed to start streaming simplified text.');
        }

        // Read the stream
        const reader = simplifiedRes.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

          for (const line of lines) {
            try {
              const jsonStr = line.replace('data: ', '');
              const data = JSON.parse(jsonStr);

              if (data.status) {
                // Update processing status
                setProcessingStatus(data.status);
              }
              if (data.token) {
                setProcessingStatus(''); // Clear status when tokens start arriving
                accumulatedText += data.token;
                setSimplifiedText(accumulatedText);
              }
              if (data.done) {
                // Streaming complete
                setProcessingStatus('');
                setLoading(false);
                setLoaded(true);
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseErr) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }

      } catch (fetchError) {
        console.error('Error fetching texts:', fetchError);
        setError(fetchError.message);
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    };

    fetchTexts();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('analysisResult');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.originalText || parsed?.simplifiedText) {
          setOriginalText(parsed.originalText || '');
          setSimplifiedText(parsed.simplifiedText || '');
          setStats(parsed.stats || null);
        }
      }
    } catch (_) {}
    setLoaded(true);
  }, []);

  // Filter text based on search term
  const filterText = (text) => {
    if (!text) return '';
    return text
      .split('\n')
      .filter(line => 
        !searchTerm.trim() || 
        line.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .join('\n');
  };

  const filteredOriginalText = filterText(originalText);
  const filteredSimplifiedText = filterText(simplifiedText);

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <Header showUploadButton={false} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-sm font-medium">Analysis Complete</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Document <span className="gradient-text">Analyzed</span>
              </h1>
              <p className="text-gray-400">
                Your document has been simplified. Compare the results below.
              </p>
            </div>
            <Link 
              href="/upload"
              className="btn-glow inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/25"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Document
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card rounded-2xl p-4 mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-1 p-1 glass rounded-xl">
              {[
                { id: 'comparison', label: 'Side-by-Side', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                )},
                { id: 'original', label: 'Original', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )},
                { id: 'simplified', label: 'Simplified', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )},
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-48 glass rounded-xl bg-white/5 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none border border-white/10"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 glass hover:bg-white/10 text-gray-300 text-sm font-medium rounded-xl transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Content Display */}
        <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {activeTab === 'comparison' && (
            <ComparisonView
              originalText={filteredOriginalText}
              simplifiedText={filteredSimplifiedText}
              searchTerm={searchTerm}
              processingStatus={processingStatus}
            />
          )}

          {activeTab === 'original' && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5 bg-gradient-to-r from-gray-500/10 to-transparent">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <span className="w-3 h-3 bg-gray-500 rounded-full mr-3"></span>
                  Original Document
                </h2>
              </div>
              <div className="p-5 max-h-[600px] overflow-y-auto">
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">
                  {filteredOriginalText}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'simplified' && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <span className="relative flex h-3 w-3 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  Simplified Version
                </h2>
              </div>
              <div className="p-5 max-h-[600px] overflow-y-auto">
                {processingStatus && (
                  <div className="mb-4 p-4 glass rounded-xl flex items-center">
                    <svg className="animate-spin h-5 w-5 text-emerald-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-emerald-400 text-sm">{processingStatus}</span>
                  </div>
                )}
                <div className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {filteredSimplifiedText}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          {[
            { 
              value: stats?.complexityReduction ? Math.round(stats.complexityReduction * 100) + '%' : '85%',
              label: 'Simpler',
              color: 'emerald',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )
            },
            { 
              value: stats?.keyPoints ?? 12,
              label: 'Key Points Found',
              color: 'cyan',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              )
            },
            { 
              value: stats?.readingSpeedGain ? stats.readingSpeedGain + 'x' : '3x',
              label: 'Faster to Read',
              color: 'purple',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 card-hover group">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline / Deadlines Section */}
        <div className="mt-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Timeline collectionId={analysisData?.collection_id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
