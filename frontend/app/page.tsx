'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">

      {/* 1. TOP NAVIGATION BAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 sm:px-12 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white font-black p-2.5 rounded-xl text-xl shadow-md shadow-blue-500/20">
            SP
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">SellerPortal</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8">
          🚀 The Ultimate E-Commerce Management Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Empower Your Business with <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Smart Seller Tools
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Manage your products, track orders, secure your profile, and scale your sales with our next-generation seller portal dashboard.
        </p>

        {/* HERO CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
          >
            Create Free Account
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 bg-white text-slate-700 border border-slate-300 font-bold rounded-2xl hover:bg-slate-100 transition flex items-center justify-center text-base"
          >
            Existing User? Sign In
          </Link>
        </div>

        {/* 3. FEATURE HIGHLIGHT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-left w-full">

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-xl">
              🛡️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Authentication</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Protected with OTP verification, encrypted passwords, and secure JWT token-based sessions.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 text-xl">
              📦
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Inventory Control</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              List products seamlessly, adjust stock levels, categorize items, and optimize your listings.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-xl">
              📊
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Real-time Analytics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track sales metrics, active orders, and seller statistics right from your unified dashboard.
            </p>
          </div>

        </div>

      </main>

      {/* 4. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500">
        {/* 4. FOOTER */}
        <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500">
          <p>© 2026 SellerPortal App. All rights reserved.</p>
        </footer>
      </footer>

    </div>
  );
}