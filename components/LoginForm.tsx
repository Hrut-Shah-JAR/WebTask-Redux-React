'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectAuthLoading, selectAuth } from '@/store/selectors';
import { loginUser } from '@/store/thunks';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const loading = useAppSelector(selectAuthLoading);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#d9f99d_0,#f6f7f3_34%,#eef2f0_100%)] px-4">
      <div className="bg-white rounded-lg shadow-xl ring-1 ring-slate-200 p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-950 mb-2">WealthLedger</h1>
        <p className="text-center text-slate-600 mb-8">Personal Finance Dashboard</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue="demo"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter username"
            />
            <p className="text-xs text-gray-500 mt-1">Default: demo</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue="demo123"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter password"
            />
            <p className="text-xs text-gray-500 mt-1">Default: demo123</p>
          </div>

          {auth.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {auth.error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-950">
            <strong>Demo Credentials:</strong>
            <br />
            Username: <code className="bg-white px-1">demo</code>
            <br />
            Password: <code className="bg-white px-1">demo123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
