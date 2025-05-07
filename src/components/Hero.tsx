import { ArrowRight, Award, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-accent/5">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-primary/5 to-accent/10 opacity-60 -z-10" />

      {/* Animated Wave Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30 -z-10 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            fillOpacity="0.2"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-wave-slow"
          >
          </path>
          <path
            fill="currentColor"
            fillOpacity="0.2"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,133.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-wave-medium"
          >
          </path>
          <path
            fill="currentColor"
            fillOpacity="0.2"
            d="M0,288L48,266.7C96,245,192,203,288,186.7C384,171,480,181,576,192C672,203,768,213,864,218.7C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-wave-fast"
          >
          </path>
        </svg>
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexPattern" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(10)">
              <path
                d="M20 1.15470054 L36.9282032 11.5773503 L36.9282032 32.4226497 L20 42.8452995 L3.07179677 32.4226497 L3.07179677 11.5773503 Z"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="0.5"
                transform="scale(0.5)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPattern)" />
        </svg>
      </div>

      {/* Enhanced Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl -z-5 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl -z-5 animate-pulse-slower"></div>
      <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-primary/5 blur-2xl -z-5 animate-pulse-medium"></div>

      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left order-2 lg:order-1">
            {/* Chip/Tag with enhanced design */}
            <div
              className={`mb-6 transform transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.1s' }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-sm font-medium border border-primary/10 shadow-sm">
                Social Innovator & Entrepreneur
              </span>
            </div>

            {/* Main Headline with enhanced gradient */}
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 transform transition-all duration-700 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.3s' }}
            >
              Leading with Purpose: A Woman’s Journey to Transform Lives and Uplift Communities
            </h1>

            {/* Quote with enhanced styling */}
            <blockquote
              className={`text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl italic relative pl-6 border-l-2 border-accent/50 transform transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.5s' }}
            >
              <span className="absolute -left-3 -top-6 text-5xl text-accent/40">"</span>
              She transforms not by command, but by compassion — igniting hope, nurturing potential, and reshaping futures where others saw none.              <span className="absolute -right-3 -bottom-6 text-5xl text-accent/40">"</span>
            </blockquote>

            {/* Action Buttons with improved hover effects */}
            <div
              className={`flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-16 transform transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.7s' }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Link to="/portfolio">View Impact</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full group hover:border-accent hover:text-accent transition-colors duration-300 border-primary/20"
              >
                <Link to="/about" className="flex items-center">
                  Learn More <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Completely Redesigned Hero Image */}
          <div className={`relative order-1 lg:order-2 transform transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* MCP Design - Refined Image Container */}
            <div className="relative mx-auto max-w-md">
              {/* Background Glow Effects */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 blur-xl opacity-70 rounded-2xl"></div>

              {/* Main Image Frame with Better Border Design */}
              <div className="relative rounded-2xl p-1 bg-gradient-to-br from-primary via-accent to-primary shadow-xl overflow-hidden">
                {/* Inner Container with Proper Padding & Border */}
                <div className="relative bg-white/90 dark:bg-gray-800/90 rounded-xl p-3 backdrop-blur-sm">
                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-primary/30 to-accent/30 rounded-bl-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-tr-3xl"></div>

                  {/* Image Container with Proper Aspect Ratio */}
                  <div className="relative rounded-lg overflow-hidden">
                    {/* Diagonal Decorative Lines */}
                    <div className="absolute top-0 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-transparent"></div>
                    <div className="absolute top-0 right-0 h-1/3 w-1 bg-gradient-to-b from-accent to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-1 bg-gradient-to-l from-primary to-transparent"></div>
                    <div className="absolute bottom-0 left-0 h-1/3 w-1 bg-gradient-to-t from-accent to-transparent"></div>

                    {/* Main Image with Proper Aspect Ratio and Responsive Height */}
                    <div className="relative pt-[125%] w-full">
                      <img
                        src="https://res.cloudinary.com/dyiso4ohk/image/upload/v1743129881/WhatsApp_Image_2025-03-20_at_17.24.29_17889df1_ohnsxy.jpg"
                        alt="Pinky Paul Mondal - Social Entrepreneur"
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* Gradient Overlay for Better Visual Integration */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 mix-blend-overlay"></div>
                    </div>
                  </div>

                  {/* Name Banner at Bottom */}
                  <div className="absolute bottom-6 left-6 right-6 py-2 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md">
                    <p className="text-center font-medium text-sm text-gradient">Pinky Paul Mondal</p>
                    <p className="text-center text-xs text-muted-foreground">Founder & Social Entrepreneur</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -right-4 top-1/4 w-8 h-8 border-2 border-accent/40 rounded-full animate-ping-slow"></div>
              <div className="absolute -left-6 top-1/2 w-3 h-3 bg-primary rounded-full animate-pulse-slow"></div>

              {/* Enhanced Experience Badge */}
              <div className="absolute -top-8 -left-8 bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-800/95 dark:to-gray-800/80 rounded-full h-20 w-20 flex items-center justify-center shadow-lg border border-primary/30 backdrop-blur-sm z-30">
                <div className="text-center">
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">10+</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Years Exp.</p>
                </div>
              </div>

              {/* Award Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 shadow-lg border border-accent/20 backdrop-blur-sm z-30">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-2 rounded-md">
                    <Award className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Award-Winning</p>
                    <p className="text-xs text-muted-foreground">Social Entrepreneur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Impact Stats Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 transform transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0.9s' }}
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-sm border border-primary/20 rounded-xl p-6 text-center shadow-lg hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Globe className="text-primary" size={32} />
            </div>
            <p className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">10+</p>
            <p className="text-muted-foreground">Social Ventures</p>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-sm border border-accent/20 rounded-xl p-6 text-center shadow-lg hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award className="text-accent" size={32} />
            </div>
            <p className="text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">$2M+</p>
            <p className="text-muted-foreground">Impact Investment</p>
          </div>
          <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-sm border border-primary/20 rounded-xl p-6 text-center shadow-lg hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="text-primary" size={32} />
            </div>
            <p className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">5k+</p>
            <p className="text-muted-foreground">Lives Transformed</p>
          </div>
        </div>
      </div>

      {/* Add these styles to your global CSS or in a style tag */}
      <style jsx global>{`
        @keyframes wave-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes wave-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wave-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.2; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.1; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-wave-slow {
          animation: wave-slow 8s ease-in-out infinite;
        }
        .animate-wave-medium {
          animation: wave-medium 6s ease-in-out infinite;
        }
        .animate-wave-fast {
          animation: wave-fast 4s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-medium {
          animation: pulse-medium 5s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-image: linear-gradient(to right, var(--primary), var(--accent));
        }
      `}</style>
    </section>
  );
};

export default Hero;