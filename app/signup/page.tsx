import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new account',
};

export default async function SignupPage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex">
      {/* Left pane: visual anchor */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-(--color-accent) to-(--color-warning) items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-3xl font-bold mb-4">Get Started</h2>
          <p className="text-lg opacity-90">
            Join our community and unlock powerful features
          </p>
        </div>
      </div>

      {/* Right pane: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-(--color-background)">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">
            Create Account
          </h1>
          <p className="text-(--color-muted-text) mb-8">
            Sign up to get started in seconds
          </p>
          <SignupForm />
          <p className="text-center text-(--color-muted-text) mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-(--color-primary) hover:underline font-semibold">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
