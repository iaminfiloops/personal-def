/**
 * Supabase Helper Functions
 * 
 * This file contains helper functions for common Supabase operations.
 * Following industry best practices for authentication and data handling.
 */

import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

/**
 * Sign up a new user
 * @param email User's email
 * @param password User's password
 * @param metadata Optional user metadata
 * @returns The newly created user or null if there was an error
 */
export async function signUpUser(
  email: string, 
  password: string, 
  metadata?: { [key: string]: any }
): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      console.error('Error signing up:', error.message);
      return null;
    }

    return data.user;
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    return null;
  }
}

/**
 * Sign in a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns The user session or null if there was an error
 */
export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error.message);
      return null;
    }

    return data.session;
  } catch (err) {
    console.error('Unexpected error during signin:', err);
    return null;
  }
}

/**
 * Sign out the current user
 * @returns true if successful, false otherwise
 */
export async function signOutUser(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error during signout:', err);
    return false;
  }
}

/**
 * Get the current user
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error.message);
      return null;
    }
    
    return data.user;
  } catch (err) {
    console.error('Unexpected error getting current user:', err);
    return null;
  }
}

/**
 * Check if a user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication:', error.message);
      return false;
    }
    
    return data.session !== null;
  } catch (err) {
    console.error('Unexpected error checking authentication:', err);
    return false;
  }
}

/**
 * Reset password for a user
 * @param email User's email
 * @returns true if successful, false otherwise
 */
export async function resetPassword(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Error resetting password:', error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error resetting password:', err);
    return false;
  }
}

/**
 * Update user profile
 * @param userId User ID
 * @param profileData Profile data to update
 * @returns true if successful, false otherwise
 */
export async function updateUserProfile(
  userId: string, 
  profileData: { [key: string]: any }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error updating profile:', err);
    return false;
  }
}
