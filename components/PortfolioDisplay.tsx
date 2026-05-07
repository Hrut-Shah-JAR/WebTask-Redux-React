'use client';

import { useAppSelector } from '@/store';
import {
  selectPortfolioHoldingRows,
  selectFormattedPortfolioValue,
  selectBaseCurrency,
} from '@/store/selectors';

export function PortfolioDisplay() {
  const holdings = useAppSelector(selectPortfolioHoldingRows);
  const portfolioValue = useAppSelector(selectFormattedPortfolioValue);
  const baseCurrency = useAppSelector(selectBaseCurrency);

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
      <h2 className="text-xl font-semibold text-white mb-4">Crypto Portfolio</h2>

      <div className="mb-6 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
        <p className="text-sm text-slate-400 mb-1">Total Crypto Holdings</p>
        <p className="text-2xl font-black text-emerald-300">
          {portfolioValue} {baseCurrency}
        </p>
      </div>

      <div className="space-y-3">
        {holdings.map((holding) => (
          <div key={holding.symbol} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-lg w-12">{holding.symbol}</span>
                <span className="text-sm text-slate-500">{holding.formattedAmount}</span>
              </div>
              <div className={`text-sm ${holding.positiveChange ? 'text-emerald-300' : 'text-red-300'}`}>
                {holding.formattedPriceChange}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">
                {holding.formattedValue}
              </div>
              <div className="text-xs text-slate-500">{baseCurrency}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
