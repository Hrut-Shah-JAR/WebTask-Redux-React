import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUsername = (state: RootState) => state.auth.username;
export const selectAuthLoading = (state: RootState) => state.auth.loading;

// Portfolio selectors
export const selectPortfolio = (state: RootState) => state.portfolio;
export const selectHoldings = (state: RootState) => state.portfolio.holdings;
export const selectPortfolioTotal = (state: RootState) => state.portfolio.totalValue;
export const selectPortfolioLoading = (state: RootState) => state.portfolio.loading;

// Currency selectors
export const selectCurrency = (state: RootState) => state.currency;
export const selectBaseCurrency = (state: RootState) => state.currency.baseCurrency;
export const selectExchangeRates = (state: RootState) => state.currency.rates;
export const selectCurrencyLoading = (state: RootState) => state.currency.loading;

// Transaction selectors
export const selectTransactions = (state: RootState) => state.transactions.transactions;
export const selectTransactionFilters = (state: RootState) => state.transactions.filters;
export const selectSelectedTransactionCategory = (state: RootState) =>
  state.transactions.filters.selectedCategory;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;

// Notifications selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectAlerts = (state: RootState) => state.notifications.alerts;

// ===== COMPOSED SELECTORS (5+ required) =====

// 1. Select portfolio value in selected currency
export const selectPortfolioInCurrency = createSelector(
  [selectPortfolioTotal, selectBaseCurrency, selectExchangeRates],
  (total, baseCurrency, rates) => {
    if (baseCurrency === 'USD') return total;
    const rate = rates[baseCurrency] || 1;
    return total * rate;
  }
);

export const selectFormattedPortfolioValue = createSelector(
  [selectPortfolioInCurrency],
  (value) => value.toLocaleString('en-US', { maximumFractionDigits: 2 })
);

export const selectPortfolioHoldingRows = createSelector(
  [selectHoldings],
  (holdings) =>
    holdings.map((holding) => ({
      symbol: holding.symbol,
      formattedAmount: `${holding.amount.toFixed(4)} coins`,
      formattedValue: holding.value.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      formattedPriceChange: `${holding.priceChange24h > 0 ? '↑' : '↓'} ${Math.abs(
        holding.priceChange24h
      ).toFixed(2)}%`,
      positiveChange: holding.priceChange24h > 0,
    }))
);

// 2. Select net worth (portfolio + cash)
export const selectNetWorth = createSelector(
  [selectPortfolioInCurrency],
  (portfolioValue) => {
    const mockCash = 50000; // Mock cash holdings
    return portfolioValue + mockCash;
  }
);

export const selectFormattedNetWorth = createSelector(
  [selectNetWorth],
  (value) => value.toLocaleString('en-US', { maximumFractionDigits: 2 })
);

// 3. Select transactions filtered by category
export const selectTransactionsByCategory = createSelector(
  [selectTransactions, (_: RootState, category: string) => category],
  (transactions, category) => {
    return transactions.filter((t) => t.category === category);
  }
);

// 4. Select monthly spending by category
export const selectMonthlySpendingByCategory = createSelector(
  [selectTransactions],
  (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const spending: Record<string, number> = {};

    transactions.forEach((transaction) => {
      const txDate = new Date(transaction.date);
      if (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear &&
        transaction.type === 'expense'
      ) {
        spending[transaction.category] = (spending[transaction.category] || 0) + transaction.amount;
      }
    });

    return spending;
  }
);

// 5. Select portfolio breakdown (percentage of each holding)
export const selectPortfolioBreakdown = createSelector(
  [selectHoldings, selectPortfolioTotal],
  (holdings, total) => {
    if (total === 0) return [];
    return holdings.map((holding) => ({
      symbol: holding.symbol,
      percentage: (holding.value / total) * 100,
      formattedPercentage: `${((holding.value / total) * 100).toFixed(1)}%`,
      value: holding.value,
      formattedValue: holding.value.toLocaleString('en-US', { maximumFractionDigits: 2 }),
    }));
  }
);

// 6. Select filtered transactions with date range and amount
export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectTransactionFilters],
  (transactions, filters) => {
    return transactions.filter((t) => {
      if (filters.selectedCategory && t.category !== filters.selectedCategory) return false;
      if (filters.startDate && t.date < filters.startDate) return false;
      if (filters.endDate && t.date > filters.endDate) return false;
      if (filters.minAmount !== null && t.amount < filters.minAmount) return false;
      if (filters.maxAmount !== null && t.amount > filters.maxAmount) return false;
      return true;
    });
  }
);

// 7. Select recent transactions (last 10)
export const selectRecentTransactions = createSelector(
  [selectFilteredTransactions],
  (transactions) => transactions.slice(0, 10)
);

export const selectExpenseCategories = createSelector(
  [selectRecentTransactions],
  (transactions) =>
    Array.from(
      new Set(
        transactions
          .filter((transaction) => transaction.type === 'expense')
          .map((transaction) => transaction.category)
      )
    )
);

export const selectVisibleTransactions = createSelector(
  [selectRecentTransactions],
  (transactions) => transactions
);

// 8. Select asset allocation
export const selectAssetAllocation = createSelector(
  [selectPortfolioBreakdown],
  (breakdown) => {
    return breakdown.map((item) => ({
      name: item.symbol,
      value: Math.round(item.percentage),
    }));
  }
);

// 9. Select total monthly spending
export const selectTotalMonthlySpending = createSelector(
  [selectMonthlySpendingByCategory],
  (spending) => {
    return Object.values(spending).reduce((sum, amount) => sum + amount, 0);
  }
);

// 10. Select budget utilization percentage
export const selectBudgetUtilization = createSelector(
  [selectTotalMonthlySpending],
  (spending) => {
    const monthlyBudget = 5000; // Mock monthly budget
    return (spending / monthlyBudget) * 100;
  }
);

export const selectBudgetProgressValue = createSelector(
  [selectBudgetUtilization],
  (utilization) => Math.min(utilization, 100)
);

// 11. Select if over budget
export const selectIsOverBudget = createSelector(
  [selectBudgetUtilization],
  (utilization) => utilization > 100
);

// 12. Select budget status
export const selectBudgetStatus = createSelector(
  [selectTotalMonthlySpending],
  (spending) => {
    const monthlyBudget = 5000;
    const overage = Math.max(0, spending - monthlyBudget);
    return {
      spent: spending,
      formattedSpent: spending.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      budget: monthlyBudget,
      formattedBudget: monthlyBudget.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      remaining: Math.max(0, monthlyBudget - spending),
      overage,
      formattedOverage: overage.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      isOver: spending > monthlyBudget,
    };
  }
);

export const selectSpendingCategoryRows = createSelector(
  [selectMonthlySpendingByCategory, selectSelectedTransactionCategory],
  (spending, selectedCategory) =>
    Object.entries(spending).map(([category, amount]) => ({
      category,
      amount,
      formattedAmount: amount.toLocaleString('en-US', { maximumFractionDigits: 2 }),
      selected: selectedCategory === category,
    }))
);

export const selectTransactionRows = createSelector(
  [selectVisibleTransactions],
  (transactions) =>
    transactions.map((transaction) => ({
      ...transaction,
      signedAmount: `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toLocaleString(
        'en-US',
        { maximumFractionDigits: 2 }
      )}`,
    }))
);

export const selectConvertedCurrencyRows = createSelector(
  [
    selectBaseCurrency,
    selectExchangeRates,
    (state: RootState) => state.currency.targetCurrencies,
    (_: RootState, amount: number) => amount,
  ],
  (baseCurrency, rates, targetCurrencies, amount) =>
    targetCurrencies.map((currency) => ({
      currency,
      convertedAmount:
        currency === baseCurrency ? amount : amount * (rates[currency] ?? 1),
      formattedAmount: (currency === baseCurrency ? amount : amount * (rates[currency] ?? 1)).toLocaleString(
        'en-US',
        { maximumFractionDigits: 2 }
      ),
    }))
);
