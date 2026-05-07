import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, MapPin, Leaf, AlertCircle, Info, Hash, Heart,
  Star, ChevronRight, Loader2, Users, Globe, TreePine, Zap,
} from "lucide-react";

interface SpeciesDetailData {
  _id: string;
  name: string;
  common_name: string;
  scientificName: string;
  species_name: string;
  conservationStatus: string;
  status: string;
  description: string;
  population?: number;
  habitatLoss?: number;
  pollutionLevel?: number;
  climateRisk?: number;
  threats?: string[];
  funFacts?: string[];
  habitat?: string;
  ecosystem?: string;
  zone?: string;
  type?: string;
}

interface RecommendedSpecies {
  _id: string;
  id?: string;
  name: string;
  common_name?: string;
  scientificName: string;
  species_name?: string;
  conservationStatus: string;
  status?: string;
  zone?: string;
  ecosystem?: string;
  type?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_COLORS: Record<string, { pill: string; glow: string }> = {
  "safe":                  { pill: "bg-green-500/10 text-green-600 border-green-400/30",   glow: "from-green-500/10" },
  "near threatened":       { pill: "bg-lime-500/10 text-lime-600 border-lime-400/30",      glow: "from-lime-500/10" },
  "vulnerable":            { pill: "bg-yellow-400/10 text-yellow-600 border-yellow-300/30", glow: "from-yellow-400/10" },
  "endangered":            { pill: "bg-orange-500/10 text-orange-600 border-orange-400/30", glow: "from-orange-500/10" },
  "critically endangered": { pill: "bg-red-500/10 text-red-600 border-red-400/30",         glow: "from-red-500/10" },
};

const formatName = (name: string): string => {
  if (!name || name === "Unknown") return "Unknown";
  return name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

const getRiskBar = (value?: number) => {
  if (value === undefined || value === null) return null;
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 70 ? "bg-red-500" : pct >= 40 ? "bg-orange-400" : "bg-emerald-500";
  return { pct, color };
};

const RecCard = ({ sp }: { sp: RecommendedSpecies }) => {
  const commonName = formatName(sp.name || sp.common_name || "Unknown");
  const sciName = formatName(sp.scientificName || sp.species_name || "Unknown");
  const status = (sp.conservationStatus || sp.status || "Unknown").toLowerCase();
  
  const statusStyle = STATUS_COLORS[status]?.pill || "bg-secondary text-secondary-foreground border-border";
  
  return (
    <Link
      to={`/plants/${sp._id || sp.id}`}
      className="group flex-shrink-0 w-64 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col p-5 gap-3 h-[140px]"
    >
      <div className="flex flex-col gap-1 flex-1">
        <p className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {commonName}
        </p>
        <p className="text-xs text-muted-foreground italic line-clamp-1">{sciName}</p>
      </div>
      <div>
        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${statusStyle}`}>
          {status}
        </span>
      </div>
    </Link>
  );
};

import { useFavorites } from "@/context/FavoritesContext";

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [species, setSpecies] = useState<SpeciesDetailData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const recScrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    let isMounted = true;

    Promise.all([
      fetch(`${API_BASE}/plants/${id}`).then((r) => r.json()).catch(() => ({ success: false })),
      fetch(`${API_BASE}/plants/recommendations/${id}`).then((r) => r.json()).catch(() => ({ success: false })),
    ])
      .then(([speciesRes, recRes]) => {
        if (!isMounted) return;
        
        if (speciesRes.success || speciesRes._id || speciesRes.id) {
          const data = speciesRes.data || speciesRes;
          setSpecies(data);
        } else {
          setError("Plant species not found");
        }
        
        if (recRes.success || Array.isArray(recRes)) {
          setRecommendations(recRes.data || recRes || []);
        }
      })
      .catch(() => { if (isMounted) setError("Failed to load plant details"); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [id]);

  const scrollRec = (dir: "left" | "right") => {
    if (!recScrollRef.current) return;
    recScrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p>Loading beautifully formatted details…</p>
        </div>
      </div>
    );
  }

  if (error || !species) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold text-destructive">{error || "Plant species not found"}</h2>
        <Button onClick={() => navigate("/plants")} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Flora Directory
        </Button>
      </div>
    );
  }

  const commonName = formatName(species.name || species.common_name || "Unknown");
  const sciName = formatName(species.scientificName || species.species_name || "Unknown");
  const status = (species.conservationStatus || species.status || "Unknown").toLowerCase();
  
  const statusStyle = STATUS_COLORS[status] || {
    pill: "bg-secondary text-secondary-foreground border-border",
    glow: "from-primary/5",
  };

  const habitatLossBar   = getRiskBar(species.habitatLoss);
  const pollutionBar     = getRiskBar(species.pollutionLevel);
  const climateRiskBar   = getRiskBar(species.climateRisk);

  const isFav = species ? isFavorite(species._id || (species as any).id) : false;

  return (
    <div className="min-h-screen pb-16">
      <div className={`absolute top-0 inset-x-0 h-96 bg-gradient-to-b ${statusStyle.glow} to-transparent pointer-events-none -z-10`} />

      <div className="container mx-auto px-4 max-w-4xl pt-24">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/plants")}
            className="text-muted-foreground hover:text-foreground -ml-3 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Flora
          </Button>

          <Button
            variant={isFav ? "default" : "outline"}
            size="sm"
            onClick={(e) => species && toggleFavorite(e, species._id || (species as any).id)}
            className={`gap-2 transition-all ${isFav ? "bg-red-500 hover:bg-red-600 border-red-500 text-white shadow-sm" : ""}`}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-white" : ""}`} />
            {isFav ? "Saved to Favorites" : "Save Plant"}
          </Button>
        </div>

        {/* ── Header ── */}
        <div className="animate-slide-up bg-card border border-border p-8 md:p-12 rounded-3xl shadow-sm mb-8 text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border capitalize shadow-sm ${statusStyle.pill}`}>
              {status}
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 shadow-sm">
              Flora
            </span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
              {commonName}
            </h1>
            <p className="text-xl italic text-muted-foreground">
              {sciName}
            </p>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {species.description || "Detailed botanical description is currently not available for this species."}
          </p>
        </div>

        {/* ── Details Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="p-5 bg-card border border-border rounded-2xl flex gap-4 items-center shadow-sm">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Leaf className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Habitat</p>
              <p className="text-base font-medium">{formatName(species.habitat || species.ecosystem || "Not Documented")}</p>
            </div>
          </div>
          
          <div className="p-5 bg-card border border-border rounded-2xl flex gap-4 items-center shadow-sm">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Zone / Region</p>
              <p className="text-base font-medium">{formatName(species.zone || "Not Documented")}</p>
            </div>
          </div>
          
          <div className="p-5 bg-card border border-border rounded-2xl flex gap-4 items-center shadow-sm">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <TreePine className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Ecosystem</p>
              <p className="text-base font-medium">{formatName(species.ecosystem || "Not Documented")}</p>
            </div>
          </div>
          
          <div className="p-5 bg-card border border-border rounded-2xl flex gap-4 items-center shadow-sm">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-0.5">Population Estimate</p>
              <p className="text-base font-medium">{species.population != null ? species.population.toLocaleString() : "Data Unavailable"}</p>
            </div>
          </div>
        </div>

        {/* ── Risk Indicators ── */}
        {(habitatLossBar || pollutionBar || climateRiskBar) && (
          <div className="p-6 bg-card border border-border rounded-3xl space-y-5 mb-8 shadow-sm">
            <p className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Threat & Environmental Indicators
            </p>
            <div className="space-y-4">
              {habitatLossBar && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Habitat Loss Index</span>
                    <span className="font-bold">{habitatLossBar.pct}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${habitatLossBar.color}`} style={{ width: `${habitatLossBar.pct}%` }} />
                  </div>
                </div>
              )}
              {pollutionBar && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Pollution Vulnerability</span>
                    <span className="font-bold">{pollutionBar.pct}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pollutionBar.color}`} style={{ width: `${pollutionBar.pct}%` }} />
                  </div>
                </div>
              )}
              {climateRiskBar && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Climate Change Risk</span>
                    <span className="font-bold">{climateRiskBar.pct}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${climateRiskBar.color}`} style={{ width: `${climateRiskBar.pct}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Threats ── */}
        {species.threats && species.threats.length > 0 && (
          <section className="mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Primary Threats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {species.threats.map((threat, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">{threat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Recommendations ── */}
        {recommendations.length > 0 && (
          <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Related Flora
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover more plants sharing similar ecosystems or zones.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => scrollRec("left")} className="h-9 w-9">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => scrollRec("right")} className="h-9 w-9">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div ref={recScrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide py-1 px-1 -mx-1">
              {recommendations.map((rec) => (
                <RecCard key={rec._id || rec.id} sp={rec} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="p-5 mt-12 bg-primary/5 border border-primary/15 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Info className="h-5 w-5 text-primary" />
            <span className="font-medium">Data sourced from the optimized India Biodiversity Database</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/biodiversity")}>
            View Biodiversity Insights →
          </Button>
        </div>
      </div>
    </div>
  );
}