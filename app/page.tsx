'use client';

import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/selectors';
import { LoginForm } from '@/components/LoginForm';
import { Header } from '@/components/Header';
import { DashboardContent } from '@/components/DashboardContent';

export default function Home() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <DashboardContent />
      </main>
    </div>
  );
}
