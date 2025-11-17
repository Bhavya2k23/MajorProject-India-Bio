import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MapComponent from "@/components/MapComponent";
import { MapPin, Info } from "lucide-react";

interface Species {
  id: number;
  common_name: string;
  species_name: string;
  status: string;
  zone: string;
  lat: number;
  lon: number;
  ecosystem: string;
}

const Map = () => {
  const [speciesData, setSpeciesData] = useState<Species[]>([]);

  useEffect(() => {
    fetch("/data/species.json")
      .then((res) => res.json())
      .then((data) => setSpeciesData(data))
      .catch((error) => console.error("Error loading species data:", error));
  }, []);

  const zoneCount = new Set(speciesData.map((s) => s.zone)).size;

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
            Visualize the distribution of species across India's biogeographical zones
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {speciesData.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Species</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{zoneCount}</div>
            <div className="text-sm text-muted-foreground">Zones Covered</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {speciesData.filter((s) => s.status === "Endangered" || s.status === "Critically Endangered").length}
            </div>
            <div className="text-sm text-muted-foreground">At Risk</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(speciesData.map((s) => s.ecosystem)).size}
            </div>
            <div className="text-sm text-muted-foreground">Ecosystems</div>
          </Card>
        </div>

        {/* Map */}
        <Card className="p-6 mb-8 animate-slide-up">
          <MapComponent species={speciesData} />
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Info className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">How to Use</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click markers to view species details</li>
                  <li>• Color indicates conservation status</li>
                  <li>• Zoom in/out for better visualization</li>
                  <li>• Markers show representative locations</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-accent rounded-lg">
                <MapPin className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Distribution Insights</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Species distribution reflects habitat preferences and biogeographical history
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Western Ghats</Badge>
                  <Badge variant="outline" className="text-xs">Himalayas</Badge>
                  <Badge variant="outline" className="text-xs">Northeast</Badge>
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
