'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectBaseCurrency, selectConvertedCurrencyRows } from '@/store/selectors';
import { setBaseCurrency } from '@/store/slices/currencySlice';

export function CurrencyConverter() {
  const dispatch = useAppDispatch();
  const baseCurrency = useAppSelector(selectBaseCurrency);
  const [amount, setAmount] = useState(1000);
  const currencyRows = useAppSelector((state) => selectConvertedCurrencyRows(state, amount));

  const handleCurrencyChange = (currency: string) => {
    dispatch(setBaseCurrency(currency));
  };

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
      <h2 className="text-xl font-semibold text-white mb-4">Currency Converter</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Base Currency
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['USD', 'EUR', 'GBP', 'INR'].map((curr) => (
            <button
              key={curr}
              onClick={() => handleCurrencyChange(curr)}
              className={`py-2 px-3 rounded font-semibold transition-colors ${
                baseCurrency === curr
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Amount in {baseCurrency}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>

      <div className="space-y-2">
        {currencyRows.map((row) => (
          <div key={row.currency} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] p-3">
            <span className="font-medium text-slate-300">{row.currency}</span>
            <span className="font-semibold text-white">
              {row.formattedAmount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
