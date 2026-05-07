import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trees, Droplets, Mountain, Wind, Waves, 
  ChevronLeft, ChevronRight, Leaf, Heart, ArrowLeft, Loader2 
} from "lucide-react";

interface Species {
  id: string;
  species_name: string;
  common_name: string;
  zone: string;
  ecosystem: string;
  status: string;
  description?: string;
  type: "animal" | "plant";
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_BADGE: Record<string, string> = {
  "critically endangered": "bg-red-100 text-red-700 border-red-200",
  endangered:             "bg-orange-100 text-orange-700 border-orange-200",
  vulnerable:             "bg-yellow-100 text-yellow-700 border-yellow-200",
  "near threatened":      "bg-lime-100 text-lime-700 border-lime-200",
  safe:                   "bg-green-100 text-green-700 border-green-200",
};

const formatName = (name: string): string => {
  if (!name || name === "Unknown") return "Unknown";
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ecosystemDefinitions = [
  {
    name: "Tropical Forest",
    icon: <Trees className="h-6 w-6" />,
    color: "bg-emerald-600",
    description: "Dense evergreen and semi-evergreen forests with high rainfall and massive biodiversity.",
    characteristics: ["High biodiversity", "Multi-layered canopy", "High humidity"],
    threats: ["Deforestation", "Logging"],
  },
  {
    name: "Deciduous Forest",
    icon: <Trees className="h-6 w-6" />,
    color: "bg-orange-600",
    description: "Forests where trees shed their leaves seasonally, dominating central and southern India.",
    characteristics: ["Seasonal leaf shed", "Dry winters", "Rich undergrowth"],
    threats: ["Forest fires", "Expansion"],
  },
  {
    name: "Grassland",
    icon: <Wind className="h-6 w-6" />,
    color: "bg-lime-600",
    description: "Open landscapes dominated by grasses and shrubs, vital for massive herbivores.",
    characteristics: ["Seasonal rainfall", "Rich soil", "Fire-adapted"],
    threats: ["Agricultural conversion", "Overgrazing"],
  },
  {
    name: "Wetland",
    icon: <Droplets className="h-6 w-6" />,
    color: "bg-blue-500",
    description: "Areas where water saturation dictates the environment, filtering water naturally.",
    characteristics: ["Water saturation", "Unique vegetation", "Bird habitat"],
    threats: ["Pollution", "Drainage"],
  },
  {
    name: "Alpine",
    icon: <Mountain className="h-6 w-6" />,
    color: "bg-slate-600",
    description: "High-altitude ecosystems above the tree line in the Himalayas.",
    characteristics: ["Extreme cold", "Low oxygen", "Specialized flora"],
    threats: ["Climate change", "Tourism impact"],
  },
  {
    name: "Desert",
    icon: <Wind className="h-6 w-6" />,
    color: "bg-amber-600",
    description: "Arid, dry regions with minimal rainfall and extreme temperatures.",
    characteristics: ["Low precipitation", "Adapted vegetation", "Sandy/rocky"],
    threats: ["Desertification", "Water scarcity"],
  },
  {
    name: "Coastal",
    icon: <Waves className="h-6 w-6" />,
    color: "bg-cyan-600",
    description: "Shorelines and beaches where the land meets the ocean.",
    characteristics: ["Salt tolerance", "Tidal influence", "Sandy shores"],
    threats: ["Coastal development", "Erosion"],
  },
  {
    name: "Mangrove",
    icon: <Trees className="h-6 w-6" />,
    color: "bg-teal-700",
    description: "Coastal saline or brackish water forests, acting as natural disaster buffers.",
    characteristics: ["Saltwater roots", "Tidal zones", "Rich nurseries"],
    threats: ["Sea level rise", "Aquaculture"],
  }
];

import { useFavorites } from "@/context/FavoritesContext";

const SkeletonCard = () => (
  <div className="rounded-2xl border border-border bg-card shadow-sm animate-pulse p-5 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-6 bg-muted rounded-md w-3/4" />
        <div className="h-4 bg-muted rounded-md w-1/2" />
      </div>
    </div>
    <div className="h-5 w-24 bg-muted rounded-full" />
  </div>
);

const Ecosystems = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  // Data State
  const [animalsData, setAnimalsData] = useState<Species[]>([]);
  const [plantsData, setPlantsData] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction State
  const [activeEcosystem, setActiveEcosystem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"animals" | "plants">("animals");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 24;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch(`${API_BASE}/animals?limit=2000`).then(res => res.ok ? res.json() : []),
      fetch(`${API_BASE}/plants?limit=2000`).then(res => res.ok ? res.json() : [])
    ])
    .then(([animalsRes, plantsRes]) => {
      if (!isMounted) return;

      const deduplicate = (data: any, type: "animal" | "plant") => {
        const raw = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        const uniqueMap = new Map<string, Species>();
        
        raw.forEach((s: any) => {
          const rawSciName = (s.scientificName || s.species_name || "");
          const key = rawSciName.trim().toLowerCase() || (s._id || Math.random().toString());
          
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
              id: s._id || s.id || key,
              common_name: formatName(s.name || s.common_name || "Unknown Species"),
              species_name: formatName(rawSciName || "Unknown"),
              status: (s.conservationStatus || s.status || "Unknown").toLowerCase(),
              zone: s.zone || "Unknown",
              ecosystem: s.ecosystem || "Unknown",
              description: s.description || "",
              type
            });
          }
        });
        
        return Array.from(uniqueMap.values()).sort((a, b) => a.common_name.localeCompare(b.common_name));
      };

      setAnimalsData(deduplicate(animalsRes, "animal"));
      setPlantsData(deduplicate(plantsRes, "plant"));
    })
    .catch(err => {
      if (!isMounted) return;
      console.error(err);
      setError("Failed to fetch ecosystem data.");
    })
    .finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  // Filter species for active ecosystem
  const activeSpecies = useMemo(() => {
    if (!activeEcosystem) return [];
    const sourceData = activeTab === "animals" ? animalsData : plantsData;
    return sourceData.filter(s => s.ecosystem.toLowerCase() === activeEcosystem.toLowerCase());
  }, [activeEcosystem, activeTab, animalsData, plantsData]);

  const totalPages = Math.max(1, Math.ceil(activeSpecies.length / ITEMS_PER_PAGE));
  const paginatedSpecies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return activeSpecies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [activeSpecies, currentPage]);

  // Reset page when switching tabs or ecosystems
  useEffect(() => {
    setCurrentPage(1);
  }, [activeEcosystem, activeTab]);

  if (error) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center p-8 border border-red-200 bg-red-50 rounded-2xl text-red-500">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // --- RENDER DETAIL VIEW ---
  if (activeEcosystem) {
    const ecoDef = ecosystemDefinitions.find(e => e.name === activeEcosystem);
    const totalAnimals = animalsData.filter(a => a.ecosystem.toLowerCase() === activeEcosystem.toLowerCase()).length;
    const totalPlants = plantsData.filter(p => p.ecosystem.toLowerCase() === activeEcosystem.toLowerCase()).length;

    return (
      <div className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
            onClick={() => setActiveEcosystem(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ecosystems
          </Button>

          {ecoDef && (
            <div className={`p-8 rounded-3xl mb-8 text-white ${ecoDef.color} shadow-lg`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  {ecoDef.icon}
                </div>
                <h1 className="text-4xl font-bold">{ecoDef.name}</h1>
              </div>
              <p className="text-white/90 text-lg max-w-3xl mb-6">
                {ecoDef.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {ecoDef.characteristics.map((c, i) => (
                  <Badge key={i} variant="outline" className="bg-white/10 text-white border-white/20">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-border mb-8 pb-4">
            <button
              className={`text-lg font-semibold pb-4 -mb-[17px] transition-colors border-b-2 ${
                activeTab === "animals" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
              onClick={() => setActiveTab("animals")}
            >
              Animals ({totalAnimals})
            </button>
            <button
              className={`text-lg font-semibold pb-4 -mb-[17px] transition-colors border-b-2 ${
                activeTab === "plants" ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
              onClick={() => setActiveTab("plants")}
            >
              Plants ({totalPlants})
            </button>
          </div>

          {/* Grid */}
          {activeSpecies.length === 0 ? (
             <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
               <Leaf className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
               <h3 className="text-lg font-semibold mb-2">No {activeTab} found</h3>
               <p className="text-sm text-muted-foreground">
                 We haven't indexed any {activeTab} specifically for the {activeEcosystem} ecosystem yet.
               </p>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {paginatedSpecies.map(species => {
                  const isFavorite = favorites.includes(species.id);
                  const badgeCls = STATUS_BADGE[species.status] || "bg-secondary text-secondary-foreground border-border";
                  const linkType = species.type === "animal" ? "animals" : "plants";

                  return (
                    <div 
                      key={species.id} 
                      className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between gap-4 group"
                      onClick={() => navigate(`/${linkType}/${species.id}`)}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                            {species.common_name}
                          </h3>
                          <p className="text-sm text-muted-foreground italic line-clamp-1">
                            {species.species_name}
                          </p>
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(e, species.id)}
                          className={`shrink-0 p-2 rounded-full transition-colors ${
                            isFavorite 
                              ? "bg-red-100 text-red-500 hover:bg-red-200" 
                              : "bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-500"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                        </button>
                      </div>
                      <div>
                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${badgeCls}`}>
                          {species.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER HUB VIEW ---
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-2">
            <Trees className="h-4 w-4" />
            Habitats & Biomes
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Ecosystems of India</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore diverse landscapes holding over 3,000 perfectly indexed, unique species.
          </p>
        </div>

        {/* Global Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Indexing 3000+ unique species data across ecosystems...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ecosystemDefinitions.map((eco, index) => {
              const animalCount = animalsData.filter(a => a.ecosystem.toLowerCase() === eco.name.toLowerCase()).length;
              const plantCount = plantsData.filter(p => p.ecosystem.toLowerCase() === eco.name.toLowerCase()).length;
              const totalSpecies = animalCount + plantCount;

              return (
                <Card
                  key={index}
                  onClick={() => setActiveEcosystem(eco.name)}
                  className="overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className={`h-2 w-full ${eco.color}`} />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${eco.color} text-white`}>
                        {eco.icon}
                      </div>
                      <Badge variant="outline" className="font-semibold px-3 py-1 bg-primary/5">
                        {totalSpecies} Species
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {eco.name}
                    </h3>
                    <p className="text-muted-foreground text-sm flex-1 mb-6 line-clamp-3">
                      {eco.description}
                    </p>

                    <div className="space-y-4 mt-auto">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-2 text-muted-foreground">
                          <span>Animals Indexed: {animalCount}</span>
                          <span>Plants Indexed: {plantCount}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 flex overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${(animalCount / (totalSpecies || 1)) * 100}%` }} />
                          <div className="bg-emerald-500 h-full" style={{ width: `${(plantCount / (totalSpecies || 1)) * 100}%` }} />
                        </div>
                      </div>

                      <Button className="w-full gap-2" variant="outline">
                        <Leaf className="h-4 w-4" />
                        Explore Ecosystem
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ecosystems;