'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { selectUsername, selectIsAuthenticated } from '@/store/selectors';
import { logout } from '@/store/slices/authSlice';

export function Header() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const username = useAppSelector(selectUsername);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 text-white shadow-2xl shadow-black/30 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">WealthLedger</h1>
          <p className="text-emerald-300 text-sm">Personal Finance Dashboard</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{username}</p>
            <p className="text-sm text-emerald-300">Connected</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-md font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
