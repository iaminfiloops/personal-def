// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Supabase client configuration following industry best practices:
 * 1. Use direct URL and key values to avoid runtime errors in browser environments
 * 2. Add proper TypeScript typing for better developer experience
 * 3. Configure auth options for security and user experience
 */

// Supabase connection details
const SUPABASE_URL = 'https://uiwfzpexouutempclndu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd2Z6cGV4b3V1dGVtcGNsbmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTYyMTQsImV4cCI6MjA2MjE3MjIxNH0.OnS2Em3YSwdYemqYA8sx-18-smptLH6H7q8gjfomjaA';

/**
 * Import the supabase client like this:
 * import { supabase } from "@/integrations/supabase/client";
 */

// Create a single, type-safe Supabase client instance
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});