'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/selectors';
import { Header } from '@/components/Header';
import { DashboardContent } from '@/components/DashboardContent';

export default function DashboardPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070d] px-4 text-slate-100">
        <div className="max-w-md rounded-lg border border-white/10 bg-slate-950 p-8 text-center shadow-2xl shadow-black/50">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Session required
          </p>
          <h1 className="mt-4 text-3xl font-black text-white">Login to unlock your dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Your Redux session starts from the home page and then loads the portfolio, rates, transactions, and alerts.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            Go to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100">
      <Header />
      <main>
        <DashboardContent />
      </main>
    </div>
  );
}
