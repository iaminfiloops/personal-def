import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ExternalLink, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Portfolio {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  logo_url?: string;
  status: string;
  type: string;
  year: number;
  // Additional fields needed for rendering
  location?: string;
  website?: string;
  team?: number;
  impact?: string[];
  longDescription?: string;
}

const PortfolioDetail = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('portfolio_companies')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setPortfolio(data);
      } catch (err) {
        setError('Failed to load portfolio data');
        console.error('Error fetching portfolio:', err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPortfolio();
  }, [id]);

  return (
    <>
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/portfolio" className="text-accent hover:text-accent/80 inline-flex items-center mb-8 animate-fade-in">
            <ArrowLeft size={16} className="mr-1" /> Back to Portfolio
          </Link>
          
          {isLoading ? (
            <div className="py-20 flex justify-center animate-pulse">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : portfolio ? (
            <div className="animate-fade-in">
              <div className="mb-12 relative rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96">
                <img 
                  src={portfolio.logo_url || "/placeholder-cover.jpg"} 
                  alt={portfolio.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-10 flex items-end">
                  <div className="mr-6 w-20 h-20 bg-card rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-border">
                    <img 
                      src={portfolio.logo_url || "/placeholder-logo.jpg"} 
                      alt={`${portfolio.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="chip bg-primary/10 text-primary mb-2">
                      {portfolio.type}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                      {portfolio.name}
                    </h1>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80"
                    dangerouslySetInnerHTML={{ __html: portfolio.longDescription || portfolio.description }}
                  />
                </div>
                
                <div className="space-y-8">
                  <div className="glass-panel p-6 rounded-xl">
                    <h2 className="text-xl font-medium mb-4">Company Info</h2>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <Calendar size={18} className="mr-3 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Founded</p>
                          <p className="font-medium">{portfolio.year}</p>
                        </div>
                      </li>
                      {portfolio.team && (
                        <li className="flex items-start">
                          <Users size={18} className="mr-3 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Team Size</p>
                            <p className="font-medium">{portfolio.team} employees</p>
                          </div>
                        </li>
                      )}
                      {portfolio.location && (
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-0.5 text-muted-foreground">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{portfolio.location}</p>
                          </div>
                        </li>
                      )}
                      {portfolio.website && (
                        <li className="flex items-start">
                          <ExternalLink size={18} className="mr-3 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Website</p>
                            <a 
                              href={portfolio.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-accent hover:text-accent/80"
                            >
                              Visit Website
                            </a>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {portfolio.impact && portfolio.impact.length > 0 && (
                    <div className="glass-panel p-6 rounded-xl">
                      <h2 className="text-xl font-medium mb-4">Impact Metrics</h2>
                      <ul className="space-y-2">
                        {portfolio.impact.map((item: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-accent mr-3"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-3">
                    {portfolio.website && (
                      <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white">
                        <a href={portfolio.website} target="_blank" rel="noopener noreferrer">
                          Visit Company Website
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/contact">
                        Contact About This Company
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-medium mb-4">Company not found</h2>
              <p className="text-muted-foreground mb-6">The company you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link to="/portfolio">Back to All Companies</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PortfolioDetail;