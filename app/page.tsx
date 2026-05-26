import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-background) p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-(--color-text) mb-6">
          Welcome
        </h1>
        <p className="text-(--color-muted-text) mb-8">
          Sign in or create an account to get started
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="inline-block rounded-lg bg-(--color-primary) text-white px-6 py-3 font-semibold hover:bg-(--color-secondary) transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-block rounded-lg border-2 border-(--color-border) text-(--color-primary) px-6 py-3 font-semibold hover:bg-(--color-surface) transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
