import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trees, Droplets, Mountain, Wind, Waves } from "lucide-react";

const Ecosystems = () => {
  const ecosystems = [
    {
      name: "Tropical Forests",
      icon: <Trees className="h-6 w-6" />,
      color: "bg-ecosystem-forest",
      description: "Dense evergreen and semi-evergreen forests with high rainfall",
      characteristics: [
        "High biodiversity",
        "Multi-layered canopy",
        "Year-round growth",
        "High humidity",
      ],
      examples: "Western Ghats, Northeast India, Andaman Islands",
      keySpecies: ["Bengal Tiger", "Indian Elephant", "Lion-tailed Macaque"],
      threats: ["Deforestation", "Mining", "Urbanization"],
    },
    {
      name: "Grasslands",
      icon: <Wind className="h-6 w-6" />,
      color: "bg-status-threatened",
      description: "Open landscapes dominated by grasses and shrubs",
      characteristics: [
        "Seasonal rainfall",
        "Rich soil",
        "Grazing animals",
        "Fire-adapted",
      ],
      examples: "Terai grasslands, Banni grasslands, Kaziranga",
      keySpecies: ["Indian Rhinoceros", "Swamp Deer", "Wild Buffalo"],
      threats: ["Agricultural conversion", "Overgrazing", "Invasive species"],
    },
    {
      name: "Wetlands",
      icon: <Droplets className="h-6 w-6" />,
      color: "bg-ecosystem-wetland",
      description: "Areas where water is the primary factor controlling environment",
      characteristics: [
        "Water saturation",
        "Unique vegetation",
        "Bird habitat",
        "Water purification",
      ],
      examples: "Sundarbans, Chilika Lake, Keoladeo Ghana",
      keySpecies: ["Gharial", "Sarus Crane", "Gangetic Dolphin"],
      threats: ["Pollution", "Drainage", "Climate change"],
    },
    {
      name: "Alpine Mountains",
      icon: <Mountain className="h-6 w-6" />,
      color: "bg-ecosystem-mountain",
      description: "High-altitude ecosystems above tree line",
      characteristics: [
        "Extreme cold",
        "Low oxygen",
        "Specialized flora",
        "Harsh conditions",
      ],
      examples: "Himalayas, Trans-Himalayas",
      keySpecies: ["Snow Leopard", "Himalayan Tahr", "Red Panda"],
      threats: ["Climate change", "Tourism", "Infrastructure development"],
    },
    {
      name: "Deserts",
      icon: <Wind className="h-6 w-6" />,
      color: "bg-ecosystem-desert",
      description: "Arid regions with minimal rainfall",
      characteristics: [
        "Low precipitation",
        "Extreme temperatures",
        "Adapted vegetation",
        "Sandy/rocky terrain",
      ],
      examples: "Thar Desert, Cold deserts of Ladakh",
      keySpecies: ["Great Indian Bustard", "Desert Fox", "Indian Gazelle"],
      threats: ["Desertification", "Water scarcity", "Overgrazing"],
    },
    {
      name: "Marine & Coastal",
      icon: <Waves className="h-6 w-6" />,
      color: "bg-ecosystem-ocean",
      description: "Oceanic and coastal ecosystems including mangroves",
      characteristics: [
        "Salt tolerance",
        "Tidal influence",
        "Rich fisheries",
        "Mangrove forests",
      ],
      examples: "Sundarbans, Gulf of Kutch, Andaman Sea",
      keySpecies: ["Olive Ridley Turtle", "Dugong", "Saltwater Crocodile"],
      threats: ["Overfishing", "Pollution", "Coastal development"],
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">Ecosystem Types</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            India's diverse landscapes host a variety of ecosystems, each supporting
            unique communities of plants and animals
          </p>
        </div>

        {/* Ecosystems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ecosystems.map((ecosystem, index) => (
            <Card
              key={index}
              className="p-6 hover-lift transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${ecosystem.color} text-white flex-shrink-0`}
                  >
                    {ecosystem.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{ecosystem.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ecosystem.description}
                    </p>
                  </div>
                </div>

                {/* Characteristics */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Characteristics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {ecosystem.characteristics.map((char, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    Examples in India:
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {ecosystem.examples}
                  </p>
                </div>

                {/* Key Species */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Key Species:</h4>
                  <div className="flex flex-wrap gap-1">
                    {ecosystem.keySpecies.map((species, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Threats */}
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    Major Threats
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {ecosystem.threats.map((threat, idx) => (
                      <Badge
                        key={idx}
                        variant="destructive"
                        className="text-xs bg-destructive/20 text-destructive hover:bg-destructive/30"
                      >
                        {threat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <h2 className="text-2xl font-bold">Ecosystem Services</h2>
            <p className="text-muted-foreground">
              Ecosystems provide essential services including clean air and water,
              climate regulation, food production, and cultural values. Protecting
              these ecosystems is crucial for human well-being and biodiversity
              conservation.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Ecosystems;
