import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCryptoPrices, fetchRates, fetchTransactions } from '../thunks';
import { NotificationsState, Notification, CryptoPriceData } from '../types';

const initialState: NotificationsState = {
  notifications: [],
  alerts: [],
  loading: false,
  error: null,
};

function pushNotification(
  state: NotificationsState,
  notification: Omit<Notification, 'id' | 'timestamp'> & { id: string; timestamp: string }
) {
  state.notifications.unshift(notification);
  if (state.notifications.length > 10) {
    state.notifications.pop();
  }
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{ type: 'alert' | 'info' | 'warning'; message: string }>
    ) => {
      pushNotification(state, {
        id: Date.now().toString(),
        type: action.payload.type,
        message: action.payload.message,
        timestamp: new Date().toISOString(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.alerts = [];
    },
  },
  extraReducers: (builder) => {
    // Listen to crypto price updates and check for >5% change
    builder
      .addCase(fetchCryptoPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCryptoPrices.fulfilled,
        (state, action: PayloadAction<CryptoPriceData[]>) => {
          state.loading = false;
          action.payload.forEach((price) => {
            if (Math.abs(price.priceChange24h || 0) > 5) {
              const direction = (price.priceChange24h || 0) > 0 ? 'up' : 'down';
              const message = `${price.symbol} is ${direction} ${Math.abs(price.priceChange24h || 0).toFixed(2)}% in 24h`;

              state.alerts.push(message);
              if (state.alerts.length > 5) {
                state.alerts.shift();
              }

              pushNotification(state, {
                id: `${price.symbol}-${Date.now()}`,
                type: 'alert',
                message,
                timestamp: new Date().toISOString(),
              });
            }
          });
        }
      )
      .addCase(fetchCryptoPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to evaluate crypto alerts';
      })
      .addCase(fetchTransactions.fulfilled, (state) => {
        const message = 'Transactions refreshed and spending insights recalculated';
        pushNotification(state, {
          id: `transactions-${Date.now()}`,
          type: 'info',
          message,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        pushNotification(state, {
          id: `rates-${action.payload.timestamp}`,
          type: 'info',
          message: 'Exchange rates updated',
          timestamp: action.payload.timestamp,
        });
      });
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
