import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Transaction, CryptoPriceData } from './types';

// Mock data generator for transactions (seeded for repeatability)
function generateMockTransactions(seed: number = 12345): Transaction[] {
  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health'];
  const transactions: Transaction[] = [];
  const baseDate = new Date();
  baseDate.setDate(1);

  let value = seed;
  const nextRandom = () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };

  for (let i = 0; i < 42; i++) {
    const amount = Math.round((nextRandom() * 460 + 25) * 100) / 100;
    const type = nextRandom() > 0.18 ? 'expense' : 'income';
    const categoryIndex = Math.floor(nextRandom() * categories.length);
    const date = new Date(baseDate);
    date.setDate(date.getDate() + Math.floor(nextRandom() * 28));

    transactions.push({
      id: `txn-${i}`,
      date: date.toISOString().split('T')[0],
      amount,
      category: categories[categoryIndex],
      description: `${type === 'income' ? 'Deposit' : 'Purchase'} - ${categories[categoryIndex]}`,
      type,
    });
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

interface LoginResponse {
  username: string;
  token: string;
}

// Auth thunk
export const loginUser = createAsyncThunk<
  LoginResponse,
  { username: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    return new Promise<LoginResponse>((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username && credentials.password) {
          resolve({
            username: credentials.username,
            token: 'mock-token-' + Date.now(),
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    }).catch(() => rejectWithValue('Invalid credentials'));
  }
);

// Fetch transactions
export const fetchTransactions = createAsyncThunk<Transaction[], void, { rejectValue: string }>(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      return generateMockTransactions(12345);
    } catch {
      return rejectWithValue('Failed to fetch transactions');
    }
  }
);

interface CoinGeckoPrice {
  usd: number;
  usd_market_cap?: number;
  usd_24h_change?: number;
}

// Fetch crypto prices from CoinGecko
export const fetchCryptoPrices = createAsyncThunk<
  CryptoPriceData[],
  string[] | undefined,
  { rejectValue: string }
>(
  'portfolio/fetchCryptoPrices',
  async (symbols = ['bitcoin', 'ethereum', 'solana'], { rejectWithValue }) => {
    try {
      const ids = symbols.join(',');
      const response = await axios.get<Record<string, CoinGeckoPrice>>(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
      );

      const prices: CryptoPriceData[] = [];
      const symbolMap: Record<string, string> = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        solana: 'SOL',
      };

      Object.entries(response.data).forEach(([key, value]) => {
        const symbol = symbolMap[key] || key.toUpperCase();
        prices.push({
          symbol,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          price: value.usd,
          marketCap: value.usd_market_cap,
          priceChange24h: value.usd_24h_change || 0,
        });
      });

      return prices;
    } catch {
      return rejectWithValue('Failed to fetch crypto prices');
    }
  }
);

interface RatesResponse {
  sourceCurrency: string;
  rates: Record<string, number>;
  timestamp: string;
}

// Fetch exchange rates
export const fetchRates = createAsyncThunk<
  RatesResponse,
  string | undefined,
  { rejectValue: string }
>(
  'currency/fetchRates',
  async (sourceCurrency = 'USD') => {
    try {
      const response = await axios.get<{ rates: Record<string, number> }>(
        `https://api.exchangerate-api.com/v4/latest/${sourceCurrency}`
      );

      return {
        sourceCurrency,
        rates: response.data.rates,
        timestamp: new Date().toISOString(),
      };
    } catch {
      const mockRates: Record<string, number> = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
        AUD: 1.53,
        CAD: 1.36,
        CHF: 0.88,
        CNY: 7.24,
        INR: 83.12,
        MXN: 17.05,
      };
      return {
        sourceCurrency,
        rates: mockRates,
        timestamp: new Date().toISOString(),
      };
    }
  }
);
