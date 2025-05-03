
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-xl font-medium text-foreground mb-4 block">
            Pinky Paul Mondal
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              Bridging the gap between social impact and entrepreneurship.
              Creating lasting change through innovative business models.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-base font-medium mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground hover:text-accent transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-base font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-accent transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear}  Infilabs. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Designed with purpose. Built with passion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
