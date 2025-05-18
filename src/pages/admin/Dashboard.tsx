import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import QuickActions from "@/components/admin/QuickActions";
import RecentActivity from "@/components/admin/RecentActivity";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    blogPosts: 0,
    companies: 0,
    messages: 0,
    insights: 0
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

        // Get insights count
        const { count: insightsCount, error: insightsError } = await supabase
          .from('founder_insights')
          .select('*', { count: 'exact', head: true });

        if (insightsError) throw insightsError;

        setStats({
          blogPosts: blogCount || 0,
          companies: companiesCount || 0,
          messages: messagesCount || 0,
          insights: insightsCount || 0
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

  return (
    <AdminLayout>
      <DashboardStats
        blogPosts={stats.blogPosts}
        companies={stats.companies}
        messages={stats.messages}
        insights={stats.insights}
        isLoading={isLoadingStats}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivity />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
