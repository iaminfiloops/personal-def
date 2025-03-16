import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import DashboardStats from "@/components/admin/DashboardStats";
import QuickActions from "@/components/admin/QuickActions";
import RecentActivity from "@/components/admin/RecentActivity";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogPosts: 0,
    companies: 0,
    messages: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        
        // Get blog posts count
        const { count: blogCount, error: blogError } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });
        
        if (blogError) throw blogError;
        
        // Get companies count
        const { count: companiesCount, error: companiesError } = await supabase
          .from('portfolio_companies')
          .select('*', { count: 'exact', head: true });
        
        if (companiesError) throw companiesError;
        
        // Get messages count
        const { count: messagesCount, error: messagesError } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });
        
        if (messagesError) throw messagesError;
        
        setStats({
          blogPosts: blogCount || 0,
          companies: companiesCount || 0,
          messages: messagesCount || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast({
          title: "Error loading dashboard data",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.name || user?.email}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0"
              onClick={handleLogout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <DashboardStats 
            blogPosts={stats.blogPosts} 
            companies={stats.companies} 
            messages={stats.messages}
            isLoading={isLoadingStats}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
