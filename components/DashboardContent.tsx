'use client';

import { usePolling } from '@/hooks/usePolling';
import { DashboardSummary } from './DashboardSummary';
import { PortfolioDisplay } from './PortfolioDisplay';
import { TransactionsList } from './TransactionsList';
import { CurrencyConverter } from './CurrencyConverter';
import { DashboardCharts } from './DashboardCharts';

const navItems = [
  { href: '#overview', label: 'Overview', icon: 'OV' },
  { href: '#portfolio', label: 'Portfolio', icon: 'PF' },
  { href: '#transactions', label: 'Transactions', icon: 'TX' },
  { href: '#insights', label: 'Charts', icon: 'CH' },
  { href: '#currency', label: 'Currency', icon: 'FX' },
];

export function DashboardContent() {
  usePolling(60);

  return (
    <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
        <div className="rounded-lg border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-black/30">
          <div className="mb-6 rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              Workspace
            </p>
            <h2 className="mt-2 text-lg font-black text-white">Command Center</h2>
          </div>

          <nav className="space-y-2" aria-label="Dashboard sections">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-md border border-transparent px-3 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[10px] font-black text-emerald-300 transition group-hover:border-emerald-300/40">
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 rounded-md border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-semibold text-slate-500">Polling cadence</p>
            <p className="mt-1 text-2xl font-black text-white">60s</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Prices and FX rates refresh automatically.</p>
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <section id="overview" className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(15,23,42,0.92)_45%,rgba(96,165,250,0.12))] p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                Dashboard
              </p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Minimal controls for a sophisticated finance view.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                Portfolio valuation, spending alerts, transaction filters, charts, and FX conversion stay organized in one focused workspace.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              {['Crypto', 'Budget', 'FX'].map((label) => (
                <div key={label} className="rounded-md border border-white/10 bg-black/20 px-5 py-4">
                  <div className="text-lg font-black text-emerald-300">Live</div>
                  <div className="text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DashboardSummary />

        <section id="portfolio">
          <PortfolioDisplay />
        </section>

        <DashboardCharts />

        <section id="transactions">
          <TransactionsList />
        </section>

        <section id="currency">
          <CurrencyConverter />
        </section>
      </div>
    </div>
  );
}
