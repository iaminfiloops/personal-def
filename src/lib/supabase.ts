
import { createClient } from '@supabase/supabase-js';

/**
 * Initialize Supabase client using environment variables
 * In Next.js, environment variables prefixed with NEXT_PUBLIC_ are available in the browser
 *
 * Industry best practice:
 * 1. Use environment variables when possible
 * 2. Fall back to hardcoded values only as a last resort
 * 3. Keep the client creation in a separate module for easy maintenance
 */
const supabaseUrl = 'https://uiwfzpexouutempclndu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd2Z6cGV4b3V1dGVtcGNsbmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTYyMTQsImV4cCI6MjA2MjE3MjIxNH0.OnS2Em3YSwdYemqYA8sx-18-smptLH6H7q8gjfomjaA';

// Create a single instance of the Supabase client to be used throughout the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// User types
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'user';
};

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
};
