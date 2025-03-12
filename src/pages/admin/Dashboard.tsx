
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EditIcon, FileTextIcon, BriefcaseIcon, LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

// This will be replaced with Supabase authentication logic later
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    blogPosts: 0,
    companies: 0,
    messages: 0
  });

  useEffect(() => {
    // Simulate authentication check and data loading
    const checkAuth = async () => {
      try {
        // This would be replaced with actual Supabase auth check
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsAuthenticated(true);
        setStats({
          blogPosts: 3,
          companies: 3,
          messages: 5
        });
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication Error",
          description: "Please log in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    // This would be replaced with actual Supabase auth signOut
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // In real implementation, we would redirect to login page
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Please sign in to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-accent hover:bg-accent/90 text-white">
              Login with Supabase
            </Button>
          </CardContent>
        </Card>
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
                Manage your website content here.
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{stats.blogPosts}</div>
                <p className="text-muted-foreground text-sm mb-4">
                  Published articles on your blog
                </p>
                <Button asChild className="w-full">
                  <Link to="/admin/blog">
                    <EditIcon className="mr-2 h-4 w-4" />
                    Manage Posts
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Portfolio Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{stats.companies}</div>
                <p className="text-muted-foreground text-sm mb-4">
                  Companies in your portfolio
                </p>
                <Button asChild className="w-full">
                  <Link to="/admin/portfolio">
                    <BriefcaseIcon className="mr-2 h-4 w-4" />
                    Manage Companies
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{stats.messages}</div>
                <p className="text-muted-foreground text-sm mb-4">
                  Unread messages from visitors
                </p>
                <Button asChild className="w-full">
                  <Link to="/admin/messages">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    View Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link to="/admin/blog/new">
                    Create New Blog Post
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/admin/portfolio/new">
                    Add New Company
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/profile">
                    Edit Profile Information
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Blog post updated:</span> "The Future of Social Entrepreneurship" - 2 days ago
                  </li>
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">New company added:</span> "HealthBridge" - 1 week ago
                  </li>
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Profile information updated</span> - 2 weeks ago
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
