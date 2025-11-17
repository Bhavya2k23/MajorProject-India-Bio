import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Heart } from "lucide-react";
import SpeciesCard from "@/components/SpeciesCard";
import SpeciesModal from "@/components/SpeciesModal";

interface Species {
  id: number;
  species_name: string;
  common_name: string;
  zone: string;
  ecosystem: string;
  status: string;
  lat: number;
  lon: number;
  description?: string;
  population?: string;
  threats?: string[];
}

const Species = () => {
  const [speciesData, setSpeciesData] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Load species data
    fetch("/data/species.json")
      .then((res) => res.json())
      .then((data) => {
        setSpeciesData(data);
        setFilteredSpecies(data);
      })
      .catch((error) => console.error("Error loading species data:", error));
  }, []);

  useEffect(() => {
    let filtered = speciesData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (species) =>
          species.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          species.species_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by zone
    if (selectedZone !== "all") {
      filtered = filtered.filter((species) => species.zone === selectedZone);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((species) => species.status === selectedStatus);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      filtered = filtered.filter((species) => favorites.includes(species.id));
    }

    setFilteredSpecies(filtered);
  }, [searchTerm, selectedZone, selectedStatus, showFavoritesOnly, speciesData]);

  const zones = [...new Set(speciesData.map((s) => s.zone))];
  const statuses = [...new Set(speciesData.map((s) => s.status))];

  const handleViewDetails = (species: Species) => {
    setSelectedSpecies(species);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">Species Directory</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore India's diverse wildlife and flora
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search species..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Zone Filter */}
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger>
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Favorites Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="gap-2"
            >
              <Heart
                className={`h-4 w-4 ${
                  showFavoritesOnly ? "fill-current" : ""
                }`}
              />
              {showFavoritesOnly ? "Showing Favorites" : "Show Favorites"}
            </Button>

            <div className="text-sm text-muted-foreground">
              Showing {filteredSpecies.length} of {speciesData.length} species
            </div>
          </div>
        </div>

        {/* Species Grid */}
        {filteredSpecies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecies.map((species, index) => (
              <div
                key={species.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <SpeciesCard
                  species={species}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No species found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search term
            </p>
          </div>
        )}

        {/* Species Detail Modal */}
        <SpeciesModal
          species={selectedSpecies}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </div>
  );
};

export default Species;
