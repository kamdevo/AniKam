import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔧 Supabase Config:", {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "❌ MISSING",
  keyLength: supabaseAnonKey ? `${supabaseAnonKey.length} chars` : "❌ MISSING"
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables missing!");
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce', // More secure authentication flow
    debug: true, // Enable debug mode for OAuth troubleshooting
  },
});

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          email: string;
          avatar_url: string | null;
          banner_url: string | null;
          bio: string | null;
          content_filter: 'all' | 'safe' | 'mature';
          theme_preference: 'light' | 'dark' | 'auto';
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          email: string;
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          content_filter?: 'all' | 'safe' | 'mature';
          theme_preference?: 'light' | 'dark' | 'auto';
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          email?: string;
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          content_filter?: 'all' | 'safe' | 'mature';
          theme_preference?: 'light' | 'dark' | 'auto';
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
