/**
 * Minimal generated-style types for the tables this kit ships.
 * Replace with `supabase gen types typescript --project-id <ref>` once you add more tables.
 */
export type ProfileRow = {
  id: string;
  display_name: string | null;
  workspace_name: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = {
  id: string;
  display_name?: string | null;
  workspace_name?: string | null;
  onboarding_completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<ProfileInsert>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
