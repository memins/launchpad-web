'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2, User } from 'lucide-react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/Toaster';
import { getDisplayName, getWorkspaceName } from '@/lib/auth-redirect';
import type { Database } from '@/lib/database.types';
import {
  fetchOwnProfile,
  profileFormSchema,
  updateOwnProfile,
  type ProfileFormData,
} from '@/lib/profile';
import { createBrowserClient } from '@/lib/supabase';

const DashboardProfilePage = () => {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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

    const load = async () => {
      const { user, profile } = await fetchOwnProfile(client);

      if (!user) {
        return;
      }

      reset({
        displayName: profile?.display_name || getDisplayName(user, ''),
        workspaceName: profile?.workspace_name || getWorkspaceName(user) || '',
      });
      setIsReady(true);
    };

    void load();
  }, [reset]);

  const handleSave = handleSubmit(async (data) => {
    setIsSaving(true);
    try {
      if (!supabase) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You need to sign in again');
        return;
      }

      const result = await updateOwnProfile(supabase, user, {
        displayName: data.displayName,
        workspaceName: data.workspaceName,
      });

      if (result.profileError && result.metadataError) {
        toast.error('Could not save profile', result.profileError);
        return;
      }

      if (result.profileError) {
        toast.warning(
          'Saved to your session only',
          'Run the profiles SQL migration to persist this across devices.'
        );
      } else {
        toast.success('Profile updated');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  });

  if (!isReady) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading profile</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          The same fields collected during first-run onboarding. Edit them any time.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm"
      >
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

        <button
          type="submit"
          disabled={isSaving}
          className="flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save profile'
          )}
        </button>
      </form>
    </div>
  );
};

export default DashboardProfilePage;
