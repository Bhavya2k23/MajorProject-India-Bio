import { Leaf, Github, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">India Biodiversity</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Exploring and conserving India's rich natural heritage through
              education and awareness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/zones" className="text-muted-foreground hover:text-primary transition-colors">
                  Biogeographical Zones
                </Link>
              </li>
              <li>
                <Link to="/species" className="text-muted-foreground hover:text-primary transition-colors">
                  Species Directory
                </Link>
              </li>
              <li>
                <Link to="/ecosystems" className="text-muted-foreground hover:text-primary transition-colors">
                  Ecosystems
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-muted-foreground hover:text-primary transition-colors">
                  Map Explorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/conservation" className="text-muted-foreground hover:text-primary transition-colors">
                  Conservation Status
                </Link>
              </li>
              <li>
                <Link to="/value" className="text-muted-foreground hover:text-primary transition-colors">
                  Biodiversity Value
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-muted-foreground hover:text-primary transition-colors">
                  Quiz
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@biodiversity.in"
                className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Wildlife Protection Act, 1972
              <br />
              Environment Protection Act, 1986
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} India Biodiversity Explorer. Educational Project.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made for Indian Wildlife
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
