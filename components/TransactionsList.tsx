'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectBudgetProgressValue,
  selectBudgetStatus,
  selectSelectedTransactionCategory,
  selectSpendingCategoryRows,
  selectTransactionFilters,
  selectTransactionRows,
} from '@/store/selectors';
import {
  clearTransactionFilters,
  setTransactionCategoryFilter,
  setTransactionFilters,
} from '@/store/slices/transactionsSlice';

export function TransactionsList() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactionRows);
  const categoryRows = useAppSelector(selectSpendingCategoryRows);
  const budgetStatus = useAppSelector(selectBudgetStatus);
  const budgetProgressValue = useAppSelector(selectBudgetProgressValue);
  const filters = useAppSelector(selectTransactionFilters);
  const selectedCategory = useAppSelector(selectSelectedTransactionCategory);

  const handleCategoryFilter = (category: string) => {
    dispatch(setTransactionCategoryFilter(selectedCategory === category ? null : category));
  };

  const handleAmountFilter = (field: 'minAmount' | 'maxAmount', value: string) => {
    dispatch(setTransactionFilters({ [field]: value === '' ? null : Number(value) }));
  };

  const handleDateFilter = (field: 'startDate' | 'endDate', value: string) => {
    dispatch(setTransactionFilters({ [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Budget Status */}
      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Budget</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Spending this month</span>
              <span className="font-semibold text-white">
                ${budgetStatus.formattedSpent} / ${budgetStatus.formattedBudget}
              </span>
            </div>
            <progress
              className={`w-full h-3 rounded-full ${budgetStatus.isOver ? 'accent-red-400' : 'accent-emerald-400'}`}
              value={budgetProgressValue}
              max={100}
            />
          </div>
          {budgetStatus.isOver && (
            <div className="p-3 bg-red-500/10 border border-red-400/20 rounded text-red-100 text-sm">
              You&apos;re over budget by ${budgetStatus.formattedOverage}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
        <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
        <div className="space-y-2">
          {categoryRows.map((row) => (
            <button
              key={row.category}
              onClick={() => handleCategoryFilter(row.category)}
              className={`w-full text-left p-3 rounded border-2 transition-colors ${
                row.selected
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-300">{row.category}</span>
                <span className="text-white font-semibold">
                  ${row.formattedAmount}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <button
            type="button"
            onClick={() => dispatch(clearTransactionFilters())}
            className="self-start rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10"
          >
            Clear filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5">
          <label className="block">
            <span className="block text-sm font-medium text-slate-300 mb-1">Min amount</span>
            <input
              type="number"
              min="0"
              value={filters.minAmount ?? ''}
              onChange={(event) => handleAmountFilter('minAmount', event.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
              placeholder="0"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-300 mb-1">Max amount</span>
            <input
              type="number"
              min="0"
              value={filters.maxAmount ?? ''}
              onChange={(event) => handleAmountFilter('maxAmount', event.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
              placeholder="500"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-300 mb-1">From date</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => handleDateFilter('startDate', event.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-300 mb-1">To date</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => handleDateFilter('endDate', event.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
          </label>
        </div>

        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-slate-500 text-sm">No transactions found</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] p-3">
                <div>
                  <div className="font-medium text-white">{transaction.description}</div>
                  <div className="text-xs text-slate-500">{transaction.date}</div>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-300' : 'text-slate-200'
                  }`}
                >
                  {transaction.signedAmount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
