import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
  type Middleware,
  type ThunkDispatch,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import portfolioReducer from './slices/portfolioSlice';
import currencyReducer from './slices/currencySlice';
import transactionsReducer from './slices/transactionsSlice';
import notificationsReducer from './slices/notificationsSlice';
import { loginUser, fetchTransactions, fetchCryptoPrices, fetchRates } from './thunks';
import { setBaseCurrency } from './slices/currencySlice';
import { addNotification } from './slices/notificationsSlice';
import { selectBudgetStatus } from './selectors';

export type RootState = {
  auth: ReturnType<typeof authReducer>;
  portfolio: ReturnType<typeof portfolioReducer>;
  currency: ReturnType<typeof currencyReducer>;
  transactions: ReturnType<typeof transactionsReducer>;
  notifications: ReturnType<typeof notificationsReducer>;
};

type ListenerDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

const listenerMiddleware = createListenerMiddleware<RootState, ListenerDispatch>();

listenerMiddleware.startListening({
  actionCreator: loginUser.fulfilled,
  effect: async (_, listenerApi) => {
    listenerApi.dispatch(fetchTransactions());
    listenerApi.dispatch(fetchCryptoPrices());
    listenerApi.dispatch(fetchRates());
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(fetchTransactions.fulfilled),
  effect: async (_, listenerApi) => {
    const budgetStatus = selectBudgetStatus(listenerApi.getState());

    if (budgetStatus.isOver) {
      listenerApi.dispatch(
        addNotification({
          type: 'warning',
          message: `Budget exceeded by $${budgetStatus.overage.toLocaleString('en-US', {
            maximumFractionDigits: 2,
          })}`,
        })
      );
    }
  },
});

const currencyPersistenceMiddleware: Middleware<object, RootState> =
  (storeAPI) => (next) => (action) => {
    const result = next(action);

    if (setBaseCurrency.match(action) && typeof window !== 'undefined') {
      window.localStorage.setItem('preferredCurrency', action.payload);
    }

    if (fetchRates.fulfilled.match(action) && typeof window !== 'undefined') {
      window.localStorage.setItem('preferredCurrency', storeAPI.getState().currency.baseCurrency);
    }

    return result;
  };

const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
    currency: currencyReducer,
    transactions: transactionsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(currencyPersistenceMiddleware),
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
