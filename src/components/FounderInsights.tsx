import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, ArrowRight, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Types for founder insights
export interface InsightTag {
  id: string;
  name: string;
}

export interface FounderInsight {
  id: string;
  title: string;
  content: string;
  summary: string;
  image_url: string;
  slug: string;
  created_at: string;
  updated_at: string;
  tags: InsightTag[];
  reading_time?: number;
}

interface FounderInsightsProps {
  insights: FounderInsight[];
  featured?: FounderInsight;
}

export default function FounderInsights({ insights, featured }: FounderInsightsProps) {
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

  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Founder Insights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts, strategies, and lessons learned from my entrepreneurial journey
          </p>
        </div>

        {/* Featured Insight */}
        {featured && (
          <div className="mb-12">
            <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full">
                  {featured.image_url ? (
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary/50 text-lg">No image available</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-primary text-white hover:bg-primary/90">
                      Featured
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <CardHeader className="p-0 mb-4">
                      <div className="flex gap-2 mb-2">
                        {featured.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-2xl mb-2">{featured.title}</CardTitle>
                      <CardDescription className="text-base line-clamp-3">
                        {featured.summary}
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featured.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{featured.reading_time || getReadingTime(featured.content)} min read</span>
                      </div>
                    </div>
                    <CardFooter className="p-0 flex justify-between">
                      <Button asChild variant="default">
                        <Link to={`/insights/${featured.slug}`}>
                          Read More <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare(featured)}
                        title="Share this insight"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recent Insights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <Card key={insight.id} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 flex flex-col">
              <div className="relative h-48">
                {insight.image_url ? (
                  <img
                    src={insight.image_url}
                    alt={insight.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary/50 text-lg">No image available</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex gap-2 mb-2">
                  {insight.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2">{insight.title}</CardTitle>
                <CardDescription className="line-clamp-2">
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

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link to="/insights">
              View All Insights <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
