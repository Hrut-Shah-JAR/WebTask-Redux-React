'use client';

import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/selectors';
import { LoginForm } from '@/components/LoginForm';
import Link from 'next/link';

export default function Home() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-slate-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="text-xl font-black tracking-tight text-white">WealthLedger</p>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Finance command</p>
        </div>
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="rounded-md border border-emerald-300/40 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/10"
          >
            Dashboard
          </Link>
        ) : (
          <a
            href="#login"
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Login
          </a>
        )}
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl grid-cols-1 gap-10 px-4 pb-12 pt-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-12">
        <section className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">
            Live FX, crypto pricing, budget signals
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            A darker, sharper cockpit for personal wealth.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Track portfolio value, spending pressure, exchange rates, and alerts from one high-contrast dashboard built on Redux Toolkit.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ['5', 'Redux slices'],
              ['60s', 'Polling loop'],
              ['12+', 'Memo selectors'],
            ].map(([metric, label]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
                <div className="text-3xl font-black text-emerald-300">{metric}</div>
                <div className="mt-1 text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-2">
            {['Crypto holdings valuation', 'Multi-currency conversion', 'Budget utilization alerts', 'Selector-only insights'].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-slate-900/60 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </section>

        <aside id="login" className="flex items-center">
          <div className="w-full">
            <LoginForm />
          </div>
        </aside>
      </main>
    </div>
  );
}
