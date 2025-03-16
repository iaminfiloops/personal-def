import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AnimatedCard from "./ui/AnimatedCard";
import { CalendarDays, Clock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}

const BlogPreview = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('date', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        setBlogPosts(data || []);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 animate-fade-in">
          <div>
            <span className="chip bg-secondary text-foreground mb-3">Blog</span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Latest Insights</h2>
            <p className="text-muted-foreground max-w-xl">
              Thoughts, perspectives, and lessons learned from the intersection of social work and entrepreneurship.
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-6 md:mt-0 text-accent hover:text-accent/80 font-medium transition-colors group flex items-center"
          >
            View All Posts <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <AnimatedCard
                key={post.id}
                hoverEffect="lift"
                className="h-full border border-border/50 opacity-0 animate-fade-in"
                style={{ 
                  animationDelay: `${0.2 * (index + 1)}s`, 
                  animationFillMode: 'forwards' 
                }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    title={post.title}
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="chip bg-primary/10 text-primary">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    <Link 
                      to={`/blog/${post.id}`}
                      className="hover:text-accent transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-4">
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
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
