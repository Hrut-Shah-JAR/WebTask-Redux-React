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
    <div className="bg-white rounded-lg shadow-md ring-1 ring-slate-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Crypto Portfolio</h2>

      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Total Crypto Holdings</p>
        <p className="text-2xl font-bold text-emerald-700">
          {portfolioValue} {baseCurrency}
        </p>
      </div>

      <div className="space-y-3">
        {holdings.map((holding) => (
          <div key={holding.symbol} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-lg w-12">{holding.symbol}</span>
                <span className="text-sm text-gray-500">{holding.formattedAmount}</span>
              </div>
              <div className={`text-sm ${holding.positiveChange ? 'text-green-600' : 'text-red-600'}`}>
                {holding.formattedPriceChange}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {holding.formattedValue}
              </div>
              <div className="text-xs text-gray-500">{baseCurrency}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
