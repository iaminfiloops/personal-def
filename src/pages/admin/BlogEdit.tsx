
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PlusIcon, Pencil, Trash2, ArrowLeft, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Sample blog posts data
const initialBlogPosts = [
  {
    id: 1,
    title: "The Future of Social Entrepreneurship",
    category: "Entrepreneurship",
    date: "May 12, 2023",
    status: "Published"
  },
  {
    id: 2,
    title: "Impact Investing: Beyond Financial Returns",
    category: "Investment",
    date: "April 28, 2023",
    status: "Published"
  },
  {
    id: 3,
    title: "Building Resilient Communities Through Business",
    category: "Social Impact",
    date: "March 15, 2023",
    status: "Published"
  },
  {
    id: 4,
    title: "Sustainable Business Models for the Future",
    category: "Sustainability",
    date: "June 3, 2023",
    status: "Draft"
  }
];

const AdminBlogEdit = () => {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePost = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogPosts(blogPosts.filter(post => post.id !== id));
      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
    }
  };

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
                          <TableCell>{post.date}</TableCell>
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
                              asChild
                            >
                              <Link to={`/admin/blog/edit/${post.id}`}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
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
                          No blog posts found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
