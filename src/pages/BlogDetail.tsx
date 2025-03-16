import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  category: string;
  date: string;
  status: string;
  author_id: string;
  image_url?: string;
  images?: Array<{id: string; url: string; alt: string; title: string}>;
}

const BlogDetail = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setPost(data);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBlogPost();
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/blog" className="text-accent hover:text-accent/80 inline-flex items-center mb-8 animate-fade-in">
            <ArrowLeft size={16} className="mr-1" /> Back to Blog
          </Link>
          
          {isLoading ? (
            <div className="py-20 flex justify-center animate-pulse">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : post ? (
            <div className="animate-fade-in">
              <article className="max-w-4xl mx-auto">
                <header className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(post.date)}
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                    {post.title}
                  </h1>
                </header>
                
                {/* Main Featured Image */}
                {post.image_url && (
                  <div className="mb-10 rounded-xl overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                {/* Blog Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80 mb-10"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Gallery Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {post.images.map((image) => (
                        <div key={image.id} className="rounded-lg overflow-hidden h-64 shadow-md">
                          <img 
                            src={image.url} 
                            alt={image.alt || post.title} 
                            title={image.title || post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Share and Navigation */}
                <div className="border-t border-border pt-8 mt-12">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                    <Button asChild variant="outline">
                      <Link to="/blog">
                        Back to All Posts
                      </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Share:</span>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-medium mb-4">Blog post not found</h2>
              <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link to="/blog">Back to All Posts</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogDetail;
