import type { SupabaseClient, User } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database, ProfileRow } from '@/lib/database.types';
import { getDisplayName } from '@/lib/auth-redirect';

export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(80, 'Display name must be 80 characters or less'),
  workspaceName: z
    .string()
    .trim()
    .max(80, 'Workspace name must be 80 characters or less')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export type Profile = ProfileRow;

export type PersistOnboardingInput = {
  displayName: string;
  workspaceName?: string;
  skipped: boolean;
};

export type PersistOnboardingResult = {
  profile: Profile | null;
  profileError: string | null;
  metadataError: string | null;
};

const nowIso = () => new Date().toISOString();

export const isProfileOnboarded = (profile: Pick<Profile, 'onboarding_completed_at'> | null) =>
  Boolean(profile?.onboarding_completed_at);

/**
 * Load the signed-in user's profile. Returns null if the table is missing
 * (buyer has not run the SQL yet) or the row does not exist.
 */
export const fetchOwnProfile = async (supabase: SupabaseClient<Database>) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, profile: null, error: userError?.message ?? 'Not signed in' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    return { user, profile: null, error: error.message };
  }

  return { user, profile: data, error: null };
};

/**
 * Mark onboarding finished (complete or skip) and persist the small profile.
 * Metadata is always updated so middleware can gate without an extra query.
 * A missing `profiles` table is non-fatal — buyers still reach /dashboard.
 */
export const persistOnboarding = async (
  supabase: SupabaseClient<Database>,
  user: User,
  input: PersistOnboardingInput
): Promise<PersistOnboardingResult> => {
  const completedAt = nowIso();
  const displayName = input.displayName.trim() || getDisplayName(user);
  const workspaceName = input.workspaceName?.trim() || null;

  const { data, error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        display_name: displayName,
        workspace_name: workspaceName,
        onboarding_completed_at: completedAt,
      },
      { onConflict: 'id' }
    )
    .select('*')
    .maybeSingle();

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      display_name: displayName,
      name: displayName,
      workspace_name: workspaceName,
      onboarding_completed: true,
      onboarding_skipped: input.skipped,
    },
  });

  // Refresh so middleware sees onboarding_completed on the next /dashboard request.
  if (!metadataError) {
    await supabase.auth.refreshSession();
  }

  return {
    profile: data,
    profileError: profileError?.message ?? null,
    metadataError: metadataError?.message ?? null,
  };
};

export const updateOwnProfile = async (
  supabase: SupabaseClient<Database>,
  user: User,
  input: { displayName: string; workspaceName?: string }
) => {
  const displayName = input.displayName.trim();
  const workspaceName = input.workspaceName?.trim() || null;

  const { data, error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        display_name: displayName,
        workspace_name: workspaceName,
      },
      { onConflict: 'id' }
    )
    .select('*')
    .maybeSingle();

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      display_name: displayName,
      name: displayName,
      workspace_name: workspaceName,
    },
  });

  if (!metadataError) {
    await supabase.auth.refreshSession();
  }

  return {
    profile: data,
    profileError: profileError?.message ?? null,
    metadataError: metadataError?.message ?? null,
  };
};
