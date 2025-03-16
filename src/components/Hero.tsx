
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background -z-10" />
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 -z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="chip bg-accent/10 text-accent">Social Entrepreneur</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Creating Lasting Change <br />Through Social Innovation
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            Building bridges between social impact and entrepreneurship. Transforming communities through sustainable business models.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white hover:scale-105 transition-transform">
              <Link to="/portfolio">View My Work</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full group hover:scale-105 transition-transform">
              <Link to="/about" className="flex items-center">
                Learn More <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <div className="glass-panel p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-4xl font-bold text-accent mb-2">10+</p>
            <p className="text-muted-foreground">Companies Founded</p>
          </div>
          <div className="glass-panel p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-4xl font-bold text-accent mb-2">$25M+</p>
            <p className="text-muted-foreground">Impact Investment</p>
          </div>
          <div className="glass-panel p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-4xl font-bold text-accent mb-2">500k+</p>
            <p className="text-muted-foreground">Lives Improved</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
