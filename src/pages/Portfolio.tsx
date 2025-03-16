import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Company {
  id: string;
  name: string;
  description: string;
  year: number;
  type: string;
  status: string;
  category: string;
  impact: string;
  logo_url: string;
  gallery_images?: Array<{id: string; url: string; alt: string; title: string}>;
}

const Portfolio = () => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_companies')
          .select('*')
          .order('year', { ascending: false });

        if (error) throw error;
        setCompanies(data || []);
      } catch (err) {
        setError('Failed to load portfolio data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter companies based on selected filters
  const filteredCompanies = companies.filter(company => {
    const matchesCategory = categoryFilter === "All" || company.category === categoryFilter;
    const matchesType = typeFilter === "All" || company.type === typeFilter;
    return matchesCategory && matchesType;
  });

  // Categories for filtering
  const categories = ["All", ...new Set(companies.map(company => company.category))];
  const types = ["All", ...new Set(companies.map(company => company.type))];

  // Handle navigation to company details
  const handleViewDetails = (companyId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click events
    e.preventDefault(); // Prevent default link behavior
    navigate(`/portfolio/${companyId}`);
  };

  return (
    <>
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background -z-10" />

          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="chip bg-secondary text-foreground mb-3">Portfolio</span>
              <h1 className="text-4xl md:text-5xl font-semibold mb-6">Companies & Investments</h1>
              <p className="text-xl text-muted-foreground">
                A showcase of social enterprises I've founded, invested in, or advised, each addressing critical social challenges.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <h2 className="text-lg font-medium mb-3">Filter by Category</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={categoryFilter === category ? "default" : "outline"}
                      className={`cursor-pointer ${categoryFilter === category
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

              <div>
                <h2 className="text-lg font-medium mb-3">Filter by Role</h2>
                <div className="flex flex-wrap gap-2">
                  {types.map(type => (
                    <Badge
                      key={type}
                      variant={typeFilter === type ? "default" : "outline"}
                      className={`cursor-pointer ${typeFilter === type
                          ? "bg-primary hover:bg-primary/90 text-white"
                          : "hover:bg-primary/10"
                        }`}
                      onClick={() => setTypeFilter(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompanies.map(company => (
                <AnimatedCard
                  key={company.id}
                  hoverEffect="lift"
                  glareEffect={true}
                  className="h-full border border-border/50 relative"
                  onClick={() => navigate(`/portfolio/${company.id}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <Badge className={`mb-2 ${company.type === "Founder" ? "bg-primary text-white" :
                            company.type === "Investor" ? "bg-accent text-white" :
                              "bg-secondary text-foreground"
                          }`}>
                          {company.type}
                        </Badge>
                        <h3 className="text-xl font-medium">{company.name}</h3>
                      </div>
                      <Badge variant="outline">{company.category}</Badge>
                    </div>

                    <p className="text-muted-foreground mb-6 flex-grow">
                      {company.description}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-border mt-auto">
                      <span className="text-sm text-muted-foreground">Est. {company.year}</span>
                      <Button
                        variant="ghost"
                        className="text-accent hover:text-accent/80 text-sm font-medium p-0 hover:bg-transparent z-10"
                        onClick={(e) => handleViewDetails(company.id, e)}
                      >
                        View Details →
                      </Button>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No companies match your filters</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filter criteria to see more results.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="glass-panel p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6">
                Interested in Collaboration?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're looking to partner on a social enterprise, seeking investment, or interested in advisory services, I'd love to connect.
              </p>
              <Button
                variant="default"
                className="rounded-full bg-accent hover:bg-accent/90 text-white px-8 py-6"
                onClick={() => navigate('/contact')}
              >
                Start a Conversation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Portfolio;