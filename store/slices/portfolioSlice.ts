import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCryptoPrices, fetchRates } from '../thunks';
import { PortfolioState, CryptoPriceData } from '../types';

const initialState: PortfolioState = {
  holdings: [
    { symbol: 'BTC', amount: 0.5, value: 0, priceChange24h: 0 },
    { symbol: 'ETH', amount: 5, value: 0, priceChange24h: 0 },
    { symbol: 'SOL', amount: 20, value: 0, priceChange24h: 0 },
  ],
  totalValue: 0,
  convertedTotalValue: 0,
  conversionCurrency: 'USD',
  loading: false,
  error: null,
  lastUpdated: null,
  ratesLastUpdated: null,
};

function updateConvertedTotal(state: PortfolioState, rates: Record<string, number>, currency = state.conversionCurrency) {
  const rate = rates[currency] ?? 1;
  state.conversionCurrency = currency;
  state.convertedTotalValue = state.totalValue * rate;
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateHolding: (state, action: PayloadAction<{ symbol: string; amount: number }>) => {
      const holding = state.holdings.find((h) => h.symbol === action.payload.symbol);
      if (holding) {
        holding.amount = action.payload.amount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCryptoPrices.fulfilled,
        (state, action: PayloadAction<CryptoPriceData[]>) => {
          let total = 0;

          action.payload.forEach((price) => {
            const holding = state.holdings.find((h) => h.symbol === price.symbol);
            if (holding) {
              holding.value = holding.amount * price.price;
              holding.priceChange24h = price.priceChange24h || 0;
              total += holding.value;
            }
          });

          state.totalValue = total;
          state.convertedTotalValue = total;
          state.conversionCurrency = 'USD';
          state.loading = false;
          state.lastUpdated = new Date().toISOString();
        }
      )
      .addCase(fetchCryptoPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto prices';
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        updateConvertedTotal(state, action.payload.rates, state.conversionCurrency);
        state.ratesLastUpdated = action.payload.timestamp;
      });
  },
});

export const { updateHolding } = portfolioSlice.actions;
export default portfolioSlice.reducer;
