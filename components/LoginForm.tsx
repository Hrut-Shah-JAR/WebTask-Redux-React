'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectAuthLoading, selectAuth, selectIsAuthenticated } from '@/store/selectors';
import { loginUser } from '@/store/thunks';

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const loading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    dispatch(loginUser({ username, password }));
  };

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Secure access</p>
        <h2 className="text-3xl font-bold text-white">Enter WealthLedger</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Sign in to load your portfolio, transactions, alerts, and currency workspace.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-200">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue="demo"
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue="demo123"
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="Enter password"
          />
        </div>

        {auth.error && (
          <div className="rounded-md border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            {auth.error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-emerald-400 px-4 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Opening dashboard...' : 'Login to dashboard'}
        </button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-3 rounded-md border border-amber-300/20 bg-amber-300/10 p-4 text-xs text-amber-100">
        <span>
          <strong className="block text-amber-200">Username</strong>
          <code>demo</code>
        </span>
        <span>
          <strong className="block text-amber-200">Password</strong>
          <code>demo123</code>
        </span>
      </div>
    </section>
  );
}
