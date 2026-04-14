import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <Header />

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-bounce-subtle">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-sm font-medium">AI-Powered Analysis</span>
                <span className="text-gray-500 text-sm">• Free to use</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Privacy policies,
                <br />
                <span className="gradient-text">finally readable.</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                Upload any legal document and get a clear, simple breakdown powered by AI. 
                No more scrolling through pages of confusing legal jargon.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/upload"
                  className="btn-glow bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/25"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Document
                  </span>
                </Link>
                <Link 
                  href="/results"
                  className="glass hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
                >
                  See Demo →
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-900 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-300">{['JD', 'SK', 'AM', 'RK'][i]}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-400">Trusted by <span className="text-white font-semibold">10,000+</span> users</p>
                </div>
              </div>
            </div>

            {/* Right Side - Animated Visual */}
            <div className="flex-1 relative hidden lg:block">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Main card */}
                <div className="glass-card rounded-3xl p-8 animate-float">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-emerald-500/30 to-transparent rounded-full w-3/4"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-500/30 to-transparent rounded-full w-full"></div>
                    <div className="h-4 bg-gradient-to-r from-cyan-500/30 to-transparent rounded-full w-5/6"></div>
                    <div className="h-4 bg-gradient-to-r from-emerald-500/30 to-transparent rounded-full w-2/3"></div>
                  </div>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Analysis Complete</p>
                      <p className="text-sm text-gray-400">Found 12 key insights</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge 1 */}
                <div className="absolute -top-6 -right-6 glass-card px-4 py-2 rounded-xl animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Fast AI</span>
                  </div>
                </div>

                {/* Floating badge 2 */}
                <div className="absolute -bottom-4 -left-8 glass-card px-4 py-2 rounded-xl animate-float" style={{animationDelay: '1s'}}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative py-16 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '50K+', label: 'Documents Analyzed', icon: '📄' },
                { value: '10K+', label: 'Happy Users', icon: '👥' },
                { value: '99%', label: 'Accuracy Rate', icon: '🎯' },
                { value: '<30s', label: 'Average Time', icon: '⚡' },
              ].map((stat, i) => (
                <div key={i} className="text-center animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">Simple Process</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How it works
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Three simple steps to understand any legal document in seconds
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-purple-500/50"></div>
              
              {[
                { 
                  num: '01', 
                  title: 'Upload your PDF',
                  desc: 'Drag and drop any privacy policy or legal document in PDF format.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  ),
                  color: 'emerald'
                },
                { 
                  num: '02', 
                  title: 'AI Processing',
                  desc: 'Our advanced AI reads through the document and identifies key information.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  color: 'cyan'
                },
                { 
                  num: '03', 
                  title: 'Get your summary',
                  desc: 'Read a simplified version with all the important points clearly listed.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  color: 'purple'
                },
              ].map((step, i) => (
                <div key={i} className="relative group">
                  <div className={`glass-card rounded-3xl p-8 card-hover`}>
                    <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center relative icon-glow bg-${step.color}-500/20`}>
                      <div className={`text-${step.color}-400`}>{step.icon}</div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-${step.color}-400 text-sm font-mono font-bold`}>{step.num}</span>
                      <div className={`h-px flex-1 bg-gradient-to-r from-${step.color}-500/50 to-transparent`}></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-24 mesh-gradient relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase mb-4 block">Features</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why choose <span className="gradient-text">Lexify?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Built for people who don&apos;t speak legalese
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: 'Lightning Fast',
                  desc: 'Get results in under 30 seconds',
                  color: 'emerald',
                  gradient: 'from-emerald-500 to-cyan-500'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'High Accuracy',
                  desc: 'AI-powered precise analysis',
                  color: 'blue',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: 'Secure & Private',
                  desc: 'Your data is never stored',
                  color: 'purple',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Free Forever',
                  desc: 'No credit card required',
                  color: 'amber',
                  gradient: 'from-amber-500 to-orange-500'
                },
              ].map((feature, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 card-hover group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Large feature cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="gradient-border glass-card rounded-3xl p-8 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">AI Chat Assistant</h3>
                      <p className="text-gray-400 text-sm">Ask questions about your document</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Not sure what something means? Our AI chatbot can answer any question about your uploaded document in plain English.
                  </p>
                </div>
              </div>

              <div className="gradient-border glass-card rounded-3xl p-8 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Side-by-Side View</h3>
                      <p className="text-gray-400 text-sm">Compare original with simplified</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    See the original document and simplified version side by side. Highlight and cross-reference sections easily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Loved by users
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Finally, I can understand what I'm agreeing to. This tool is a game changer!",
                  author: "Sarah M.",
                  role: "Product Manager",
                  avatar: "SM"
                },
                {
                  quote: "I use this for every new app I sign up for. It's incredibly accurate and fast.",
                  author: "James K.",
                  role: "Software Engineer",
                  avatar: "JK"
                },
                {
                  quote: "The AI chat feature is amazing. I can ask specific questions and get clear answers.",
                  author: "Emily R.",
                  role: "Marketing Lead",
                  avatar: "ER"
                },
              ].map((testimonial, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 card-hover">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{testimonial.author}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]"></div>
          
          <div className="max-w-4xl mx-auto text-center px-6 relative">
            <div className="glass-card rounded-3xl p-12 md:p-16 gradient-border">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-8 animate-bounce-subtle">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to understand your<br />
                <span className="gradient-text">next privacy policy?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                It takes less than a minute. No account required. Start analyzing documents for free.
              </p>
              <Link 
                href="/upload"
                className="btn-glow inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-10 py-5 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/25"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}