import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Info, TreePine } from "lucide-react";
import { memo, useState, useEffect } from "react";

interface Species {
  id: any;
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
  images?: string[];
  imageUrl?: string;   // ← now populated in DB
}

interface SpeciesCardProps {
  species: Species;
  onViewDetails: (species: Species) => void;
}

// ─── Status badge colours ─────────────────────────────────────────────────────
const getStatusStyle = (status: string): string => {
  const s = status.toLowerCase();
  if (s === "critically endangered") return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
  if (s === "endangered")            return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
  if (s === "vulnerable")            return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
  if (s === "near threatened")       return "bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/20 dark:text-lime-400 dark:border-lime-800";
  if (s === "safe")                  return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
  return "bg-secondary text-secondary-foreground border-border";
};

import { resolveSpeciesImage } from "@/lib/imageUtils";

const SpeciesCard = ({ species, onViewDetails }: SpeciesCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => resolveSpeciesImage(species));
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    // Re-resolve if species data changes
    setImgSrc(resolveSpeciesImage(species));
    setImgFailed(false);
  }, [species]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(species.id));
  }, [species.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavorites = isFavorite
      ? favorites.filter((id: any) => id !== species.id)
      : [...favorites, species.id];
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleImgError = () => {
    if (!imgFailed) {
      setImgFailed(true);
      // Fallback to static generic nature image if main resolution totally fails
      setImgSrc("https://images.unsplash.com/photo-1500829243541-74b67eeccc18?w=800&q=80");
    }
  };

  const statusCls = getStatusStyle(species.status);

  return (
    <Card
      id={`species-card-${species.id}`}
      className="overflow-hidden hover-lift transition-all duration-300 group border-border hover:border-primary/40 hover:shadow-xl cursor-pointer"
      onClick={() => onViewDetails(species)}
    >
      {/* ── Image ── */}
      <div className="relative w-full h-52 overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt={`${species.common_name} — ${species.species_name}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          onError={handleImgError}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Favorite button (floats over image) */}
        <button
          id={`fav-btn-${species.id}`}
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-md ${
            isFavorite
              ? "bg-red-500 text-white scale-110"
              : "bg-white/85 text-gray-500 hover:bg-red-50 hover:text-red-500"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-white" : ""}`} />
        </button>

        {/* Status badge (bottom left over image) */}
        <div className="absolute bottom-3 left-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize shadow-sm backdrop-blur-sm bg-white/90 ${statusCls}`}>
            {species.status}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {species.common_name}
          </h3>
          <p className="text-xs text-muted-foreground italic mt-0.5 line-clamp-1">
            {species.species_name}
          </p>
        </div>

        {/* Zone & Ecosystem */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-[11px] gap-1 px-2 py-0.5 h-auto">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
            {species.zone}
          </Badge>
          <Badge variant="outline" className="text-[11px] gap-1 px-2 py-0.5 h-auto">
            <TreePine className="h-2.5 w-2.5 flex-shrink-0" />
            {species.ecosystem}
          </Badge>
        </div>

        {/* Description excerpt */}
        {species.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {species.description}
          </p>
        )}

        {/* CTA */}
        <Button
          variant="outline"
          className="w-full h-9 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          onClick={(e) => { e.stopPropagation(); onViewDetails(species); }}
        >
          <Info className="h-3.5 w-3.5 mr-1.5" />
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default memo(SpeciesCard);