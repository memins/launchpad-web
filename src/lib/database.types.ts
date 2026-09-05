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

export type SubscriptionRow = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: string;
  plan_name: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type SubscriptionInsert = {
  id?: string;
  user_id: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  status?: string;
  plan_name?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SubscriptionUpdate = Partial<SubscriptionInsert>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      subscriptions: {
        Row: SubscriptionRow;
        Insert: SubscriptionInsert;
        Update: SubscriptionUpdate;
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
