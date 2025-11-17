import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Droplets,
  Wind,
  Heart,
  Lightbulb,
  TrendingUp,
  Trees,
  Users,
} from "lucide-react";

const Value = () => {
  const values = [
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Ecological Value",
      color: "bg-ecosystem-forest",
      points: [
        "Maintains ecosystem balance and stability",
        "Supports food webs and nutrient cycling",
        "Provides habitats for countless species",
        "Enables pollination and seed dispersal",
      ],
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Climate Regulation",
      color: "bg-ecosystem-ocean",
      points: [
        "Forests absorb CO2 and produce oxygen",
        "Wetlands act as carbon sinks",
        "Oceans regulate global climate patterns",
        "Prevents soil erosion and desertification",
      ],
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Health & Medicine",
      color: "bg-status-endangered",
      points: [
        "Source of medicinal compounds",
        "Traditional medicine knowledge",
        "Genetic resources for drug development",
        "Mental health and recreation benefits",
      ],
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Economic Value",
      color: "bg-status-threatened",
      points: [
        "Agriculture depends on pollinators",
        "Fisheries and forestry livelihoods",
        "Tourism and eco-tourism revenue",
        "Natural resources for industries",
      ],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Cultural & Spiritual",
      color: "bg-accent",
      points: [
        "Sacred groves and wildlife",
        "Traditional knowledge systems",
        "Cultural identity and heritage",
        "Inspiration for art and literature",
      ],
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Scientific Value",
      color: "bg-primary",
      points: [
        "Understanding evolution and adaptation",
        "Biomimicry and innovation",
        "Climate change indicators",
        "Ecological research opportunities",
      ],
    },
  ];

  const services = [
    {
      category: "Provisioning Services",
      icon: <Trees className="h-5 w-5" />,
      examples: ["Food", "Fresh water", "Wood & fiber", "Fuel", "Medicines"],
    },
    {
      category: "Regulating Services",
      icon: <Wind className="h-5 w-5" />,
      examples: [
        "Climate regulation",
        "Flood control",
        "Disease regulation",
        "Water purification",
        "Pollination",
      ],
    },
    {
      category: "Cultural Services",
      icon: <Heart className="h-5 w-5" />,
      examples: [
        "Recreation",
        "Aesthetic value",
        "Spiritual value",
        "Education",
        "Tourism",
      ],
    },
    {
      category: "Supporting Services",
      icon: <Leaf className="h-5 w-5" />,
      examples: [
        "Soil formation",
        "Nutrient cycling",
        "Primary production",
        "Oxygen production",
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">
            Biodiversity Value
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Biodiversity is essential for human survival and well-being, providing
            countless benefits that sustain life on Earth
          </p>
        </div>

        {/* Key Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {values.map((value, index) => (
            <Card
              key={index}
              className="p-6 hover-lift transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className={`inline-flex p-3 rounded-xl ${value.color} text-white`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {value.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Ecosystem Services */}
        <div className="mb-12">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-bold">Ecosystem Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The benefits that humans derive from ecosystems, essential for our survival and quality of life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-6 bg-gradient-to-br from-card to-secondary/20 hover-lift transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                      {service.icon}
                    </div>
                    <h3 className="font-semibold text-sm">{service.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {service.examples.map((example, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">India's Biodiversity Wealth</h2>
            <p className="text-muted-foreground">
              Contributing significantly to global biodiversity
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">2.4%</div>
              <div className="text-sm text-muted-foreground">
                World's land area
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">7-8%</div>
              <div className="text-sm text-muted-foreground">
                World's species
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">
                Biodiversity hotspots
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">45,000+</div>
              <div className="text-sm text-muted-foreground">
                Plant species
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-8 bg-gradient-to-r from-primary to-accent text-white">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Protect Biodiversity</h2>
            <p className="opacity-90 max-w-2xl mx-auto">
              Every species plays a crucial role in maintaining ecosystem balance.
              Conservation efforts today ensure a sustainable future for generations to come.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Support Conservation
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Reduce Plastic Use
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Plant Native Species
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Spread Awareness
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Value;
