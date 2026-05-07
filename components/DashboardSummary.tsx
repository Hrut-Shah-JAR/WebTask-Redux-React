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
    <div className="space-y-6">
      {/* Net Worth Card */}
      <div className="bg-white rounded-lg shadow-md ring-1 ring-slate-200 p-6">
        <h2 className="text-gray-600 text-sm font-semibold mb-2">Total Net Worth</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-emerald-700">
            {netWorth}
          </span>
          <span className="text-xl text-gray-600">{baseCurrency}</span>
        </div>
      </div>

      {/* Asset Breakdown */}
      <div className="bg-white rounded-lg shadow-md ring-1 ring-slate-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Breakdown</h3>
        <div className="space-y-3">
          {portfolioBreakdown.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-amber-500 rounded"></div>
                <span className="font-medium text-gray-700">{asset.symbol}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {asset.formattedPercentage}
                </div>
                <div className="text-sm text-gray-500">
                  {baseCurrency} {asset.formattedValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md ring-1 ring-slate-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded border border-amber-200">
                <div className="text-amber-600 font-bold mt-0.5">!</div>
                <p className="text-sm text-amber-900">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
