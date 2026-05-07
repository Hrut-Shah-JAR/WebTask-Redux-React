# WealthLedger - Personal Finance Dashboard

A comprehensive personal finance application built with Next.js, TypeScript, Redux Toolkit, and Tailwind CSS.

## Architecture Overview

### Redux Architecture (40% evaluation focus)

The application uses a sophisticated Redux Toolkit setup with:

- **5 Slices**: `authSlice`, `portfolioSlice`, `currencySlice`, `transactionsSlice`, `notificationsSlice`
- **Async Thunks**: All API calls managed through `createAsyncThunk`
- **Cross-Slice Side Effects**: Implemented with `extraReducers` plus RTK `listenerMiddleware`
- **Loading & Error States**: Each slice manages explicit loading and error states

### Thunk Pipeline

1. **`loginUser`** → Triggers `fetchTransactions` & `fetchCryptoPrices` & `fetchRates`
2. **`fetchCryptoPrices`** → Updates `portfolioSlice` and triggers `notificationsSlice` alerts
3. **`fetchRates`** → Updates `currencySlice`, refreshes portfolio rate metadata, and persists the selected currency through middleware

### Cross-Slice Integration

**3+ Cross-Slice Side Effects:**

1. **Login → Data Fetch**: When login succeeds, `listenerMiddleware` automatically dispatches transaction, crypto price, and exchange rate fetches
2. **Crypto Prices → Portfolio + Notifications**: When prices are fetched, portfolio holdings are updated AND notifications are triggered if any asset moves >5%
3. **Exchange Rates → Currency + Portfolio + Notifications**: When rates are fetched, currency state updates, portfolio records rate freshness, and notifications record the refresh
4. **Transactions → Spending + Notifications**: When transactions load, selectors recalculate budget status and listener middleware creates over-budget alerts

### Selectors & Memoization (25% evaluation focus)

12+ memoized selectors using `createSelector`:

- `selectNetWorth` - Derived portfolio value in selected currency + mock cash
- `selectMonthlySpendingByCategory` - Computed from transactions filtered by date
- `selectPortfolioBreakdown` - Percentage allocation of each holding
- `selectRecentTransactions` - Filtered and sorted transaction list
- `selectBudgetStatus` - Monthly budget utilization
- `selectIsOverBudget` - Boolean derived from budget status
- `selectTransactionsByCategory` - Parameterized selector for filtering
- `selectAssetAllocation` - Formatted for charting
- `selectTotalMonthlySpending` - Aggregated from spending by category
- `selectBudgetUtilization` - Percentage calculation
- `selectPortfolioInCurrency` - Currency conversion with rates
- `selectFilteredTransactions` - Complex date/amount range filtering

### View Layer Architecture (20% evaluation focus)

**Smart Components** (dispatch actions):
- `LoginForm` - Handles authentication
- `DashboardContent` - Sets up polling with custom hook

**Dumb Components** (read-only from selectors):
- `DashboardSummary` - Displays net worth and asset breakdown
- `PortfolioDisplay` - Shows crypto holdings
- `TransactionsList` - Lists and filters transactions
- `CurrencyConverter` - Converts amounts between currencies
- `Header` - Navigation and user info

### Data Flow

```
User Input
    ↓
Component Event → Dispatch Action/Thunk
    ↓
Listener Middleware / extraReducers Update State
    ↓
Selector Computes Derived Data (memoized)
    ↓
Component Re-renders (only if selector output changed)
```

## Project Structure

```
/store
  ├── index.ts           # Store configuration with middleware and listeners
  ├── types.ts          # TypeScript interfaces for all data
  ├── thunks.ts         # All async thunk definitions
  ├── selectors.ts      # 12+ memoized selectors
  └── /slices
      ├── authSlice.ts
      ├── portfolioSlice.ts
      ├── currencySlice.ts
      ├── transactionsSlice.ts
      └── notificationsSlice.ts

/components
  ├── LoginForm.tsx          # Smart: handles login
  ├── DashboardContent.tsx   # Smart: sets up polling
  ├── Header.tsx             # Dumb: displays header
  ├── DashboardSummary.tsx   # Dumb: net worth display
  ├── PortfolioDisplay.tsx   # Dumb: crypto holdings
  ├── TransactionsList.tsx   # Dumb: transaction list
  └── CurrencyConverter.tsx  # Dumb: currency conversion

/hooks
  └── usePolling.ts    # Custom hook for 60s polling interval

/app
  ├── layout.tsx        # Root layout with Providers
  ├── page.tsx         # Main page component
  ├── providers.tsx    # Redux Provider wrapper
  └── globals.css
```

## Features Implemented

### 01 - Auth + Onboarding
- Mock login with hardcoded credentials (demo/demo123)
- Dispatches data fetching from RTK listener middleware
- Cross-slice effect: Login triggers transaction & price fetches

### 02 - Transaction Feed + Filtering
- 42 seeded transactions (deterministic mock data)
- Filtering by category entirely in selectors
- Memoized `selectMonthlySpendingByCategory`, `selectFilteredTransactions`

### 03 - Crypto Portfolio Tracker
- BTC, ETH, SOL prices from CoinGecko API
- Real-time portfolio value calculation
- >5% price change alerts trigger notifications

### 04 - Multi-Currency Converter
- Live exchange rates from ExchangeRate-API (with fallback mock rates)
- Portfolio value conversion based on selected currency
- Currency preference persisted to localStorage via middleware

### 05 - Net Worth Dashboard + Polling
- 60-second auto-polling of prices and rates
- All values from selectors (zero component logic)
- usePolling custom hook manages interval setup

### 06 - Spending Insights + Budget Alerts
- Monthly spending by category with budget tracking
- Budget status selector computes remaining amount
- Over-budget alerts generated by RTK `listenerMiddleware`

## Authentication

**Demo Credentials:**
- Username: `demo`
- Password: `demo123`

## Public APIs Used

1. **CoinGecko** - Crypto prices, no API key required
2. **ExchangeRate-API** - Live FX rates (free tier)
3. **Mock Faker** - Seeded transaction data (no external API)

## Running the Application

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000` and login with demo credentials.

## Key Technical Decisions

1. **Typed Everything**: Full TypeScript - no `any` types
2. **Selector-Driven**: All derived data in selectors, not components
3. **Thunk-Owned Data**: All API calls in thunks, never in components
4. **Memoized Selectors**: Prevents unnecessary re-renders
5. **Listener Middleware**: Handles thunk chaining and budget side effects cleanly
6. **Smart/Dumb Split**: Clear separation of concerns between component types

## Evaluation Criteria

- ✅ Redux architecture with 3+ cross-slice extraReducers patterns
- ✅ 5 slices with explicit loading/error states
- ✅ 12+ composed memoized selectors
- ✅ RTK listenerMiddleware budget alert flow
- ✅ Zero API calls in components
- ✅ Full TypeScript typing
- ✅ Smart vs dumb component separation visible
- ✅ Consistent Tailwind styling
- ✅ 60s polling interval with custom hook
