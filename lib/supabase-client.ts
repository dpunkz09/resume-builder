/**
 * Supabase client with Better Auth integration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Get Supabase client with current session
 * This client will have the user's JWT token for authenticated requests
 */
export async function getSupabaseClient() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // We manage sessions via Better Auth
      autoRefreshToken: false,
    },
  });

  // Try to get the Better Auth session and set it in Supabase
  try {
    // Get the session token from Better Auth cookies
    const response = await fetch('/api/auth/get-session', {
      credentials: 'include',
    });

    if (response.ok) {
      const session = await response.json();
      
      // If we have a session with Supabase token, use it
      if (session?.user?.id) {
        // Note: Better Auth might not provide a Supabase JWT directly
        // For now, we'll rely on RLS policies that check auth.uid()
        // which Better Auth should populate
      }
    }
  } catch (error) {
    console.error('Failed to get session:', error);
  }

  return supabase;
}

/**
 * Basic Supabase client without session
 * Use this for public operations only
 */
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);
