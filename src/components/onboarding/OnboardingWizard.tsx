'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Check, Loader2, Sparkles, User } from 'lucide-react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/Toaster';
import { DEFAULT_APP_PATH, getDisplayName, getWorkspaceName } from '@/lib/auth-redirect';
import type { Database } from '@/lib/database.types';
import { persistOnboarding, profileFormSchema, type ProfileFormData } from '@/lib/profile';
import { createBrowserClient } from '@/lib/supabase';

type WizardStep = 'welcome' | 'profile';

const steps: WizardStep[] = ['welcome', 'profile'];

export const OnboardingWizard = () => {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);
  const [step, setStep] = useState<WizardStep>('welcome');
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
      workspaceName: '',
    },
  });

  useEffect(() => {
    const client = createBrowserClient();
    setSupabase(client);

    const hydrate = async () => {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        router.replace('/auth/login?redirectTo=/onboarding');
        return;
      }

      reset({
        displayName: getDisplayName(user, ''),
        workspaceName: getWorkspaceName(user) ?? '',
      });
      setIsReady(true);
    };

    void hydrate();
  }, [reset, router]);

  const finish = async (skipped: boolean, data?: ProfileFormData) => {
    const saving = skipped ? setIsSkipping : setIsSaving;
    saving(true);

    try {
      if (!supabase) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/login?redirectTo=/onboarding');
        return;
      }

      const values = data ?? getValues();
      const result = await persistOnboarding(supabase, user, {
        displayName: values.displayName || getDisplayName(user),
        workspaceName: values.workspaceName,
        skipped,
      });

      if (result.metadataError) {
        toast.error('Could not finish onboarding', result.metadataError);
        return;
      }

      if (result.profileError) {
        // Session metadata still updated — the wizard will not show again.
        toast.warning(
          'Profile table not saved',
          'Run supabase/migrations/20240904210000_create_profiles.sql in the Supabase SQL Editor, then edit your profile later.'
        );
      } else {
        toast.success(
          skipped ? 'Onboarding skipped' : 'You are all set',
          skipped ? 'You can add a name and workspace any time from Profile.' : 'Welcome to your dashboard.'
        );
      }

      router.replace(DEFAULT_APP_PATH);
      router.refresh();
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      saving(false);
    }
  };

  const handleComplete = handleSubmit((data) => finish(false, data));

  const handleSkip = () => {
    void finish(true);
  };

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading onboarding</span>
      </div>
    );
  }

  const stepIndex = steps.indexOf(step);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">LaunchPad Web</p>
          <h1 className="mt-2 text-2xl font-bold">
            {step === 'welcome' ? "Welcome — let's set up your space" : 'What should we call you?'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 'welcome'
              ? 'A 30-second profile so the dashboard is yours, not a blank shell.'
              : 'Display name is required to finish. Workspace / company is optional.'}
          </p>
        </div>

        <ol className="flex items-center justify-center gap-3" aria-label="Onboarding progress">
          {steps.map((item, index) => {
            const isCurrent = item === step;
            const isDone = index < stepIndex;
            return (
              <li key={item} className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isDone
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isDone ? <Check size={14} aria-hidden="true" /> : index + 1}
                </span>
                {index < steps.length - 1 && <span className="h-px w-10 bg-border" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        {step === 'welcome' ? (
          <div className="space-y-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3 rounded-md border border-border bg-background p-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>We only ask for a display name and an optional workspace so greetings and the sidebar feel personal.</span>
              </li>
              <li className="flex items-start gap-3 rounded-md border border-border bg-background p-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>Skip any time — you will not see this wizard again. Edit later from Profile.</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setStep('profile')}
              className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSkipping || isSaving}
              className="flex w-full justify-center text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-70"
            >
              {isSkipping ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Skipping...
                </>
              ) : (
                'Skip for now'
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleComplete} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-foreground">
                  Display name
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <User size={18} aria-hidden="true" />
                  </span>
                  <input
                    id="displayName"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    {...register('displayName')}
                    className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ada Lovelace"
                  />
                </div>
                {errors.displayName && (
                  <p className="mt-1 text-sm text-red-500">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="workspaceName" className="block text-sm font-medium text-foreground">
                  Workspace / company <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Building2 size={18} aria-hidden="true" />
                  </span>
                  <input
                    id="workspaceName"
                    type="text"
                    autoComplete="organization"
                    {...register('workspaceName')}
                    className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Analytical Engines"
                  />
                </div>
                {errors.workspaceName && (
                  <p className="mt-1 text-sm text-red-500">{errors.workspaceName.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || isSkipping}
              className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Finish and go to dashboard'
              )}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSkipping || isSaving}
              className="flex w-full justify-center text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-70"
            >
              {isSkipping ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Skipping...
                </>
              ) : (
                'Skip for now'
              )}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Wrong account?{' '}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={async () => {
              await supabase?.auth.signOut();
              router.replace('/auth/login');
            }}
          >
            Sign out
          </button>
        </p>
      </div>
    </div>
  );
};
