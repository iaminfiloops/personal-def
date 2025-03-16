
import { Link } from "react-router-dom";
import AnimatedCard from "./ui/AnimatedCard";
import { CalendarDays, Clock, User } from "lucide-react";

// Sample data for blog posts
const blogPosts = [
  {
    id: "1",
    title: "The Future of Social Entrepreneurship",
    excerpt: "How emerging technologies are reshaping the landscape of social impact ventures.",
    image: "https://via.placeholder.com/800x500",
    category: "Entrepreneurship",
    date: "May 12, 2023",
    readTime: "5 min read",
    author: "Emily Chen",
  },
  {
    id: "2",
    title: "Impact Investing: Beyond Financial Returns",
    excerpt: "Exploring the dual-purpose investment strategies that generate both social and financial value.",
    image: "https://via.placeholder.com/800x500",
    category: "Investment",
    date: "April 28, 2023",
    readTime: "7 min read",
    author: "Emily Chen",
  },
  {
    id: "3",
    title: "Building Resilient Communities Through Business",
    excerpt: "Case studies of social enterprises that have strengthened local economies after crises.",
    image: "https://via.placeholder.com/800x500",
    category: "Social Impact",
    date: "March 15, 2023",
    readTime: "6 min read",
    author: "Emily Chen",
  },
];

const BlogPreview = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <AnimatedCard
              key={post.id}
              hoverEffect="lift"
              className="h-full border border-border/50 opacity-0 animate-fade-in"
              style={{ animationDelay: `${0.2 * (index + 1)}s`, animationFillMode: 'forwards' }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
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
      </div>
    </section>
  );
};

export default BlogPreview;
