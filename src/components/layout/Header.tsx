import { Link, useLocation } from "react-router-dom";
import { Menu, X, UserCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Navigation links with dropdowns
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { 
      name: "Portfolio", 
      path: "/portfolio",
      dropdown: [
        { name: "Web Design", path: "/portfolio/web-design" },
        { name: "Photography", path: "/portfolio/photography" },
        { name: "Digital Art", path: "/portfolio/digital-art" }
      ]
    },
    { name: "Gallery", path: "/gallery" },
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
    setActiveDropdown(null);
  }, [location]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 py-4",
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-foreground flex items-center gap-2"
          aria-label="Pinky Paul Mondal"
        >
          <div className="relative">
            <span className="absolute -inset-1 -skew-y-3 bg-accent/20 rounded-md" />
            <span className="relative text-accent font-bold">P</span>
            <span className="relative">inky Paul Mondal</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link, index) => (
            <div key={link.path} className="relative dropdown-container">
              {link.dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={cn(
                      "font-medium transition-all duration-200 ease-in-out hover:text-accent flex items-center gap-1 text-sm",
                      (location.pathname === link.path || location.pathname.startsWith(link.path + '/') || activeDropdown === index)
                        ? "text-accent"
                        : "text-foreground"
                    )}
                  >
                    {link.name}
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 transition-transform", 
                        activeDropdown === index ? "transform rotate-180" : ""
                      )} 
                    />
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 py-1 z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.path}
                  className={cn(
                    "font-medium transition-all duration-200 ease-in-out hover:text-accent relative text-sm group",
                    location.pathname === link.path
                      ? "text-accent"
                      : "text-foreground"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-1/2 w-0 h-0.5 bg-accent transition-all duration-300 -translate-x-1/2 group-hover:w-full",
                    location.pathname === link.path ? "w-full" : ""
                  )} />
                </Link>
              )}
            </div>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "font-medium transition-all duration-200 ease-in-out hover:text-accent text-sm relative group",
                location.pathname.startsWith("/admin")
                  ? "text-accent"
                  : "text-foreground"
              )}
            >
              Admin
              <span className={cn(
                "absolute -bottom-1 left-1/2 w-0 h-0.5 bg-accent transition-all duration-300 -translate-x-1/2 group-hover:w-full",
                location.pathname.startsWith("/admin") ? "w-full" : ""
              )} />
            </Link>
          )}

          <div className="flex items-center gap-3">
            {user ? (
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2 border-accent/30 hover:border-accent hover:bg-accent/5 transition-all duration-300"
              >
                <Link to="/admin">
                  <UserCircle className="w-4 h-4 text-accent" />
                  <span>Dashboard</span>
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2 border-accent/30 hover:border-accent hover:bg-accent/5 transition-all duration-300"
              >
                <Link to="/login">
                  <UserCircle className="w-4 h-4 text-accent" />
                  <span>Login</span>
                </Link>
              </Button>
            )}

            <Button
              asChild
              className="bg-accent text-white hover:bg-accent/90 font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6"
            >
              <Link to="/contact">Contact</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-md z-40 md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {navLinks.map((link, index) => (
            <div key={link.path} className="flex flex-col items-center">
              {link.dropdown ? (
                <>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                    className={cn(
                      "text-2xl font-medium transition-all duration-200 ease-in-out flex items-center gap-2",
                      (location.pathname === link.path || location.pathname.startsWith(link.path + '/') || activeDropdown === index)
                        ? "text-accent"
                        : "text-foreground"
                    )}
                  >
                    {link.name}
                    <ChevronDown 
                      className={cn(
                        "w-5 h-5 transition-transform", 
                        activeDropdown === index ? "transform rotate-180" : ""
                      )} 
                    />
                  </button>
                  
                  {activeDropdown === index && (
                    <div className="flex flex-col items-center space-y-4 mt-4 mb-2">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="text-lg text-gray-600 hover:text-accent transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.path}
                  className={cn(
                    "text-2xl font-medium transition-all duration-200 ease-in-out relative group",
                    location.pathname === link.path
                      ? "text-accent"
                      : "text-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-1/2 w-0 h-0.5 bg-accent transition-all duration-300 -translate-x-1/2 group-hover:w-full",
                    location.pathname === link.path ? "w-full" : ""
                  )} />
                </Link>
              )}
            </div>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "text-2xl font-medium transition-all duration-200 ease-in-out relative group",
                location.pathname.startsWith("/admin")
                  ? "text-accent"
                  : "text-foreground"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
              <span className={cn(
                "absolute -bottom-1 left-1/2 w-0 h-0.5 bg-accent transition-all duration-300 -translate-x-1/2 group-hover:w-full",
                location.pathname.startsWith("/admin") ? "w-full" : ""
              )} />
            </Link>
          )}

          <div className="flex flex-col items-center gap-4 mt-4">
            {user ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex items-center gap-2 border-accent/30 hover:border-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/admin">
                  <UserCircle className="w-5 h-5 text-accent" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex items-center gap-2 border-accent/30 hover:border-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/login">
                  <UserCircle className="w-5 h-5 text-accent" />
                  Login
                </Link>
              </Button>
            )}

            <Button
              asChild
              size="lg"
              className="bg-accent text-white hover:bg-accent/90 font-medium shadow-md rounded-full px-8"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;