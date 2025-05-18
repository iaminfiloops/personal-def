import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, Share2, ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import { FounderInsight } from '@/components/FounderInsights';
import { Separator } from '@/components/ui/separator';

const InsightDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [insight, setInsight] = useState<FounderInsight | null>(null);
  const [relatedInsights, setRelatedInsights] = useState<FounderInsight[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to calculate reading time
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Function to handle sharing
  const handleShare = (platform?: string) => {
    if (!insight) return;
    
    const url = window.location.href;
    const title = insight.title;
    const text = insight.summary;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title,
            text,
            url,
          }).catch((error) => console.log('Error sharing:', error));
        } else {
          // Fallback for browsers that don't support the Web Share API
          navigator.clipboard.writeText(url)
            .then(() => alert('Link copied to clipboard!'))
            .catch((error) => console.log('Error copying to clipboard:', error));
        }
    }
  };

  // Fetch insight
  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      try {
        if (!slug) return;
        
        const response = await fetch(`/api/insights?slug=${slug}`);
        const data = await response.json();
        
        if (data) {
          setInsight(data);
          
          // Fetch related insights based on tags
          if (data.tags && data.tags.length > 0) {
            const tagNames = data.tags.map((tag: any) => tag.name);
            const relatedResponse = await fetch(`/api/insights?tag=${tagNames[0]}&limit=3`);
            const relatedData = await relatedResponse.json();
            
            if (relatedData.insights) {
              // Filter out the current insight
              const filtered = relatedData.insights.filter((item: FounderInsight) => item.id !== data.id);
              setRelatedInsights(filtered.slice(0, 3));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching insight:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!insight) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Insight Not Found</h1>
            <p className="text-muted-foreground mb-6">The insight you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/insights">Back to Insights</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{insight.title} - Pinky Paul Mondal</title>
        <meta name="description" content={insight.summary} />
        <meta property="og:title" content={insight.title} />
        <meta property="og:description" content={insight.summary} />
        {insight.image_url && <meta property="og:image" content={insight.image_url} />}
        <link rel="canonical" href={`https://pinkypaulmondal.com/insights/${insight.slug}`} />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4">
          {/* Back button */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="group">
              <Link to="/insights" className="flex items-center">
                <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Insights
              </Link>
            </Button>
          </div>

          {/* Article header */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex gap-2 mb-4 flex-wrap">
              {insight.tags?.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{insight.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(insight.created_at), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{insight.reading_time || getReadingTime(insight.content)} min read</span>
              </div>
            </div>
            
            {insight.image_url && (
              <div className="rounded-lg overflow-hidden mb-8">
                <img
                  src={insight.image_url}
                  alt={insight.title}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Article content */}
          <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert mb-12">
            <div dangerouslySetInnerHTML={{ __html: insight.content }} />
          </div>

          {/* Share section */}
          <div className="max-w-3xl mx-auto mb-12">
            <Separator className="mb-6" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-medium">Share this insight:</p>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} title="Share on Facebook">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} title="Share on Twitter">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')} title="Share on LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShare()} title="Copy link">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Related insights */}
          {relatedInsights.length > 0 && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Related Insights</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {relatedInsights.map((relatedInsight) => (
                  <Card key={relatedInsight.id} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300">
                    {relatedInsight.image_url && (
                      <div className="h-40">
                        <img
                          src={relatedInsight.image_url}
                          alt={relatedInsight.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2">{relatedInsight.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{relatedInsight.summary}</p>
                      <Button asChild variant="ghost" className="text-primary p-0 h-auto">
                        <Link to={`/insights/${relatedInsight.slug}`}>
                          Read More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
};

export default InsightDetail;
