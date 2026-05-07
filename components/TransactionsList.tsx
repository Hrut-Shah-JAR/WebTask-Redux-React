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
      <div className="bg-white rounded-lg shadow-md ring-1 ring-slate-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Spending this month</span>
              <span className="font-semibold text-gray-900">
                ${budgetStatus.formattedSpent} / ${budgetStatus.formattedBudget}
              </span>
            </div>
            <progress
              className={`w-full h-3 rounded-full ${budgetStatus.isOver ? 'accent-red-500' : 'accent-green-500'}`}
              value={budgetProgressValue}
              max={100}
            />
          </div>
          {budgetStatus.isOver && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 text-sm">
              You&apos;re over budget by ${budgetStatus.formattedOverage}
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md ring-1 ring-slate-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        <div className="space-y-2">
          {categoryRows.map((row) => (
            <button
              key={row.category}
              onClick={() => handleCategoryFilter(row.category)}
              className={`w-full text-left p-3 rounded border-2 transition-colors ${
                row.selected
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{row.category}</span>
                <span className="text-gray-900 font-semibold">
                  ${row.formattedAmount}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md ring-1 ring-slate-200 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button
            type="button"
            onClick={() => dispatch(clearTransactionFilters())}
            className="self-start rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Clear filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">Min amount</span>
            <input
              type="number"
              min="0"
              value={filters.minAmount ?? ''}
              onChange={(event) => handleAmountFilter('minAmount', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="0"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">Max amount</span>
            <input
              type="number"
              min="0"
              value={filters.maxAmount ?? ''}
              onChange={(event) => handleAmountFilter('maxAmount', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="500"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">From date</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => handleDateFilter('startDate', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">To date</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => handleDateFilter('endDate', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>

        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions found</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-xs text-gray-500">{transaction.date}</div>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
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
