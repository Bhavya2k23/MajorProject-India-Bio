import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Heart, Loader2, X, Leaf, ChevronLeft, ChevronRight } from "lucide-react";

interface Species {
  id: string;
  species_name: string;
  common_name: string;
  zone: string;
  ecosystem: string;
  status: string;
  description?: string;
}

interface Suggestion {
  id: string;
  name: string;
  scientificName: string;
  conservationStatus: string;
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

import { useFavorites } from "@/context/FavoritesContext";

const SkeletonCard = () => (
  <div className="rounded-2xl border border-border bg-card shadow-sm animate-pulse p-5 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-6 bg-muted rounded-md w-3/4" />
        <div className="h-4 bg-muted rounded-md w-1/2" />
      </div>
      <div className="h-8 w-8 bg-muted rounded-full ml-2" />
    </div>
    <div className="h-5 w-24 bg-muted rounded-full" />
  </div>
);

const Plants = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  // ── State ──
  const [speciesData, setSpeciesData] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Data Fetching (Runs Once) ──
  useEffect(() => {
    let isMounted = true;
    
    setLoading(true);
    setError(null);

    // Fetching large dataset
    fetch(`${API_BASE}/plants?limit=2000`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        
        const rawSpecies = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

        // Deduplication Logic - ensuring strict uniqueness by Scientific Name
        const uniqueMap = new Map<string, Species>();
        
        rawSpecies.forEach((s: any) => {
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
            });
          }
        });

        // Sort alphabetically by common name
        const sortedSpecies = Array.from(uniqueMap.values()).sort((a, b) => 
          a.common_name.localeCompare(b.common_name)
        );

        setSpeciesData(sortedSpecies);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("❌ API Fetch Error:", err);
        setError("Failed to load plant data. Please try again later.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // ── Optimized Filtering & Memoization ──
  const filteredSpecies = useMemo(() => {
    return speciesData.filter((s) => {
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesSearch = 
          s.common_name.toLowerCase().includes(q) ||
          s.species_name.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }
      
      // Selectors
      if (selectedZone !== "all" && s.zone.toLowerCase() !== selectedZone.toLowerCase()) return false;
      if (selectedEcosystem !== "all" && s.ecosystem.toLowerCase() !== selectedEcosystem.toLowerCase()) return false;
      if (selectedStatus !== "all" && s.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      
      // Favorites
      if (showFavoritesOnly && !favorites.includes(s.id)) return false;
      
      return true;
    });
  }, [speciesData, searchTerm, selectedZone, selectedEcosystem, selectedStatus, showFavoritesOnly, favorites]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedZone, selectedEcosystem, selectedStatus, showFavoritesOnly]);

  // ── Pagination Calculation ──
  const totalPages = Math.max(1, Math.ceil(filteredSpecies.length / ITEMS_PER_PAGE));
  const paginatedSpecies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSpecies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSpecies, currentPage]);

  // ── Derived Dropdown Options ──
  const zones = useMemo(() => [...new Set(speciesData.map((s) => s.zone))].filter(z => z !== "Unknown").sort(), [speciesData]);
  const ecosystems = useMemo(() => [...new Set(speciesData.map((s) => s.ecosystem))].filter(e => e !== "Unknown").sort(), [speciesData]);
  const statuses = useMemo(() => [...new Set(speciesData.map((s) => s.status))].filter(s => s !== "unknown").sort(), [speciesData]);

  // ── Handlers ──
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedZone("all");
    setSelectedEcosystem("all");
    setSelectedStatus("all");
    setShowFavoritesOnly(false);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  // Suggestions API
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/search/suggestions?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        }
      } catch {
        // Silent catch for suggestions
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    fetchSuggestions(val);
  };

  // Click outside listener for suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasActiveFilters = searchTerm || selectedZone !== "all" || selectedEcosystem !== "all" || selectedStatus !== "all" || showFavoritesOnly;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-2">
            <Leaf className="h-4 w-4" />
            Plant Directory
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Explore India's Flora</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover India's diverse plant life — fully optimized data index.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="mb-8 space-y-4 bg-card border border-border rounded-2xl p-5 shadow-sm">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search plants by name or scientific name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="pl-10 pr-10 h-11"
              autoComplete="off"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(""); setSuggestions([]); setShowSuggestions(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {suggestionsLoading && (
              <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary z-10" />
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((s) => {
                  const badgeCls = STATUS_BADGE[(s.conservationStatus || "").toLowerCase()] || "bg-secondary text-secondary-foreground border-transparent";
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        navigate(`/plants/${s.id}`);
                        setShowSuggestions(false);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left border-b border-border/40 last:border-0"
                    >
                      <div>
                        <span className="font-medium text-sm">{formatName(s.name)}</span>
                        <span className="text-xs text-muted-foreground italic ml-2">{formatName(s.scientificName)}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeCls} whitespace-nowrap`}>
                        {s.conservationStatus}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="h-10"><SelectValue placeholder="All Zones" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedEcosystem} onValueChange={setSelectedEcosystem}>
              <SelectTrigger className="h-10"><SelectValue placeholder="All Ecosystems" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ecosystems</SelectItem>
                {ecosystems.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                {showFavoritesOnly ? "Showing Favorites" : "My Favorites"}
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3 mr-1" /> Clear all
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {loading ? (
                <span className="flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin" /> Fetching database...</span>
              ) : (
                <span>Showing <strong>{filteredSpecies.length}</strong> unique plants</span>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {error ? (
          <div className="text-center py-20 text-red-500 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-2xl">
            <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paginatedSpecies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {paginatedSpecies.map((species) => {
                const isFavorite = favorites.includes(species.id);
                const badgeCls = STATUS_BADGE[species.status] || "bg-secondary text-secondary-foreground border-border";
                
                return (
                  <div 
                    key={species.id} 
                    className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between h-full gap-4 group"
                    onClick={() => navigate(`/plants/${species.id}`)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                          {species.common_name}
                        </h3>
                        <p className="text-sm text-muted-foreground italic">
                          {species.species_name}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => toggleFavorite(e, species.id)}
                        className={`shrink-0 p-2 rounded-full transition-colors ${
                          isFavorite 
                            ? "bg-green-100 text-green-600 hover:bg-green-200" 
                            : "bg-muted text-muted-foreground hover:bg-green-50 hover:text-green-600"
                        }`}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No plants found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Adjust your filters or search term to find what you're looking for.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plants;
