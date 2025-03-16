
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ExternalLink, Users } from "lucide-react";

// Sample portfolio data (would be fetched from Supabase in production)
const portfolioData = [
  {
    id: "1",
    name: "EcoSolutions",
    description: "A pioneering waste management company that transforms plastic waste into affordable building materials for low-income housing.",
    longDescription: `
      <p>EcoSolutions was founded in 2018 with a dual mission: to address the growing plastic waste crisis and to provide affordable housing solutions for communities in need. The company has developed a proprietary technology that converts plastic waste into durable, low-cost building materials that are both environmentally sustainable and economically viable.</p>
      
      <h2>The Challenge</h2>
      <p>Plastic pollution and housing insecurity represent two of the most pressing challenges facing communities around the world. Traditional approaches have treated these as separate issues, requiring separate solutions. EcoSolutions was founded on the insight that these challenges could be addressed simultaneously through innovative technology and business models.</p>
      
      <h2>The Innovation</h2>
      <p>At the heart of EcoSolutions is a patented process that transforms mixed plastic waste—including types that are typically difficult to recycle—into construction materials that meet or exceed industry standards for durability, insulation, and safety. These materials cost 30-40% less than traditional alternatives and have a carbon footprint that is 70% smaller.</p>
      
      <p>The company operates collection centers in urban areas, partnering with waste picker communities to ensure they receive fair compensation and safe working conditions. The collected plastic is processed at regional manufacturing facilities, which are designed to be energy-efficient and to minimize environmental impact.</p>
      
      <h2>Impact and Growth</h2>
      <p>Since its founding, EcoSolutions has:</p>
      <ul>
        <li>Diverted over 2,000 tons of plastic waste from landfills and oceans</li>
        <li>Provided materials for more than 500 housing units in underserved communities</li>
        <li>Created employment for 150 people, many from marginalized backgrounds</li>
        <li>Reduced carbon emissions by an estimated 3,500 tons</li>
      </ul>
      
      <p>The company has expanded from its initial operations in coastal Brazil to include facilities in Colombia and Mexico, with plans for further expansion in Southeast Asia.</p>
      
      <h2>Investment and Partnerships</h2>
      <p>EcoSolutions has raised $8 million in investment capital from a mix of impact investors, family offices, and corporate venture funds. The company has also formed strategic partnerships with municipal governments, housing NGOs, and corporate sustainability programs.</p>
      
      <p>A particularly successful partnership has been with Habitat for Humanity, which has used EcoSolutions materials in housing projects across Latin America and provided valuable feedback for product development and community engagement.</p>
      
      <h2>Looking Forward</h2>
      <p>The company is currently developing new product lines, including furniture and infrastructure components, to further expand its impact and market reach. It is also investing in research to include additional types of waste in its manufacturing process.</p>
      
      <p>EcoSolutions aims to be operating in 10 countries by 2025 and to have diverted 10,000 tons of plastic waste while providing materials for 5,000 housing units. The long-term vision is to transform how communities think about waste—not as a problem to be disposed of, but as a valuable resource for meeting basic needs.</p>
    `,
    logo: "https://via.placeholder.com/150",
    coverImage: "https://via.placeholder.com/1200x600",
    website: "https://example.com/ecosolutions",
    foundedYear: 2018,
    location: "São Paulo, Brazil",
    team: 32,
    impact: [
      "2,000+ tons of plastic waste diverted",
      "500+ housing units built",
      "150+ jobs created",
      "3,500+ tons of CO2 emissions reduced"
    ],
    type: "Founder",
    status: "Active",
  },
  {
    id: "2",
    name: "EduAccess",
    description: "A technology platform that connects underserved students with educational resources, mentorship, and scholarship opportunities.",
    longDescription: `
      <p>EduAccess was founded in 2020 with the mission of democratizing access to quality education for students from underserved communities. The platform leverages technology to bridge gaps in educational opportunity by connecting students with resources, mentors, and financial support that would otherwise be out of reach.</p>
      
      <h2>The Challenge</h2>
      <p>Educational inequality remains one of the most persistent barriers to social mobility and economic opportunity. Despite abundant resources in the aggregate—from scholarships to online courses to potential mentors—there is a critical disconnect in matching these resources with the students who need them most. This disconnect is particularly acute for students from low-income families, rural communities, and historically marginalized groups.</p>
      
      <h2>The Innovation</h2>
      <p>EduAccess has developed a comprehensive digital platform that serves as a personalized educational opportunity hub for underserved students. Key features include:</p>
      
      <ul>
        <li>A sophisticated matching algorithm that connects students with relevant scholarships, grants, and financial aid opportunities based on their unique profiles, interests, and goals</li>
        <li>A mentorship network that pairs students with professionals and academics who share similar backgrounds or interests</li>
        <li>A curated library of educational resources, including test preparation materials, college application guides, and career development tools</li>
        <li>A supportive community where students can share experiences, strategies, and encouragement</li>
      </ul>
      
      <p>Unlike many edtech platforms that require high-speed internet and advanced devices, EduAccess has been designed with accessibility at its core. The platform works effectively on basic smartphones with limited data and offers offline functionality for key features.</p>
      
      <h2>Impact and Growth</h2>
      <p>In its first three years of operation, EduAccess has:</p>
      <ul>
        <li>Served over 50,000 students across 12 countries</li>
        <li>Facilitated access to more than $15 million in scholarships and financial aid</li>
        <li>Connected 5,000+ students with dedicated mentors</li>
        <li>Seen 85% of its users successfully transition to higher education or vocational training</li>
      </ul>
      
      <p>The platform began with a focus on high school students in urban centers in Kenya and has since expanded to serve learners from primary school through university across East Africa and parts of South Asia.</p>
      
      <h2>Investment and Partnerships</h2>
      <p>As an early investor in EduAccess, I was drawn to both the scalability of the model and the team's deep commitment to educational equity. The company has raised a total of $7 million, including participation from education-focused venture funds, foundations, and strategic corporate partners.</p>
      
      <p>Key partnerships include collaborations with major universities to open scholarship opportunities, corporate sponsors who provide both funding and mentors, and NGOs that help reach students in particularly underserved regions.</p>
      
      <h2>Looking Forward</h2>
      <p>EduAccess is currently developing enhanced features for vocational training pathways and expanding its coverage of micro-scholarship opportunities. The company aims to serve 200,000 students by 2025 and to demonstrate measurable improvements in college enrollment, persistence, and career outcomes for users from the most disadvantaged backgrounds.</p>
      
      <p>The long-term vision is to create a world where a student's educational opportunities are determined by their potential and passion rather than their postal code or family income.</p>
    `,
    logo: "https://via.placeholder.com/150",
    coverImage: "https://via.placeholder.com/1200x600",
    website: "https://example.com/eduaccess",
    foundedYear: 2020,
    location: "Nairobi, Kenya",
    team: 24,
    impact: [
      "50,000+ students served",
      "$15M+ in scholarships facilitated",
      "5,000+ mentor relationships established",
      "85% higher education transition rate"
    ],
    type: "Investor",
    status: "Active",
  },
  {
    id: "3",
    name: "HealthBridge",
    description: "An integrated healthcare delivery system that combines telemedicine, community health workers, and micro-insurance to serve rural communities.",
    longDescription: `
      <p>HealthBridge was founded in 2019 to address the persistent gaps in healthcare access for rural communities. The organization has developed an integrated model that leverages technology, human relationships, and innovative financing to provide quality healthcare services to populations that have traditionally been underserved by conventional healthcare systems.</p>
      
      <h2>The Challenge</h2>
      <p>Rural communities worldwide face significant barriers to healthcare access, including geographic isolation, shortage of healthcare professionals, limited infrastructure, and financial constraints. Traditional healthcare models often fail in these contexts because they rely on centralized facilities and fee-for-service payment systems that don't account for the realities of rural life and economies.</p>
      
      <h2>The Innovation</h2>
      <p>HealthBridge has created a three-pillar approach that addresses both the delivery of care and its financing:</p>
      
      <h3>1. Technology-Enabled Care</h3>
      <p>At the core of HealthBridge's model is a telemedicine platform specifically designed for low-resource settings. The platform connects patients with doctors for virtual consultations and works effectively even with limited connectivity. It includes features like offline functionality, low-bandwidth video options, and integration with basic diagnostic devices that can be used by local health workers.</p>
      
      <h3>2. Community Health Workers</h3>
      <p>HealthBridge recruits and trains community health workers from the communities they serve. These workers conduct home visits, operate small health outposts, assist with telemedicine consultations, and coordinate referrals to higher levels of care when needed. By employing local residents, HealthBridge creates jobs while building on existing community trust networks.</p>
      
      <h3>3. Micro-insurance and Subscription Model</h3>
      <p>To make services financially sustainable and affordable for patients, HealthBridge has developed a hybrid financing model. Community members can join a micro-insurance program with premiums as low as $2 per month, which covers primary care, select medications, and basic emergency services. This is supplemented by a tiered subscription model for additional services and government partnerships that subsidize care for the most vulnerable.</p>
      
      <h2>Impact and Growth</h2>
      <p>Since its founding, HealthBridge has:</p>
      <ul>
        <li>Established operations in 28 rural communities across India and Bangladesh</li>
        <li>Provided healthcare access to over 120,000 people</li>
        <li>Trained and employed 85 community health workers</li>
        <li>Conducted more than 200,000 consultations</li>
        <li>Achieved 40% reduction in untreated illnesses in communities served</li>
        <li>Reduced emergency transport needs by 60% through early intervention</li>
      </ul>
      
      <p>The organization began in Maharashtra, India, and has since expanded to neighboring states and into Bangladesh, with plans for further growth in Southeast Asia.</p>
      
      <h2>Investment and Partnerships</h2>
      <p>As a founding investor and board member, I have worked closely with HealthBridge's leadership to refine the model and secure additional funding. The organization has raised $6.5 million through a combination of impact investment, philanthropic grants, and development finance.</p>
      
      <p>Strategic partnerships have been crucial to HealthBridge's success, including collaborations with:
      <ul>
        <li>Medical schools that provide remote physician support</li>
        <li>Pharmaceutical companies that ensure medication supply chains</li>
        <li>Government health agencies that provide partial reimbursement for services</li>
        <li>Technology companies that have donated or subsidized equipment</li>
      </ul>
      </p>
      
      <h2>Looking Forward</h2>
      <p>HealthBridge is currently developing specialized programs for maternal and child health and chronic disease management, two areas with particularly high impact potential in rural communities. The organization aims to serve 500,000 people by 2025 and to demonstrate a sustainable financial model that could be replicated in other regions.</p>
      
      <p>The long-term vision is to create a network of rural healthcare systems that provide accessible, affordable, and quality care to communities that have been overlooked by traditional healthcare models.</p>
    `,
    logo: "https://via.placeholder.com/150",
    coverImage: "https://via.placeholder.com/1200x600",
    website: "https://example.com/healthbridge",
    foundedYear: 2019,
    location: "Maharashtra, India",
    team: 47,
    impact: [
      "120,000+ people given healthcare access",
      "85 community health workers employed",
      "200,000+ consultations conducted",
      "40% reduction in untreated illnesses"
    ],
    type: "Founder",
    status: "Active",
  }
];

const PortfolioDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from Supabase instead
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundCompany = portfolioData.find(company => company.id === id);
        setCompany(foundCompany || null);
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
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
          ) : company ? (
            <div className="animate-fade-in">
              <div className="mb-12 relative rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96">
                <img 
                  src={company.coverImage} 
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-10 flex items-end">
                  <div className="mr-6 w-20 h-20 bg-card rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-border">
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="chip bg-primary/10 text-primary mb-2">
                      {company.type}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                      {company.name}
                    </h1>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80"
                    dangerouslySetInnerHTML={{ __html: company.longDescription }}
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
                          <p className="font-medium">{company.foundedYear}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Users size={18} className="mr-3 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Team Size</p>
                          <p className="font-medium">{company.team} employees</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-0.5 text-muted-foreground">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{company.location}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <ExternalLink size={18} className="mr-3 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-accent hover:text-accent/80"
                          >
                            Visit Website
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-xl">
                    <h2 className="text-xl font-medium mb-4">Impact Metrics</h2>
                    <ul className="space-y-2">
                      {company.impact.map((item: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-accent mr-3"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white">
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        Visit Company Website
                      </a>
                    </Button>
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
