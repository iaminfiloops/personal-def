import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AnimatedCard from "./ui/AnimatedCard";
import { supabase } from "@/lib/supabase";

interface Company {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  type: string;
  year: number;
}

const FeaturedCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_companies')
          .select('*')
          .order('year', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        setCompanies(data || []);
      } catch (err) {
        setError('Failed to load portfolio data');
        console.error('Error fetching companies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 animate-fade-in">
          <div>
            <span className="chip bg-secondary text-foreground mb-3">Portfolio</span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Featured Companies</h2>
            <p className="text-muted-foreground max-w-xl">
              A selection of social enterprises I've founded, invested in, or advised over the years.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="mt-6 md:mt-0 text-accent hover:text-accent/80 font-medium transition-colors group flex items-center"
          >
            View All Companies <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
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
            {companies.map((company, index) => (
              <AnimatedCard
                key={company.id}
                hoverEffect="lift"
                glareEffect={true}
                className="h-full border border-border/50 opacity-0 animate-fade-in"
                style={{ 
                  animationDelay: `${0.2 * (index + 1)}s`, 
                  animationFillMode: 'forwards' 
                }}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-4 w-16 h-16 bg-card rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-border">
                    <img 
                      src={company.logo_url || "https://via.placeholder.com/150"} 
                      alt={`${company.name} logo`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      title={company.name}
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{company.name}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow">
                    {company.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">Est. {company.year}</span>
                    <Link
                      to={`/portfolio/${company.id}`}
                      className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                    >
                      View Details →
                    </Link>
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

export default FeaturedCompanies;
