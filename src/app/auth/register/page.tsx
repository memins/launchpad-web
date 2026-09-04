'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LockKeyhole, Mail, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import { toast } from '@/components/ui/Toaster';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (signUpError) {
        toast.error('Registration failed', signUpError.message);
        return;
      }

      router.push('/dashboard');
      toast.success('Registration successful', 'Welcome to LaunchPad Web.');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=/dashboard`,
        },
      });

      if (error) {
        toast.error(`${provider} login failed`, error.message);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error('An unexpected error occurred');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">LaunchPad Web</p>
          <h1 className="mt-2 text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to explore the ship kit dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(handleRegister)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Full name
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User size={18} />
                </span>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  {...register('name')}
                  className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  {...register('email')}
                  className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <LockKeyhole size={18} />
                </span>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  {...register('password')}
                  className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-input"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={!!socialLoading}
              className="flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              {socialLoading === 'google' ? <Loader2 size={18} className="animate-spin" /> : 'Google'}
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              disabled={!!socialLoading}
              className="flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              {socialLoading === 'apple' ? <Loader2 size={18} className="animate-spin" /> : 'Apple'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
