
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PlusIcon, Pencil, Trash2, ArrowLeft, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define the shape of a blog post
interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  status: string;
  content?: string;
  author_id?: string;
}

const AdminBlogEdit = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch blog posts from Supabase
  const { data: blogPosts = [], isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      console.log("Fetching blog posts from Supabase");
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }
      
      console.log("Fetched blog posts:", data);
      return data as BlogPost[];
    }
  });

  // Delete blog post mutation
  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting blog post with ID:", id);
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting blog post:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the blog posts query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Delete blog post error:', error);
      toast({
        title: 'Error deleting blog post',
        description: 'There was an error deleting the blog post. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Filter blog posts based on search query
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogPostMutation.mutate(id);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (error) {
    console.error("Error loading blog posts:", error);
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700">Error loading blog posts. Please try refreshing the page.</p>
            </div>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <Link to="/admin" className="text-accent hover:text-accent/80 inline-flex items-center mb-4">
              <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-semibold mb-2">Manage Blog Posts</h1>
                <p className="text-muted-foreground">
                  Create, edit and delete your blog posts.
                </p>
              </div>
              
              <Button asChild className="bg-accent hover:bg-accent/90 text-white">
                <Link to="/admin/blog/new">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Blog Post
                </Link>
              </Button>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search blog posts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-20 flex justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>{post.category}</TableCell>
                            <TableCell>{formatDate(post.date)}</TableCell>
                            <TableCell>
                              <span 
                                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  post.status === "Published" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {post.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            {searchQuery ? "No matching blog posts found." : "No blog posts found. Add your first post."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminBlogEdit;
