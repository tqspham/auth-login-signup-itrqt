import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-(--color-background)">
      {/* Header */}
      <header className="bg-(--color-surface) border-b border-(--color-border)">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-(--color-text)">Dashboard</h1>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/login' });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-danger) text-white hover:bg-opacity-90 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-(--color-surface) rounded-lg border border-(--color-border) p-6">
          <h2 className="text-xl font-semibold text-(--color-text) mb-2">
            Welcome, {session.user?.email}
          </h2>
          <p className="text-(--color-muted-text)">
            You are successfully signed in to your account.
          </p>
        </div>
      </main>
    </div>
  );
}
