import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex">
      {/* Left pane: visual anchor */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-(--color-primary) to-(--color-secondary) items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold mb-4">Secure Access</h2>
          <p className="text-lg opacity-90">
            Your account is protected with industry-standard encryption
          </p>
        </div>
      </div>

      {/* Right pane: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-(--color-background)">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">
            Sign In
          </h1>
          <p className="text-(--color-muted-text) mb-8">
            Enter your credentials to access your account
          </p>
          <Suspense fallback={<div className="text-center text-(--color-muted-text)">Loading...</div>}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-(--color-muted-text) mt-6">
            Don't have an account?{' '}
            <a href="/signup" className="text-(--color-primary) hover:underline font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}