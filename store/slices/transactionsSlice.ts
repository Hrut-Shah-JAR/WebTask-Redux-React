import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTransactions } from '../thunks';
import { TransactionsState, Transaction, TransactionFilters } from '../types';

const initialFilters: TransactionFilters = {
  selectedCategory: null,
  minAmount: null,
  maxAmount: null,
  startDate: '',
  endDate: '',
};

const initialState: TransactionsState = {
  transactions: [],
  filters: initialFilters,
  loading: false,
  error: null,
  lastUpdated: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactionCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.selectedCategory = action.payload;
    },
    setTransactionFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearTransactionFilters: (state) => {
      state.filters = initialFilters;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.filters = initialFilters;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.transactions = action.payload;
          state.loading = false;
          state.lastUpdated = new Date().toISOString();
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

export const {
  clearTransactions,
  clearTransactionFilters,
  setTransactionCategoryFilter,
  setTransactionFilters,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
