"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="py-24 px-4 text-center bg-linear-to-br from-indigo-700 to-indigo-500 text-white">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          E<span className="text-white/90">-DUUKA</span>
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Manage your duuka more efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="group relative overflow-hidden px-10 py-4 rounded-xl bg-white text-indigo-700 font-bold text-lg hover:bg-slate-100 transition-all flex items-center gap-2 justify-center shadow-lg"
          >
            Get Started
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-10 py-4 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/20 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}