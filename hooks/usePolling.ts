import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { fetchCryptoPrices, fetchRates } from '@/store/thunks';

/**
 * Custom hook for polling price data
 * Re-dispatches thunks at a specified interval (default 60 seconds)
 */
export function usePolling(intervalSeconds: number = 60) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCryptoPrices());
    dispatch(fetchRates());

    const interval = setInterval(() => {
      dispatch(fetchCryptoPrices());
      dispatch(fetchRates());
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [dispatch, intervalSeconds]);
}
