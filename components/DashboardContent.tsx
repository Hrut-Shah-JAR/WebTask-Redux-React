'use client';

import { usePolling } from '@/hooks/usePolling';
import { DashboardSummary } from './DashboardSummary';
import { PortfolioDisplay } from './PortfolioDisplay';
import { TransactionsList } from './TransactionsList';
import { CurrencyConverter } from './CurrencyConverter';

export function DashboardContent() {
  // Set up polling for price updates (60 seconds)
  usePolling(60);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Summary and Portfolio */}
        <div className="lg:col-span-1 space-y-6">
          <DashboardSummary />
          <PortfolioDisplay />
        </div>

        {/* Right column - Transactions and Currency */}
        <div className="lg:col-span-2 space-y-6">
          <TransactionsList />
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
}
