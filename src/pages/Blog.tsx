import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Helmet } from 'react-helmet';
import { WebPageStructuredData } from "@/components/SEO/StructuredData";
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  featured: boolean;
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setBlogPosts(data || []);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Categories for filtering
  const categories = ["All", ...new Set(blogPosts.map(post => post.category))];

  // Filter blog posts based on search query and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);
console.log(blogPosts)
  // Create a list of categories for SEO keywords
  const categoryKeywords = categories
    .filter(category => category !== "All")
    .join(", ").toLowerCase();

  return (
    <>
      <Helmet>
        <title>Blog | Ajitesh Mondal - Social Entrepreneur and Education Innovator</title>
        <meta
          name="description"
          content="Explore Ajitesh Mondal's insights on social entrepreneurship, education innovation, and creating sustainable change through scholarships and mentoring programs."
        />
        <meta
          name="keywords"
          content={`Ajitesh Mondal, blog, social entrepreneurship, education innovation, ${categoryKeywords}`}
        />
        <link rel="canonical" href="https://ajiteshmondal.com/blog" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Blog | Ajitesh Mondal - Social Entrepreneur and Education Innovator" />
        <meta property="og:description" content="Insights on social entrepreneurship, education innovation, and creating sustainable change." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ajiteshmondal.com/blog" />
        {featuredPosts.length > 0 && featuredPosts[0].image_url && (
          <meta property="og:image" content={featuredPosts[0].image_url} />
        )}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Ajitesh Mondal" />
        <meta name="twitter:description" content="Insights on social entrepreneurship and education innovation." />
        {featuredPosts.length > 0 && featuredPosts[0].image_url && (
          <meta name="twitter:image" content={featuredPosts[0].image_url} />
        )}
      </Helmet>

      <WebPageStructuredData
        title="Blog | Ajitesh Mondal - Social Entrepreneur and Education Innovator"
        description="Explore Ajitesh Mondal's insights on social entrepreneurship, education innovation, and creating sustainable change."
        url="https://ajiteshmondal.com/blog"
        image={featuredPosts.length > 0 ? featuredPosts[0].image_url : undefined}
        dateModified={new Date().toISOString()}
      />

      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background -z-10" />

          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="chip bg-secondary text-foreground mb-3">Blog</span>
              <h1 className="text-4xl md:text-5xl font-semibold mb-6">Insights & Perspectives</h1>
              <p className="text-xl text-muted-foreground">
                Thoughts on social entrepreneurship, impact investing, and creating sustainable change.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map(post => (
                  <AnimatedCard
                    key={post.id}
                    hoverEffect="lift"
                    className="h-full flex flex-col md:flex-row border border-border/50 overflow-hidden"
                  >
                    <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                      <img
                        src={post.image_url || '/placeholder-blog.jpg'}
                        alt={post.title}
                        title={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                        width="600"
                        height="400"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-blog.jpg';
                          console.error("Image failed to load:", post.image_url);
                        }}
                      />
                    </div>
                    <div className="md:w-3/5 p-6 flex flex-col">
                      <div className="mb-3">
                        <Badge className="bg-accent text-white">
                          {post.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-medium mb-2">
                        <Link
                          to={`/blog/${post.id}`}
                          className="hover:text-accent transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-auto">
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
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="py-8 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="glass-panel p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge
                        key={category}
                        variant={categoryFilter === category ? "default" : "outline"}
                        className={`cursor-pointer ${
                          categoryFilter === category
                            ? "bg-accent hover:bg-accent/90 text-white"
                            : "hover:bg-accent/10"
                        }`}
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <AnimatedCard
                  key={post.id}
                  hoverEffect="lift"
                  className="h-full border border-border/50"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image_url || '/placeholder-blog.jpg'}
                      alt={post.title}
                      title={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                      width="400"
                      height="300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-blog.jpg';
                        console.error("Image failed to load:", post.image_url);
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-3">
                      <Badge className="bg-accent/10 text-accent">
                        {post.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      <Link
                        to={`/blog/${post.id}`}
                        className="hover:text-accent transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-auto pt-4 border-t border-border">
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

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-b from-white to-secondary/20">
          <div className="container mx-auto px-6">
            <div className="glass-panel p-12 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">
                Subscribe to My Newsletter
              </h2>
              <p className="text-muted-foreground mb-6">
                Get my latest insights on social entrepreneurship and impact investing delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="rounded-full"
                />
                <button
                  type="button"
                  className="rounded-full bg-accent hover:bg-accent/90 text-white px-6 py-2 font-medium transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                I respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
