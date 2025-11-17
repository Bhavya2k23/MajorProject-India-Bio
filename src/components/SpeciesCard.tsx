import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Info } from "lucide-react";
import { useState, useEffect } from "react";

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

interface SpeciesCardProps {
  species: Species;
  onViewDetails: (species: Species) => void;
}

const SpeciesCard = ({ species, onViewDetails }: SpeciesCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(species.id));
  }, [species.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((id: number) => id !== species.id);
    } else {
      newFavorites = [...favorites, species.id];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "least concern":
        return "bg-status-safe text-status-safe-foreground";
      case "vulnerable":
      case "near threatened":
        return "bg-status-threatened text-status-threatened-foreground";
      case "endangered":
        return "bg-status-endangered text-status-endangered-foreground";
      case "critically endangered":
        return "bg-status-critical text-status-critical-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="overflow-hidden hover-lift transition-all group">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
              {species.common_name}
            </h3>
            <p className="text-sm text-muted-foreground italic">
              {species.species_name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            className="hover:scale-110 transition-transform"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(species.status)}>
            {species.status}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {species.zone}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Ecosystem:</span> {species.ecosystem}
        </div>

        {species.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {species.description}
          </p>
        )}

        <Button
          variant="outline"
          className="w-full group/btn"
          onClick={() => onViewDetails(species)}
        >
          <Info className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default SpeciesCard;
