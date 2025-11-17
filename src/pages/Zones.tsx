import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trees, Droplets, Mountain, Sun } from "lucide-react";

const Zones = () => {
  const zones = [
    {
      name: "Trans-Himalayan",
      icon: <Mountain className="h-6 w-6" />,
      description: "Cold desert ecosystem with unique adapted species",
      states: ["Ladakh", "Lahaul-Spiti"],
      species: ["Snow Leopard", "Tibetan Wild Ass", "Tibetan Antelope"],
      color: "bg-ecosystem-mountain",
    },
    {
      name: "Himalayan",
      icon: <Mountain className="h-6 w-6" />,
      description: "Rich temperate and alpine forests",
      states: ["J&K", "Himachal", "Uttarakhand", "Sikkim", "Arunachal"],
      species: ["Red Panda", "Himalayan Black Bear", "Musk Deer"],
      color: "bg-ecosystem-mountain",
    },
    {
      name: "Desert",
      icon: <Sun className="h-6 w-6" />,
      description: "Hot and cold desert ecosystems",
      states: ["Rajasthan", "Gujarat", "Parts of Punjab & Haryana"],
      species: ["Great Indian Bustard", "Desert Fox", "Indian Gazelle"],
      color: "bg-ecosystem-desert",
    },
    {
      name: "Semi-Arid",
      icon: <Trees className="h-6 w-6" />,
      description: "Dry deciduous forests and scrublands",
      states: ["Gujarat", "Rajasthan", "Madhya Pradesh"],
      species: ["Asiatic Lion", "Indian Wolf", "Nilgai"],
      color: "bg-status-threatened",
    },
    {
      name: "Western Ghats",
      icon: <Trees className="h-6 w-6" />,
      description: "Biodiversity hotspot with high endemism",
      states: ["Maharashtra", "Goa", "Karnataka", "Kerala", "Tamil Nadu"],
      species: ["Lion-tailed Macaque", "Nilgiri Tahr", "Malabar Giant Squirrel"],
      color: "bg-ecosystem-forest",
    },
    {
      name: "Deccan Peninsula",
      icon: <Trees className="h-6 w-6" />,
      description: "Dry tropical forests and grasslands",
      states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Telangana"],
      species: ["Sloth Bear", "Four-horned Antelope", "Indian Pangolin"],
      color: "bg-status-threatened",
    },
    {
      name: "Gangetic Plain",
      icon: <Droplets className="h-6 w-6" />,
      description: "Rich alluvial plains and wetlands",
      states: ["Punjab", "Haryana", "UP", "Bihar"],
      species: ["Gangetic Dolphin", "Swamp Deer", "Sarus Crane"],
      color: "bg-ecosystem-wetland",
    },
    {
      name: "North-East India",
      icon: <Trees className="h-6 w-6" />,
      description: "Mega biodiversity region with rich forests",
      states: ["Assam", "Meghalaya", "Tripura", "Mizoram", "Manipur", "Nagaland"],
      species: ["Hoolock Gibbon", "Clouded Leopard", "Pygmy Hog"],
      color: "bg-ecosystem-forest",
    },
    {
      name: "Islands",
      icon: <Droplets className="h-6 w-6" />,
      description: "Unique island ecosystems",
      states: ["Andaman & Nicobar", "Lakshadweep"],
      species: ["Andaman Wild Pig", "Nicobar Megapode", "Dugong"],
      color: "bg-ecosystem-ocean",
    },
    {
      name: "Coastal",
      icon: <Droplets className="h-6 w-6" />,
      description: "Mangroves, estuaries, and marine biodiversity",
      states: ["Gujarat", "Maharashtra", "Goa", "Karnataka", "Kerala", "Tamil Nadu", "Andhra Pradesh", "Odisha", "West Bengal"],
      species: ["Olive Ridley Turtle", "Fishing Cat", "Saltwater Crocodile"],
      color: "bg-ecosystem-ocean",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
            <MapPin className="h-4 w-4" />
            10 Biogeographical Zones
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Biogeographical Zones of India
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            India is divided into 10 distinct biogeographical zones based on climate,
            vegetation, and wildlife distribution patterns
          </p>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone, index) => (
            <Card
              key={index}
              className="p-6 hover-lift transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${zone.color} text-white`}>
                    {zone.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {zone.states.length} {zone.states.length === 1 ? 'State' : 'States'}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">{zone.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {zone.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Key Species:</h4>
                  <div className="flex flex-wrap gap-1">
                    {zone.species.map((species, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Coverage:</h4>
                  <p className="text-xs text-muted-foreground">
                    {zone.states.join(", ")}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <h2 className="text-2xl font-bold">Why Biogeographical Zones Matter</h2>
            <p className="text-muted-foreground">
              Understanding biogeographical zones helps in conservation planning, habitat
              protection, and studying species distribution patterns. Each zone has unique
              climate conditions, vegetation types, and wildlife communities that have
              evolved over millions of years.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">10</div>
                <div className="text-xs text-muted-foreground">Zones</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">3.3M</div>
                <div className="text-xs text-muted-foreground">km² Area</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Wildlife Sanctuaries</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-xs text-muted-foreground">National Parks</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Zones;
