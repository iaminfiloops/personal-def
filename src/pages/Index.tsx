import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/Hero";
import FeaturedCompanies from "@/components/FeaturedCompanies";
import BlogPreview from "@/components/BlogPreview";
import FounderInsights from "@/components/FounderInsights";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, UserRound, Briefcase, FileText, Heart } from "lucide-react";
import { Helmet } from "react-helmet";
import { PersonStructuredData } from "@/components/SEO/StructuredData";
import LocalBusinessSchema from "@/components/SEO/LocalBusinessSchema";
import { useState, useEffect } from "react";

const Index = () => {
  // State for founder insights
  const [insights, setInsights] = useState([]);
  const [featuredInsight, setFeaturedInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch founder insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // Fetch featured insight
        const featuredResponse = await fetch('/api/insights?featured=true&limit=1');
        const featuredData = await featuredResponse.json();

        if (featuredData.insights && featuredData.insights.length > 0) {
          setFeaturedInsight(featuredData.insights[0]);
        }

        // Fetch recent insights (excluding the featured one)
        const recentResponse = await fetch('/api/insights?limit=3');
        const recentData = await recentResponse.json();

        if (recentData.insights) {
          // Filter out the featured insight if it exists
          const filteredInsights = featuredInsight
            ? recentData.insights.filter(insight => insight.id !== featuredInsight.id)
            : recentData.insights;

          setInsights(filteredInsights.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <>
      <Helmet>
        <title>Pinky Paul Mondal - Social Entrepreneur and Education Innovator</title>
        <meta
          name="description"
          content="Pinky Paul Mondal: Social entrepreneur empowering backward class students through scholarships and mentoring programs across Kolkata, Bengaluru, and Jharkhand."
        />
        <meta name="keywords" content="Pinky Paul Mondal, social entrepreneur, education activist, scholarship provider, backward class education, engineering mentor, medical education support" />
        <link rel="canonical" href="https://pinkypaulmondal.com" />
      </Helmet>

      {/* Structured Data for better SEO */}
      <PersonStructuredData
        name="Pinky Paul Mondal"
        alternateName="Pinky Paul Mondal Social Entrepreneur"
        jobTitle="Social Entrepreneur and Education Activist"
        description="Pinky Paul Mondal is a visionary social entrepreneur and education activist dedicated to empowering backward class students through scholarships and mentoring programs across Kolkata, Bengaluru, and Jharkhand."
        image="https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-workshop-kolkata.jpg"
        url="https://pinkypaulmondal.com"
        sameAs={[
          "https://linkedin.com/in/pinkypaulmondal",
          "https://twitter.com/pinkypaulmondal",
          "https://facebook.com/pinkypaulmondal",
          "https://instagram.com/pinkypaulmondal",
          "https://youtube.com/c/pinkypaulmondal"
        ]}
      />

      <LocalBusinessSchema
        name="Pinky Paul Mondal Education Foundation"
        description="Pinky Paul Mondal's organization dedicated to empowering backward class students through scholarships and mentoring programs across India."
        url="https://pinkypaulmondal.com"
        logo="https://pinkypaulmondal.com/images/gallery/pinky-paul-mondal-education-workshop-kolkata.jpg"
        telephone="+91 9876543210"
        email="contact@pinkypaulmondal.com"
        address={{
          streetAddress: "123 Education Street, Park Avenue",
          addressLocality: "Kolkata",
          addressRegion: "West Bengal",
          postalCode: "700001",
          addressCountry: "IN"
        }}
        geo={{
          latitude: 22.5726,
          longitude: 88.3639
        }}
        sameAs={[
          "https://linkedin.com/in/pinkypaulmondal",
          "https://twitter.com/pinkypaulmondal",
          "https://facebook.com/pinkypaulmondal",
          "https://instagram.com/pinkypaulmondal",
          "https://youtube.com/c/pinkypaulmondal"
        ]}
        openingHours={[
          "Monday-Friday 09:00-17:00",
          "Saturday 10:00-15:00"
        ]}
        priceRange="Free-$$"
      />

      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <Hero />

        <section className="py-16 md:py-24">
          {/* <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <span className="chip bg-secondary text-foreground mb-3">About Me</span>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6">Bridging Social Work & Entrepreneurship</h2>
                <p className="text-muted-foreground mb-6">
                  With over 15 years of experience in both social work and business leadership, I've developed a
                  unique approach to addressing societal challenges through sustainable business models.
                </p>
                <p className="text-muted-foreground mb-8">
                  My work focuses on creating scalable solutions that empower communities while generating the
                  resources needed for long-term impact. I believe that the most effective social change happens
                  at the intersection of purpose and profit.
                </p>
                <Button asChild variant="outline" className="rounded-full group">
                  <Link to="/about" className="flex items-center">
                    My Journey <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <div className="order-1 md:order-2 relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-glass">
                  <img
                    src="https://res.cloudinary.com/dyiso4ohk/image/upload/v1743129881/WhatsApp_Image_2025-03-20_at_17.24.29_17889df1_ohnsxy.jpg"
                    alt="Pinky Paul Mondal"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div> */}
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-secondary/20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="chip bg-secondary text-foreground mb-3">What I Do</span>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">Creating Impact Through Innovation</h2>
              <p className="text-muted-foreground">
                My work spans multiple dimensions of social entrepreneurship, from founding companies to advising organizations on their social impact strategies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <UserRound size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Social Work Expertise</h3>
                <p className="text-muted-foreground">
                  Leveraging deep understanding of community needs and social systems to identify opportunities for impact.
                </p>
              </div>

              <div className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Briefcase size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-medium mb-3">Venture Building</h3>
                <p className="text-muted-foreground">
                  Creating and scaling social enterprises that address critical needs with sustainable business models.
                </p>
              </div>

              <div className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <FileText size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Impact Consulting</h3>
                <p className="text-muted-foreground">
                  Advising organizations on strategies to maximize social impact while ensuring financial sustainability.
                </p>
              </div>

              <div className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Heart size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-medium mb-3">Community Building</h3>
                <p className="text-muted-foreground">
                  Fostering networks of changemakers to amplify impact through collaboration and knowledge sharing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Companies Section */}
        <FeaturedCompanies />

        {/* Founder Insights Section */}
        {!loading && (insights.length > 0 || featuredInsight) && (
          <FounderInsights
            insights={insights}
            featured={featuredInsight}
          />
        )}

        {/* Blog Preview Section */}
        <BlogPreview />

        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="relative glass-panel p-12 md:p-16 text-center max-w-4xl mx-auto overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>

              <h2 className="text-3xl md:text-4xl font-semibold mb-6 relative z-10">
                Ready to Create Lasting Change Together?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10">
                Whether you're looking to collaborate, invest, or just connect, I'm always open to new opportunities for impact.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
                <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full group">
                  <Link to="/portfolio" className="flex items-center">
                    View Portfolio <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
