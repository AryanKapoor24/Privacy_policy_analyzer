'use client';

import { useState, useEffect, useRef } from 'react';

// Simple in-memory cache for deadline extractions
const deadlineCache = new Map();

export default function Timeline({ collectionId }) {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!collectionId || fetchedRef.current) {
      setLoading(false);
      return;
    }

    // Check if already cached
    if (deadlineCache.has(collectionId)) {
      const cached = deadlineCache.get(collectionId);
      setDeadlines(cached.deadlines);
      setError(cached.error);
      setLoading(false);
      fetchedRef.current = true;
      return;
    }

    // Delay extraction slightly to let main analysis complete first
    const timer = setTimeout(() => {
      fetchDeadlines();
    }, 1500); // Start after main simplification is likely done

    return () => clearTimeout(timer);
  }, [collectionId]);

  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add AbortSignal for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for deadline extraction

      const response = await fetch(`${baseUrl}/api/extract-deadlines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection_id: collectionId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to extract deadlines: ${response.statusText}`);
      }

      const data = await response.json();
      const deadlinesList = data.deadlines || [];
      
      // Cache the result
      deadlineCache.set(collectionId, {
        deadlines: deadlinesList,
        error: null,
        timestamp: Date.now()
      });

      setDeadlines(deadlinesList);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn('Deadline extraction timed out - this is OK, main analysis is complete');
        setError('Deadline extraction took too long');
      } else {
        console.error('Error fetching deadlines:', err);
        setError(null); // Silent fail - don't show error to user
      }
      setDeadlines([]);
      
      // Cache the error result too
      deadlineCache.set(collectionId, {
        deadlines: [],
        error: err.message,
        timestamp: Date.now()
      });
    } finally {
      setLoading(false);
      fetchedRef.current = true;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'from-red-500/20 to-red-500/10 border-red-500/30 bg-red-500/5';
      case 'medium':
        return 'from-amber-500/20 to-amber-500/10 border-amber-500/30 bg-amber-500/5';
      case 'low':
        return 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/30 bg-emerald-500/5';
      default:
        return 'from-cyan-500/20 to-cyan-500/10 border-cyan-500/30 bg-cyan-500/5';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/30">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Critical
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Important
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Notice
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            Deadline
          </span>
        );
    }
  };

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Silent fail on errors or empty results - don't disrupt user experience
  // Timeline section just won't appear if no deadlines found
  if (deadlines.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Policy Timeline
          </h2>
          <p className="text-gray-400 text-sm mt-2">{deadlines.length} deadline{deadlines.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {deadlines.map((deadline, index) => (
          <div key={index} className={`glass rounded-2xl p-6 border-l-4 transition-all hover:scale-[1.02] cursor-pointer bg-gradient-to-r ${getPriorityColor(deadline.priority)}`}>
            <div className="flex items-start justify-between gap-4">
              {/* Left: Date & Icon */}
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {deadline.priority?.toLowerCase() === 'high' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>

                <div className="flex-1">
                  {/* Date */}
                  <div className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.009 15.999h1.992v1.993h-1.992zm-5.005 0h1.997v1.993h-1.997zm5.007-5.01h1.99V12h-1.99zm-5.005 0h1.997V12h-1.997zm-.992-5.981C10.996 3.996 10.55 3.55 10 3.55s-.996.446-.996.996v.996H6.002V3.55c0-.55-.447-.996-.996-.996-.55 0-.996.446-.996.996v.996H1.993c-.55 0-.996.446-.996.996v16.023c0 .55.446.996.996.996h20.014c.55 0 .996-.446.996-.996V6.538c0-.55-.446-.996-.996-.996h-3.015V5.546c0-.55-.447-.996-.996-.996s-.996.446-.996.996v.996h-3.01V5.546zm8.016 18.015H1.993V9.527h20.032v14.007z" />
                    </svg>
                    <span>{deadline.date}</span>
                  </div>

                  {/* Action */}
                  <p className="text-gray-200 font-medium mb-3">{deadline.action}</p>

                  {/* Priority Badge */}
                  {getPriorityBadge(deadline.priority)}
                </div>
              </div>

              {/* Right: Timeline Indicator */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  deadline.priority?.toLowerCase() === 'high'
                    ? 'bg-red-500 border-red-400'
                    : deadline.priority?.toLowerCase() === 'medium'
                    ? 'bg-amber-500 border-amber-400'
                    : 'bg-emerald-500 border-emerald-400'
                }`}></div>
                {index < deadlines.length - 1 && (
                  <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-400 flex items-start gap-3">
        <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        <div>
          <p className="font-semibold text-white mb-1">💡 How to use this timeline:</p>
          <p>Review all deadlines carefully. Mark important dates in your calendar. For relative dates (e.g., "within 7 days of result"), add the reference date to calculate the exact deadline.</p>
        </div>
      </div>
    </div>
  );
}
