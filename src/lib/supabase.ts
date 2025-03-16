
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://nhvdajjzfysdqbqrmkae.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmRhamp6ZnlzZHFicXJta2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMzQyNjEsImV4cCI6MjA0OTkxMDI2MX0.t4YqHKkKulYbF7y4-H85jo6y7bGgJAtCOhsy5gf7joE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// You can add more auth functions as needed
