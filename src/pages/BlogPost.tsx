import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Clock, Facebook, Linkedin, Twitter, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

/**
 * Interface for BlogPost data structure
 */
interface BlogPost {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  readTime: string;
  content: string;
  category: string;
  date: string;
  status: string;
  author_id: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * BlogPost component displays a single blog post
 */
const BlogPost = () => {
  // Get blog post ID from URL parameters
  const { id } = useParams();
  
  // State management
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog post data on component mount
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
        setPost(data || null);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  // Social sharing handlers
  const handleTwitterShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || '');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  };

  return (
    <>
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Back to Blog Link */}
          <Link to="/blog" className="text-accent hover:text-accent/80 inline-flex items-center mb-8 animate-fade-in">
            <ArrowLeft size={16} className="mr-1" /> Back to Blog
          </Link>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-20 flex justify-center animate-pulse">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : post ? (
            // Blog Post Content
            <article className="max-w-3xl mx-auto animate-fade-in">
              {/* Post Header */}
              <div className="mb-8">
                <span className="chip bg-primary/10 text-primary mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-semibold mb-6">{post.title}</h1>

                {/* Post Metadata */}
                <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-8">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays size={14} className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image - Contained to specific dimensions */}
              <div className="mb-10 flex justify-center">
                <div className="max-w-3xl max-h-96 overflow-hidden rounded-xl">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Post Content - Using React Markdown */}
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Social Share Section */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-xl font-medium mb-4">Share this article</h3>
                <div className="flex space-x-4">
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={handleTwitterShare}>
                      <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
                    </Button>
                    <Button variant="outline" onClick={handleFacebookShare}>
                      <Facebook className="mr-2 h-4 w-4" /> Share on Facebook
                    </Button>
                    <Button variant="outline" onClick={handleLinkedInShare}>
                      <Linkedin className="mr-2 h-4 w-4" /> Share on LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            // Error State
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

export default BlogPost;