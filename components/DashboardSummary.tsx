'use client';

import { useAppSelector } from '@/store';
import {
  selectFormattedNetWorth,
  selectBaseCurrency,
  selectPortfolioBreakdown,
  selectAlerts,
} from '@/store/selectors';

export function DashboardSummary() {
  const netWorth = useAppSelector(selectFormattedNetWorth);
  const baseCurrency = useAppSelector(selectBaseCurrency);
  const portfolioBreakdown = useAppSelector(selectPortfolioBreakdown);
  const alerts = useAppSelector(selectAlerts);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
        <h2 className="text-slate-400 text-sm font-semibold mb-2">Total Net Worth</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-emerald-300">
            {netWorth}
          </span>
          <span className="text-xl text-slate-400">{baseCurrency}</span>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
        <h3 className="text-lg font-semibold text-white mb-4">Asset Breakdown</h3>
        <div className="space-y-3">
          {portfolioBreakdown.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-amber-500 rounded"></div>
                <span className="font-medium text-slate-200">{asset.symbol}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white">
                  {asset.formattedPercentage}
                </div>
                <div className="text-sm text-slate-500">
                  {baseCurrency} {asset.formattedValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 rounded-md border border-amber-300/20 bg-amber-300/10 p-3">
                <div className="text-amber-300 font-bold mt-0.5">!</div>
                <p className="text-sm text-amber-100">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
