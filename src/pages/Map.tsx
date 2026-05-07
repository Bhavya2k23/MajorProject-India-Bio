import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/MapComponent";
import { MapPin, Info, Cat, Leaf } from "lucide-react";

interface SpeciesPoint {
  id: any;
  common_name: string;
  species_name: string;
  status: string;
  zone: string;
  lat: number;
  lon: number;
  ecosystem: string;
  category: "animal" | "plant";
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getCoordinatesForZone = (zone: string): [number, number] => {
  const coordinates: Record<string, [number, number]> = {
    "Trans-Himalayan":     [34.1, 77.5],
    "Himalayan":           [27.5, 88.5],
    "Desert":              [26.9, 70.9],
    "Semi-Arid":           [23.0, 72.0],
    "Western Ghats":       [10.0, 77.0],
    "Deccan Plateau":      [17.0, 78.0],
    "Gangetic Plain":      [25.0, 82.0],
    "Indo-Gangetic Plain": [26.0, 81.0],
    "Central India":       [23.0, 80.0],
    "Eastern Ghats":       [16.0, 80.5],
    "North-East India":    [26.0, 92.0],
    "Coasts":              [15.0, 73.0],
    "Coastal":             [12.0, 75.0],
    "Islands":             [11.0, 92.0],
    "Deccan Peninsula":    [16.0, 76.0],
    "Thar Desert":         [26.9, 70.9],
  };
  const [baseLat, baseLon] = coordinates[zone] || [20.5937, 78.9629];
  return [baseLat + (Math.random() - 0.5) * 2, baseLon + (Math.random() - 0.5) * 2];
};

const Map = () => {
  const navigate = useNavigate();
  const [animalData, setAnimalData] = useState<SpeciesPoint[]>([]);
  const [plantData, setPlantData] = useState<SpeciesPoint[]>([]);
  const [activeTab, setActiveTab] = useState<"animals" | "plants" | "both">("both");
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [loadingPlants, setLoadingPlants] = useState(true);

  // Fetch animals
  useEffect(() => {
    setLoadingAnimals(true);
    fetch(`${API_BASE}/animals?limit=150`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.data || data;
        const mapped: SpeciesPoint[] = raw.map((s: any) => {
          const dbLat = s.coordinates?.lat ?? null;
          const dbLon = s.coordinates?.lng ?? null;
          const [fallbackLat, fallbackLon] = getCoordinatesForZone(s.zone);
          return {
            id: s._id,
            common_name: s.name,
            species_name: s.scientificName,
            status: s.conservationStatus,
            zone: s.zone,
            ecosystem: s.ecosystem,
            lat: dbLat ?? fallbackLat,
            lon: dbLon ?? fallbackLon,
            category: "animal",
          };
        });
        setAnimalData(mapped);
      })
      .catch((err) => console.error("Error loading animals for map:", err))
      .finally(() => setLoadingAnimals(false));
  }, []);

  // Fetch plants
  useEffect(() => {
    setLoadingPlants(true);
    fetch(`${API_BASE}/plants?limit=150`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.data || data;
        const mapped: SpeciesPoint[] = raw.map((s: any) => {
          const [fallbackLat, fallbackLon] = getCoordinatesForZone(s.zone);
          return {
            id: s._id,
            common_name: s.name,
            species_name: s.scientificName,
            status: s.conservationStatus,
            zone: s.zone,
            ecosystem: s.ecosystem,
            lat: fallbackLat,
            lon: fallbackLon,
            category: "plant",
          };
        });
        setPlantData(mapped);
      })
      .catch((err) => console.error("Error loading plants for map:", err))
      .finally(() => setLoadingPlants(false));
  }, []);

  const visibleData =
    activeTab === "animals" ? animalData :
    activeTab === "plants"  ? plantData  :
    [...animalData, ...plantData];

  const zoneCount = new Set(visibleData.map((s) => s.zone)).size;

  const handleMarkerClick = (id: any) => {
    // Find which category this id belongs to
    if (animalData.some((a) => a.id === id)) {
      navigate(`/animals/${id}`);
    } else {
      navigate(`/plants/${id}`);
    }
  };

  const isLoading = loadingAnimals || loadingPlants;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
            <MapPin className="h-4 w-4" />
            Interactive Species Map
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Map Explorer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualize the distribution of species across India's biogeographical zones.{" "}
            <span className="text-primary font-medium">Click any marker</span> to view species details.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            id="map-toggle-both"
            size="sm"
            variant={activeTab === "both" ? "default" : "outline"}
            onClick={() => setActiveTab("both")}
            className="gap-2"
          >
            🗺️ All Species
          </Button>
          <Button
            id="map-toggle-animals"
            size="sm"
            variant={activeTab === "animals" ? "default" : "outline"}
            onClick={() => setActiveTab("animals")}
            className="gap-2"
          >
            <Cat className="h-4 w-4" /> Animals
          </Button>
          <Button
            id="map-toggle-plants"
            size="sm"
            variant={activeTab === "plants" ? "default" : "outline"}
            onClick={() => setActiveTab("plants")}
            className="gap-2"
          >
            <Leaf className="h-4 w-4" /> Plants
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{isLoading ? "…" : visibleData.length}</div>
            <div className="text-sm text-muted-foreground">
              {activeTab === "both" ? "Total Species" : activeTab === "animals" ? "Animals" : "Plants"}
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{isLoading ? "…" : zoneCount}</div>
            <div className="text-sm text-muted-foreground">Zones Covered</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {isLoading ? "…" : visibleData.filter(
                (s) => s.status === "Endangered" || s.status === "Critically Endangered"
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">At Risk</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {isLoading ? "…" : new Set(visibleData.map((s) => s.ecosystem)).size}
            </div>
            <div className="text-sm text-muted-foreground">Ecosystems</div>
          </Card>
        </div>

        {/* Map */}
        <div className="mb-8 animate-slide-up">
          <MapComponent
            species={visibleData}
            onSpeciesClick={handleMarkerClick}
          />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary rounded-lg flex-shrink-0">
                <Info className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">How to Use</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Toggle between Animals, Plants, or All Species</li>
                  <li>• Click any marker to open the detail page</li>
                  <li>• Colour indicates conservation status</li>
                  <li>• Zoom in/out for better visualization</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent rounded-lg flex-shrink-0">
                <MapPin className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Distribution Insights</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Species distribution reflects habitat preferences and biogeographical history
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">Western Ghats</Badge>
                  <Badge variant="outline" className="text-xs">Himalayas</Badge>
                  <Badge variant="outline" className="text-xs">Northeast</Badge>
                  <Badge variant="outline" className="text-xs">Deccan Plateau</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Map;