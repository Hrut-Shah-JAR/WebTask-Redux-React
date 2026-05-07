import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRates } from '../thunks';
import { CurrencyState } from '../types';

const initialState: CurrencyState = {
  baseCurrency: 'USD',
  targetCurrencies: ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN'],
  rates: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.baseCurrency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRates.fulfilled,
        (
          state,
          action: PayloadAction<{
            sourceCurrency: string;
            rates: Record<string, number>;
            timestamp: string;
          }>
        ) => {
          state.rates = action.payload.rates;
          state.loading = false;
          state.lastUpdated = action.payload.timestamp;
        }
      )
      .addCase(fetchRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exchange rates';
      });
  },
});

export const { setBaseCurrency } = currencySlice.actions;
export default currencySlice.reducer;
