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
    <div className="bg-white rounded-lg shadow-md ring-1 ring-slate-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Currency Converter</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Base Currency
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['USD', 'EUR', 'GBP', 'INR'].map((curr) => (
            <button
              key={curr}
              onClick={() => handleCurrencyChange(curr)}
              className={`py-2 px-3 rounded font-semibold transition-colors ${
                baseCurrency === curr
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount in {baseCurrency}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        {currencyRows.map((row) => (
          <div key={row.currency} className="flex items-center justify-between p-3 bg-slate-50 rounded">
            <span className="font-medium text-gray-700">{row.currency}</span>
            <span className="font-semibold text-gray-900">
              {row.formattedAmount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
