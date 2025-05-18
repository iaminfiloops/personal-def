import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Helmet } from 'react-helmet';
import { Search, Calendar, Clock, Share2, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { FounderInsight, InsightTag } from '@/components/FounderInsights';

const Insights = () => {
  const [insights, setInsights] = useState<FounderInsight[]>([]);
  const [tags, setTags] = useState<InsightTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInsights, setTotalInsights] = useState(0);
  const insightsPerPage = 9;

  // Function to calculate reading time
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Function to handle sharing
  const handleShare = (insight: FounderInsight) => {
    if (navigator.share) {
      navigator.share({
        title: insight.title,
        text: insight.summary,
        url: `${window.location.origin}/insights/${insight.slug}`,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/insights/${insight.slug}`)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.log('Error copying to clipboard:', error));
    }
  };

  // Fetch insights
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', insightsPerPage.toString());
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (selectedTag) {
          params.append('tag', selectedTag);
        }
        
        // Fetch insights
        const response = await fetch(`/api/insights?${params.toString()}`);
        const data = await response.json();
        
        if (data.insights) {
          setInsights(data.insights);
          setTotalPages(data.pagination.pages);
          setTotalInsights(data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [currentPage, searchQuery, selectedTag]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        
        if (data) {
          setTags(data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle tag selection
  const handleTagSelect = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagName);
    }
    setCurrentPage(1); // Reset to first page when changing tags
  };

  return (
    <>
      <Helmet>
        <title>Founder Insights - Pinky Paul Mondal</title>
        <meta
          name="description"
          content="Explore Pinky Paul Mondal's insights on social entrepreneurship, leadership, and creating sustainable impact."
        />
        <link rel="canonical" href="https://pinkypaulmondal.com/insights" />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Founder Insights</h1>
            <p className="text-xl text-muted-foreground">
              Thoughts, strategies, and lessons learned from my entrepreneurial journey
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search insights..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTag === tag.name ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Results count */}
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `Showing ${insights.length} of ${totalInsights} insights`}
              {selectedTag && ` tagged with "${selectedTag}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Insights Grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : insights.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {insights.map((insight) => (
                <Card key={insight.id} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
                  {insight.image_url && (
                    <div className="relative h-48">
                      <img
                        src={insight.image_url}
                        alt={insight.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {insight.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2">{insight.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {insight.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(insight.created_at), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{insight.reading_time || getReadingTime(insight.content)} min read</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button asChild variant="ghost" className="text-primary">
                      <Link to={`/insights/${insight.slug}`}>
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleShare(insight)}
                      title="Share this insight"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No insights found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedTag(null);
                setCurrentPage(1);
              }}>
                Clear filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Insights;
