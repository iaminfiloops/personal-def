
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 py-4",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-medium text-foreground flex items-center gap-2"
          aria-label="Emily Chen"
        >
          <span className="relative">
            <span className="absolute -inset-1 -skew-y-3 bg-accent/10 rounded" />
            <span className="relative">Ajitesh Mondal</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-medium transition-all duration-200 ease-in-out hover:text-accent text-sm",
                location.pathname === link.path
                  ? "text-accent"
                  : "text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "font-medium transition-all duration-200 ease-in-out hover:text-accent text-sm",
                location.pathname.startsWith("/admin")
                  ? "text-accent"
                  : "text-foreground"
              )}
            >
              Admin
            </Link>
          )}

          {user ? (
            <Button 
              asChild 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link to="/admin">
                <UserCircle className="w-4 h-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button 
              asChild 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link to="/login">
                <UserCircle className="w-4 h-4" />
                Login
              </Link>
            </Button>
          )}
          
          <Button 
            asChild 
            variant="ghost"
            className="bg-accent text-white hover:bg-accent/90 font-medium"
          >
            <Link to="/contact">Contact</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-2xl font-medium transition-all duration-200 ease-in-out",
                location.pathname === link.path
                  ? "text-accent"
                  : "text-foreground"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "text-2xl font-medium transition-all duration-200 ease-in-out",
                location.pathname.startsWith("/admin")
                  ? "text-accent"
                  : "text-foreground"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          )}

          {user ? (
            <Button 
              asChild 
              variant="outline"
              className="flex items-center gap-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to="/admin">
                <UserCircle className="w-5 h-5" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button 
              asChild 
              variant="outline"
              className="flex items-center gap-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to="/login">
                <UserCircle className="w-5 h-5" />
                Login
              </Link>
            </Button>
          )}
          
          <Button 
            asChild 
            variant="ghost"
            className="bg-accent text-white hover:bg-accent/90 text-lg px-6 py-2 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link to="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
