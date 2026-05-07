'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from '@/store';
import {
  selectBaseCurrency,
  selectBudgetStatus,
  selectPortfolioChartData,
  selectSpendingChartData,
} from '@/store/selectors';

const chartColors = ['#34d399', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa', '#fb7185'];

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: {
      symbol?: string;
      category?: string;
    };
  }>;
}

function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const title = item.payload?.symbol ?? item.payload?.category ?? label ?? item.name;

  return (
    <div className="rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm shadow-xl shadow-black/40">
      <p className="font-semibold text-white">{title}</p>
      <p className="text-slate-300">{Number(item.value ?? 0).toLocaleString('en-US')}</p>
    </div>
  );
}

export function DashboardCharts() {
  const baseCurrency = useAppSelector(selectBaseCurrency);
  const portfolioData = useAppSelector(selectPortfolioChartData);
  const spendingData = useAppSelector(selectSpendingChartData);
  const budgetStatus = useAppSelector(selectBudgetStatus);

  return (
    <section id="insights" className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Allocation
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">Portfolio Mix</h2>
          </div>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
            {baseCurrency}
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                dataKey="value"
                nameKey="symbol"
                innerRadius={58}
                outerRadius={96}
                paddingAngle={4}
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={entry.symbol} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              Spend
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">Category Burn</h2>
          </div>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
            ${budgetStatus.formattedSpent}
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingData}>
              <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
