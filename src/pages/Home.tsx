import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Map, Search, Award, Globe, TreePine, Brain } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Map className="h-6 w-6" />,
      title: "Biogeographical Zones",
      description: "Explore India's 10 unique biogeographical zones",
      link: "/zones",
      color: "bg-ecosystem-forest",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Species Directory",
      description: "Discover India's diverse flora and fauna",
      link: "/species",
      color: "bg-ecosystem-wetland",
    },
    {
      icon: <TreePine className="h-6 w-6" />,
      title: "Ecosystems",
      description: "Learn about different ecosystem types",
      link: "/ecosystems",
      color: "bg-ecosystem-mountain",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Conservation",
      description: "Understand conservation status",
      link: "/conservation",
      color: "bg-status-endangered",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Interactive Map",
      description: "Visualize species distribution",
      link: "/map",
      color: "bg-ecosystem-ocean",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Quiz Challenge",
      description: "Test your biodiversity knowledge",
      link: "/quiz",
      color: "bg-accent",
    },
  ];

  const stats = [
    { value: "10", label: "Biogeographical Zones" },
    { value: "45,000+", label: "Plant Species" },
    { value: "91,000+", label: "Animal Species" },
    { value: "2.4%", label: "World's Land Area" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                <Globe className="h-4 w-4" />
                Explore India's Natural Heritage
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              India Biodiversity
              <span className="block text-gradient">Explorer</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the incredible diversity of species, ecosystems, and biogeographical
              zones that make India one of the world's mega-diverse nations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/species">
                <Button size="lg" className="group">
                  Explore Species
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/map">
                <Button size="lg" variant="outline">
                  View Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Explore India's Natural Wealth
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive tools and resources to understand and appreciate biodiversity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="group">
                <Card className="p-6 h-full hover-lift hover:border-primary/50 transition-all">
                  <div className="space-y-4">
                    <div
                      className={`inline-flex p-3 rounded-xl ${feature.color} text-white`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Explore?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Test your knowledge with our interactive quiz or dive into the species directory
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/quiz">
              <Button size="lg" variant="secondary">
                Take Quiz
              </Button>
            </Link>
            <Link to="/species">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                Browse Species
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
