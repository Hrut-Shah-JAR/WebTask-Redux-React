export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

export interface TransactionFilters {
  selectedCategory: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  startDate: string;
  endDate: string;
}

export interface CryptoPriceData {
  symbol: string;
  name: string;
  price: number;
  marketCap?: number;
  priceChange24h?: number;
  sparkline?: number[];
}

export interface ExchangeRate {
  source: string;
  rates: Record<string, number>;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning';
  message: string;
  timestamp: string;
}

export interface PortfolioHolding {
  symbol: string;
  amount: number;
  value: number;
  priceChange24h: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  loading: boolean;
  error: string | null;
}

export interface PortfolioState {
  holdings: PortfolioHolding[];
  totalValue: number;
  convertedTotalValue: number;
  conversionCurrency: string;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  ratesLastUpdated: string | null;
}

export interface CurrencyState {
  baseCurrency: string;
  targetCurrencies: string[];
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface TransactionsState {
  transactions: Transaction[];
  filters: TransactionFilters;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface NotificationsState {
  notifications: Notification[];
  alerts: string[];
  loading: boolean;
  error: string | null;
}
