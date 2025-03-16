
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent/5 to-background p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 animate-bounce-slow">
          <div className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
            404
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          Page Not Found
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <Button asChild size="lg" className="rounded-full group">
            <Link to="/" className="flex items-center">
              <Home size={16} className="mr-2" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full group">
            <Link to="#" onClick={() => window.history.back()} className="flex items-center">
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
