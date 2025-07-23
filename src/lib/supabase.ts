import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (updated to match actual schema)
export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          sport: string;
          logo_url?: string;
          description?: string;
          gradient: string;
          captain_id?: string;
          founded?: number;
          wins?: number;
          losses?: number;
          motto?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sport: string;
          logo_url?: string;
          description?: string;
          gradient: string;
          captain_id?: string;
          founded?: number;
          wins?: number;
          losses?: number;
          motto?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sport?: string;
          logo_url?: string;
          description?: string;
          gradient?: string;
          captain_id?: string;
          founded?: number;
          wins?: number;
          losses?: number;
          motto?: string;
          updated_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          position?: string;
          jersey_number?: number;
          photo_url?: string;
          bio?: string;
          quote?: string;
          sport_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          position?: string;
          jersey_number?: number;
          photo_url?: string;
          bio?: string;
          quote?: string;
          sport_type: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          name?: string;
          position?: string;
          jersey_number?: number;
          photo_url?: string;
          bio?: string;
          quote?: string;
          sport_type?: string;
          updated_at?: string;
        };
      };
      games: {
        Row: {
          id: string;
          home_team_id: string;
          away_team_id: string;
          location_id: string;
          scheduled_at: string;
          game_time: string;
          status:
            | "scheduled"
            | "in-progress"
            | "completed"
            | "cancelled"
            | "postponed";
          home_score?: number;
          away_score?: number;
          sport_type: string;
          week_number?: number;
          season?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          home_team_id: string;
          away_team_id: string;
          location_id: string;
          scheduled_at: string;
          game_time: string;
          status?:
            | "scheduled"
            | "in-progress"
            | "completed"
            | "cancelled"
            | "postponed";
          home_score?: number;
          away_score?: number;
          sport_type: string;
          week_number?: number;
          season?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          home_team_id?: string;
          away_team_id?: string;
          location_id?: string;
          scheduled_at?: string;
          game_time?: string;
          status?:
            | "scheduled"
            | "in-progress"
            | "completed"
            | "cancelled"
            | "postponed";
          home_score?: number;
          away_score?: number;
          sport_type?: string;
          week_number?: number;
          season?: string;
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          latitude?: number;
          longitude?: number;
          facilities?: string[];
          field_type: string;
          capacity?: number;
          parking: boolean;
          restrooms: boolean;
          concessions: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          latitude?: number;
          longitude?: number;
          facilities?: string[];
          field_type: string;
          capacity?: number;
          parking?: boolean;
          restrooms?: boolean;
          concessions?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          latitude?: number;
          longitude?: number;
          facilities?: string[];
          field_type?: string;
          capacity?: number;
          parking?: boolean;
          restrooms?: boolean;
          concessions?: boolean;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          priority: "low" | "normal" | "high" | "urgent";
          type: "general" | "game" | "registration" | "maintenance" | "event";
          target_audience:
            | "all"
            | "players"
            | "teams"
            | "kickball"
            | "dodgeball";
          is_active: boolean;
          expires_at?: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          priority?: "low" | "normal" | "high" | "urgent";
          type?: "general" | "game" | "registration" | "maintenance" | "event";
          target_audience?:
            | "all"
            | "players"
            | "teams"
            | "kickball"
            | "dodgeball";
          is_active?: boolean;
          expires_at?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          priority?: "low" | "normal" | "high" | "urgent";
          type?: "general" | "game" | "registration" | "maintenance" | "event";
          target_audience?:
            | "all"
            | "players"
            | "teams"
            | "kickball"
            | "dodgeball";
          is_active?: boolean;
          expires_at?: string;
          created_by?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          type: string;
          category: string;
          description?: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          type?: string;
          category?: string;
          description?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          type?: string;
          category?: string;
          description?: string;
          is_public?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
      };
      league_info: {
        Row: {
          id: string;
          mission: string;
          history: string;
          founded_year: number;
          member_count: number;
          seasons_completed: number;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          mission: string;
          history: string;
          founded_year?: number;
          member_count?: number;
          seasons_completed?: number;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          mission?: string;
          history?: string;
          founded_year?: number;
          member_count?: number;
          seasons_completed?: number;
          updated_at?: string;
          updated_by?: string;
        };
      };
      contact_info: {
        Row: {
          id: string;
          email: string;
          phone: string;
          address_street: string;
          address_city: string;
          address_state: string;
          address_zip: string;
          office_hours_weekdays: string;
          office_hours_weekends: string;
          facebook_url?: string;
          instagram_url?: string;
          twitter_url?: string;
          discord_url?: string;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone: string;
          address_street: string;
          address_city: string;
          address_state: string;
          address_zip: string;
          office_hours_weekdays?: string;
          office_hours_weekends?: string;
          facebook_url?: string;
          instagram_url?: string;
          twitter_url?: string;
          discord_url?: string;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string;
          address_street?: string;
          address_city?: string;
          address_state?: string;
          address_zip?: string;
          office_hours_weekdays?: string;
          office_hours_weekends?: string;
          facebook_url?: string;
          instagram_url?: string;
          twitter_url?: string;
          discord_url?: string;
          updated_at?: string;
          updated_by?: string;
        };
      };
      core_values: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
      };
      leadership_team: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string;
          email?: string;
          joined_year: number;
          avatar_url?: string;
          specialties: string[];
          favorite_quote?: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          bio: string;
          email?: string;
          joined_year?: number;
          avatar_url?: string;
          specialties?: string[];
          favorite_quote?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          bio?: string;
          email?: string;
          joined_year?: number;
          avatar_url?: string;
          specialties?: string[];
          favorite_quote?: string;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          member_name: string;
          role: string;
          quote: string;
          avatar_url?: string;
          team_name?: string;
          sport_type?: string;
          member_since?: number;
          location: string;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          member_name: string;
          role: string;
          quote: string;
          avatar_url?: string;
          team_name?: string;
          sport_type?: string;
          member_since?: number;
          location?: string;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          member_name?: string;
          role?: string;
          quote?: string;
          avatar_url?: string;
          team_name?: string;
          sport_type?: string;
          member_since?: number;
          location?: string;
          is_featured?: boolean;
          is_active?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          priority: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string;
          priority?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          category?: string;
          priority?: number;
          is_active?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
      };
      timeline_milestones: {
        Row: {
          id: string;
          year: number;
          month?: string;
          title: string;
          description: string;
          type: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          year: number;
          month?: string;
          title: string;
          description: string;
          type?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          year?: number;
          month?: string;
          title?: string;
          description?: string;
          type?: string;
          is_active?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
      };
      sports_info: {
        Row: {
          id: string;
          name: string;
          title: string;
          description: string;
          gradient: string;
          participants: number;
          next_game?: string;
          features: string[];
          total_teams: number;
          roster_path?: string;
          coming_soon: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          name: string;
          title: string;
          description: string;
          gradient?: string;
          participants?: number;
          next_game?: string;
          features?: string[];
          total_teams?: number;
          roster_path?: string;
          coming_soon?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          description?: string;
          gradient?: string;
          participants?: number;
          next_game?: string;
          features?: string[];
          total_teams?: number;
          roster_path?: string;
          coming_soon?: boolean;
          is_active?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
      };
      about_features: {
        Row: {
          id: string;
          icon: string;
          title: string;
          description: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          icon: string;
          title: string;
          description: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          icon?: string;
          title?: string;
          description?: string;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
      };
      hero_content: {
        Row: {
          id: string;
          page: string;
          title: string;
          subtitle?: string;
          primary_cta_text?: string;
          primary_cta_action?: string;
          secondary_cta_text?: string;
          secondary_cta_action?: string;
          background_image_url?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          page: string;
          title: string;
          subtitle?: string;
          primary_cta_text?: string;
          primary_cta_action?: string;
          secondary_cta_text?: string;
          secondary_cta_action?: string;
          background_image_url?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          page?: string;
          title?: string;
          subtitle?: string;
          primary_cta_text?: string;
          primary_cta_action?: string;
          secondary_cta_text?: string;
          secondary_cta_action?: string;
          background_image_url?: string;
          is_active?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
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
  };
}

// Type the supabase client
export type SupabaseClient = typeof supabase;
