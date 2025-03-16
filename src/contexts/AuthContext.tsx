
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, UserProfile } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log("User authenticated:", session.user.email);
      }
      
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Supabase auth event: ${event}`);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log("Auth state changed. User authenticated:", session.user.email);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        console.log("Fetching profile for user:", user.email);
        
        // For now, we'll create a temporary profile since we don't have a profiles table yet
        // In production, you would fetch this from a profiles table
        const tempProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          name: user.email?.split('@')[0] || 'User',
          role: 'admin' // For testing purposes, set all authenticated users as admins
        };
        
        console.log("Created temp profile with role:", tempProfile.role);
        setProfile(tempProfile);
        
        // Uncomment and modify when you have a profiles table
        // const { data, error } = await supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('id', user.id)
        //   .single();
        //
        // if (error) {
        //   console.error('Error fetching profile:', error);
        //   return;
        // }
        //
        // setProfile(data as UserProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with email:", email);
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error.message);
        toast({
          title: 'Error signing in',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      console.log("Sign in successful");
      toast({
        title: 'Signed in successfully',
        description: 'Welcome back!',
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        toast({
          title: 'Error signing out',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      console.log("Sign out successful");
      toast({
        title: 'Signed out successfully',
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      isLoading,
      isAdmin,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
