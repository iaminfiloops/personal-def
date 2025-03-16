
import { Link } from "react-router-dom";
import AnimatedCard from "./ui/AnimatedCard";

// Sample data for companies
const companies = [
  {
    id: "1",
    name: "EcoSolutions",
    logo: "https://via.placeholder.com/150",
    description: "Sustainable waste management solutions for urban communities.",
    type: "Founder",
    year: 2018,
  },
  {
    id: "2",
    name: "EduAccess",
    logo: "https://via.placeholder.com/150",
    description: "Making quality education accessible in underserved regions.",
    type: "Investor",
    year: 2020,
  },
  {
    id: "3",
    name: "HealthBridge",
    logo: "https://via.placeholder.com/150",
    description: "Connecting rural communities with affordable healthcare.",
    type: "Founder",
    year: 2019,
  },
];

const FeaturedCompanies = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 animate-fade-in">
          <div>
            <span className="chip bg-secondary text-foreground mb-3">Portfolio</span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Featured Companies</h2>
            <p className="text-muted-foreground max-w-xl">
              A showcase of social enterprises I've founded or invested in, each addressing critical societal challenges.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="mt-6 md:mt-0 text-accent hover:text-accent/80 font-medium transition-colors group flex items-center"
          >
            View All Companies <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((company, index) => (
            <AnimatedCard
              key={company.id}
              hoverEffect="lift"
              glareEffect={true}
              className="h-full opacity-0 animate-fade-in"
              style={{ animationDelay: `${0.2 * (index + 1)}s`, animationFillMode: 'forwards' }}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="chip bg-primary/10 text-primary">
                    {company.type}
                  </span>
                </div>
                <h3 className="text-xl font-medium mb-2">{company.name}</h3>
                <p className="text-muted-foreground flex-grow mb-4">
                  {company.description}
                </p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Est. {company.year}
                  </span>
                  <Link
                    to={`/portfolio/${company.id}`}
                    className="text-accent hover:text-accent/80 text-sm font-medium transition-colors group flex items-center"
                  >
                    Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
