'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { cn } from '@/lib/cn';

type FormState = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormState]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name as keyof FormState];
      setErrors(updatedErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (!result?.ok) {
        setGeneralError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setGeneralError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {generalError && (
        <div className="flex items-start gap-3 rounded-lg bg-(--color-danger) bg-opacity-10 p-4 text-(--color-danger)">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{generalError}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-(--color-text) mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-muted-text)" />
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={cn(
              'w-full pl-10 pr-4 py-3 rounded-lg border-2 text-sm placeholder:text-(--color-muted-text)',
              errors.email
                ? 'border-(--color-danger) bg-opacity-5'
                : 'border-(--color-border) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2'
            )}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-(--color-danger) flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-(--color-text) mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-muted-text)" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={cn(
              'w-full pl-10 pr-10 py-3 rounded-lg border-2 text-sm placeholder:text-(--color-muted-text)',
              errors.password
                ? 'border-(--color-danger) bg-opacity-5'
                : 'border-(--color-border) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2'
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted-text) hover:text-(--color-text) transition"
          >
            {showPassword ? '👁' : '👁‍🗨'}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-(--color-danger) flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-lg bg-(--color-primary) text-white font-semibold hover:bg-(--color-secondary) active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {isLoading && <Loader className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
