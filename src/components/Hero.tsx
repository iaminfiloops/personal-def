
import { ArrowRight, Award, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-accent/5">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-primary/5 opacity-50 -z-10" />
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <path 
                d="M 30 0 L 0 0 0 30" 
                fill="none" 
                stroke="currentColor" 
                strokeOpacity="0.3" 
                strokeWidth="0.5" 
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Chip/Tag */}
          <div 
            className="mb-6 animate-fade-in opacity-0" 
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Social Innovator & Entrepreneur
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient mb-6 animate-fade-in opacity-0" 
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            Empowering Communities <br />Through Innovative Solutions
          </h1>
          
          {/* Quote */}
          <blockquote 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto italic relative animate-fade-in opacity-0" 
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            <span className="absolute -left-8 text-5xl text-accent/30 top-0">"</span>
            Education is not just about knowledge transfer; it's about breaking barriers, creating opportunities, and empowering those who have been left behind.
            <span className="absolute -right-8 text-5xl text-accent/30 bottom-0">"</span>
          </blockquote>
          
          {/* Action Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16 animate-fade-in opacity-0" 
            style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
          >
            <Button 
              asChild 
              size="lg" 
              className="rounded-full px-8 btn-gradient shadow-md hover:shadow-glow transition-all"
            >
              <Link to="/portfolio">View Impact</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="rounded-full group hover:border-accent hover:text-accent transition-colors"
            >
              <Link to="/about" className="flex items-center">
                Learn More <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Impact Stats */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in opacity-0" 
            style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}
          >
            <div className="bg-gradient-to-br from-white/80 to-white/70 dark:from-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm border border-primary/10 rounded-xl p-6 text-center shadow-soft hover-lift">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="text-primary" size={32} />
              </div>
              <p className="text-4xl font-bold text-primary mb-2">10+</p>
              <p className="text-muted-foreground">Social Ventures</p>
            </div>
            <div className="bg-gradient-to-br from-white/80 to-white/70 dark:from-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm border border-accent/10 rounded-xl p-6 text-center shadow-soft hover-lift">
              <div className="bg-accent/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="text-accent" size={32} />
              </div>
              <p className="text-4xl font-bold text-accent mb-2">$2M+</p>
              <p className="text-muted-foreground">Impact Investment</p>
            </div>
            <div className="bg-gradient-to-br from-white/80 to-white/70 dark:from-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm border border-primary/10 rounded-xl p-6 text-center shadow-soft hover-lift">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <p className="text-4xl font-bold text-primary mb-2">5k+</p>
              <p className="text-muted-foreground">Lives Transformed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
