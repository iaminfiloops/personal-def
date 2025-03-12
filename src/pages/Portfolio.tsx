
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";

// Sample data for companies
const companies = [
  {
    id: 1,
    name: "EcoSolutions",
    logo: "https://via.placeholder.com/150",
    image: "https://via.placeholder.com/800x600",
    description: "Sustainable waste management solutions for urban communities.",
    longDescription: "EcoSolutions transforms urban waste management through innovative recycling technologies and community engagement programs. Our circular economy approach has diverted over 10,000 tons of waste from landfills.",
    type: "Founder",
    year: 2018,
    category: "Environment",
    impact: "50+ communities served, 10,000+ tons of waste diverted",
    website: "https://example.com",
  },
  {
    id: 2,
    name: "EduAccess",
    logo: "https://via.placeholder.com/150",
    image: "https://via.placeholder.com/800x600",
    description: "Making quality education accessible in underserved regions.",
    longDescription: "EduAccess leverages technology to bring quality educational content to students in regions with limited resources. Our digital platform works offline and has reached over 200,000 students.",
    type: "Investor",
    year: 2020,
    category: "Education",
    impact: "200,000+ students reached across 15 countries",
    website: "https://example.com",
  },
  {
    id: 3,
    name: "HealthBridge",
    logo: "https://via.placeholder.com/150",
    image: "https://via.placeholder.com/800x600",
    description: "Connecting rural communities with affordable healthcare.",
    longDescription: "HealthBridge uses telemedicine and mobile clinics to provide healthcare access to rural communities. We've established a network of 500+ healthcare providers serving previously underserved regions.",
    type: "Founder",
    year: 2019,
    category: "Healthcare",
    impact: "75 rural communities, 100,000+ patient consultations",
    website: "https://example.com",
  },
  {
    id: 4,
    name: "MicroFinance Plus",
    logo: "https://via.placeholder.com/150",
    image: "https://via.placeholder.com/800x600",
    description: "Empowering small entrepreneurs through accessible financing and mentorship.",
    longDescription: "MicroFinance Plus combines small business loans with comprehensive mentorship and training. Our holistic approach has helped launch over 1,000 small businesses with a 85% success rate.",
    type: "Advisor",
    year: 2016,
    category: "Financial Inclusion",
    impact: "1,000+ entrepreneurs supported, 85% business success rate",
    website: "https://example.com",
  },
  {
    id: 5,
    name: "RenewGrid",
    logo: "https://via.placeholder.com/150",
    image: "https://via.placeholder.com/800x600",
    description: "Bringing renewable energy to off-grid communities.",
    longDescription: "RenewGrid develops and implements solar-powered microgrids for communities without access to reliable electricity. Our sustainable energy solutions have transformed economic opportunities in 30+ communities.",
    type: "Investor",
    year: 2021,
    category: "Energy",
    impact: "30+ communities powered, 45,000+ individuals benefiting",
    website: "https://example.com",
  },
  {
    id: 6,
    name: "FoodSecure",
    logo: "https://via.placeholder.com/150",
    image: "https://via.placeholder.com/800x600",
    description: "Reducing food waste and improving distribution systems.",
    longDescription: "FoodSecure has created an innovative supply chain model that reduces food waste while improving distribution to food-insecure areas. Our technology matches excess food with those who need it most.",
    type: "Founder",
    year: 2017,
    category: "Food Security",
    impact: "500+ tons of food rescued, 200,000+ meals distributed",
    website: "https://example.com",
  },
];

// Categories for filtering
const categories = ["All", "Environment", "Education", "Healthcare", "Financial Inclusion", "Energy", "Food Security"];
const types = ["All", "Founder", "Investor", "Advisor"];

const Portfolio = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  
  // Filter companies based on selected filters
  const filteredCompanies = companies.filter(company => {
    const matchesCategory = categoryFilter === "All" || company.category === categoryFilter;
    const matchesType = typeFilter === "All" || company.type === typeFilter;
    return matchesCategory && matchesType;
  });

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
              
              <div>
                <h2 className="text-lg font-medium mb-3">Filter by Role</h2>
                <div className="flex flex-wrap gap-2">
                  {types.map(type => (
                    <Badge
                      key={type}
                      variant={typeFilter === type ? "default" : "outline"}
                      className={`cursor-pointer ${
                        typeFilter === type 
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
                  className="h-full border border-border/50"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={company.image} 
                      alt={company.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <Badge className={`mb-2 ${
                          company.type === "Founder" ? "bg-primary text-white" :
                          company.type === "Investor" ? "bg-accent text-white" :
                          "bg-secondary text-foreground"
                        }`}>
                          {company.type}
                        </Badge>
                        <h3 className="text-xl font-medium">{company.name}</h3>
                      </div>
                      <Badge variant="outline">{company.category}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {company.description}
                    </p>
                    
                    <div className="flex justify-between items-center border-t border-border pt-4 mt-auto">
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
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent/90 text-white px-8 py-3 font-medium transition-colors"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Portfolio;
