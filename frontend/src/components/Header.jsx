import Link from 'next/link';

export default function Header({ showUploadButton = true }) {
  return (
    <header className="relative z-50 px-6 py-5">
      <nav className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">L</span>
              </div>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">Lexify</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
            >
              Home
            </Link>
            <Link 
              href="/results" 
              className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
            >
              Demo
            </Link>
            {showUploadButton ? (
              <Link 
                href="/upload"
                className="btn-glow ml-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </span>
              </Link>
            ) : (
              <Link 
                href="/"
                className="ml-2 glass hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
