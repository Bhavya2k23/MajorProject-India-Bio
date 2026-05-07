import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search, Cat, Leaf, X, ArrowRight, Loader2, Info, AlertCircle, Globe
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type Domain = "animals" | "plants";

interface SearchResult {
  _id: string;
  id?: string;
  name: string;
  common_name?: string;
  scientificName: string;
  species_name?: string;
  conservationStatus: string;
  status?: string;
  type?: string;
  zone?: string;
  ecosystem?: string;
  population?: number;
  description?: string;
  threats?: string[];
  uses?: string[];
  habitat?: string;
}

const STATUS_PILL: Record<string, string> = {
  "safe":                  "bg-green-100 text-green-700 border-green-200",
  "near threatened":       "bg-lime-100 text-lime-700 border-lime-200",
  "vulnerable":            "bg-yellow-100 text-yellow-700 border-yellow-200",
  "endangered":            "bg-orange-100 text-orange-700 border-orange-200",
  "critically endangered": "bg-red-100 text-red-700 border-red-200",
};

const formatName = (name: string): string => {
  if (!name || name === "Unknown") return "Unknown";
  return name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

function SearchSlot({
  slot,
  domain,
  value,
  onSelect,
  onClear,
}: {
  slot: 1 | 2;
  domain: Domain;
  value: SearchResult | null;
  onSelect: (r: SearchResult) => void;
  onClear: () => void;
}) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [loading, setLoading]   = useState(false);
  const [showList, setShowList] = useState(false);

  const search = useCallback(
    async (q: string) => {
      setQuery(q);
      if (q.trim().length < 2) { setResults([]); setShowList(false); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${domain}?search=${encodeURIComponent(q)}&limit=8`);
        const data = await res.json();
        const raw = Array.isArray(data) ? data : (data?.data ?? []);
        
        // Deduplicate
        const uniqueMap = new Map();
        raw.forEach((r: any) => {
           const sciName = (r.scientificName || r.species_name || "").toLowerCase().trim();
           if (!uniqueMap.has(sciName)) uniqueMap.set(sciName, r);
        });
        
        setResults(Array.from(uniqueMap.values()));
        setShowList(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    },
    [domain]
  );

  if (value) {
    const commonName = formatName(value.name || value.common_name || "Unknown");
    const sciName = formatName(value.scientificName || value.species_name || "Unknown");
    
    return (
      <div className="relative animate-fade-in">
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/30 rounded-xl shadow-sm">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base leading-tight">{commonName}</p>
            <p className="text-sm text-muted-foreground italic">{sciName}</p>
          </div>
          <button onClick={onClear} className="p-2 bg-background hover:bg-destructive/10 border border-border rounded-lg text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 shadow-sm">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={`compare-search-${slot}`}
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder={`Search ${domain === "animals" ? "animal" : "plant"} ${slot}…`}
          className="pl-9 h-11"
          onFocus={() => results.length > 0 && setShowList(true)}
          onBlur={() => setTimeout(() => setShowList(false), 200)}
          autoComplete="off"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {showList && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {results.map((r) => {
            const commonName = formatName(r.name || r.common_name || "Unknown");
            const sciName = formatName(r.scientificName || r.species_name || "Unknown");
            const status = (r.conservationStatus || r.status || "Unknown").toLowerCase();
            
            return (
              <button
                key={r._id || r.id}
                onMouseDown={() => { onSelect(r); setQuery(""); setShowList(false); }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors border-b border-border/40 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold line-clamp-1">{commonName}</p>
                  <p className="text-xs text-muted-foreground italic line-clamp-1">{sciName}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_PILL[status] || ""}`}>
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, a, b, highlight }: { label: string; a: any; b: any; highlight?: boolean }) {
  const same = String(a) === String(b);
  return (
    <tr className={highlight ? "bg-secondary/30" : ""}>
      <td className="px-4 py-3 text-sm font-semibold text-muted-foreground w-[20%] border-r border-border/40">{label}</td>
      <td className={`px-4 py-3 text-sm w-[35%] ${!same ? "text-primary font-medium" : ""}`}>{a || "—"}</td>
      <td className="px-2 py-3 text-center text-muted-foreground w-[10%]">
        {!same ? <span className="text-xs font-bold text-destructive/70 bg-destructive/10 px-1.5 py-0.5 rounded">DIFF</span> : <span className="text-xs font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">MATCH</span>}
      </td>
      <td className={`px-4 py-3 text-sm w-[35%] border-l border-border/40 ${!same ? "text-primary font-medium" : ""}`}>{b || "—"}</td>
    </tr>
  );
}

export default function Compare() {
  const navigate = useNavigate();
  const [domain, setDomain]   = useState<Domain>("animals");
  const [itemA, setItemA]     = useState<SearchResult | null>(null);
  const [itemB, setItemB]     = useState<SearchResult | null>(null);

  const canCompare = itemA && itemB;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="text-center mb-10 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
            <Globe className="h-4 w-4" />
            Species Comparison Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Compare Data</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select two species and compare their biological and environmental attributes side-by-side using our optimized text index.
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <Button
            size="sm"
            variant={domain === "animals" ? "default" : "outline"}
            onClick={() => { setDomain("animals"); setItemA(null); setItemB(null); }}
            className="gap-2"
          >
            <Cat className="h-4 w-4" /> Compare Animals
          </Button>
          <Button
            size="sm"
            variant={domain === "plants" ? "default" : "outline"}
            onClick={() => { setDomain("plants"); setItemA(null); setItemB(null); }}
            className="gap-2"
          >
            <Leaf className="h-4 w-4" /> Compare Plants
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-5 space-y-4 bg-card border border-border shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center">A</span> Species Selection
            </p>
            <SearchSlot slot={1} domain={domain} value={itemA} onSelect={setItemA} onClear={() => setItemA(null)} />
          </Card>
          <Card className="p-5 space-y-4 bg-card border border-border shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center">B</span> Species Selection
            </p>
            <SearchSlot slot={2} domain={domain} value={itemB} onSelect={setItemB} onClear={() => setItemB(null)} />
          </Card>
        </div>

        {canCompare ? (
          <Card className="overflow-hidden border border-border shadow-sm animate-slide-up">
            <div className="p-5 bg-secondary/30 border-b border-border flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="font-bold text-xl">Side-by-Side Comparison</h2>
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-bold">Highlighted</span> values indicate differences in biological traits.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wide border-r border-border/40">Attribute</th>
                    <th className="px-4 py-4 text-base font-bold text-primary">{formatName(itemA!.name || itemA!.common_name || "Unknown")}</th>
                    <th className="px-2 py-4 text-center text-xs" />
                    <th className="px-4 py-4 text-base font-bold text-primary border-l border-border/40">{formatName(itemB!.name || itemB!.common_name || "Unknown")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <CompareRow label="Scientific Name"
                    a={formatName(itemA!.scientificName || itemA!.species_name || "Unknown")}
                    b={formatName(itemB!.scientificName || itemB!.species_name || "Unknown")}
                  />
                  <CompareRow label="Conservation Status"
                    a={<span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border capitalize ${STATUS_PILL[(itemA!.conservationStatus || itemA!.status || "Unknown").toLowerCase()] || ""}`}>{(itemA!.conservationStatus || itemA!.status || "Unknown").toLowerCase()}</span>}
                    b={<span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border capitalize ${STATUS_PILL[(itemB!.conservationStatus || itemB!.status || "Unknown").toLowerCase()] || ""}`}>{(itemB!.conservationStatus || itemB!.status || "Unknown").toLowerCase()}</span>}
                  />
                  <CompareRow label="Type"              a={itemA!.type || domain}      b={itemB!.type || domain}      highlight />
                  <CompareRow label="Zone"              a={formatName(itemA!.zone || "Unknown")}      b={formatName(itemB!.zone || "Unknown")}      />
                  <CompareRow label="Ecosystem"         a={formatName(itemA!.ecosystem || "Unknown")} b={formatName(itemB!.ecosystem || "Unknown")} highlight />
                  <CompareRow label="Habitat"           a={formatName(itemA!.habitat || itemA!.ecosystem || "Unknown")}   b={formatName(itemB!.habitat || itemB!.ecosystem || "Unknown")}   />
                  {domain === "animals" && (
                    <CompareRow label="Population Est." highlight
                      a={itemA!.population ? itemA!.population.toLocaleString() : "Unknown"}
                      b={itemB!.population ? itemB!.population.toLocaleString() : "Unknown"}
                    />
                  )}
                  {domain === "animals" && (
                    <CompareRow label="Key Threats"
                      a={itemA!.threats?.slice(0, 2).join(", ") || "—"}
                      b={itemB!.threats?.slice(0, 2).join(", ") || "—"}
                    />
                  )}
                  {domain === "plants" && (
                    <CompareRow label="Primary Uses" highlight
                      a={itemA!.uses?.slice(0, 2).join(", ") || "—"}
                      b={itemB!.uses?.slice(0, 2).join(", ") || "—"}
                    />
                  )}
                  <CompareRow label="Description" highlight
                    a={itemA!.description?.slice(0, 100) + (itemA!.description && itemA!.description.length > 100 ? "…" : "") || "—"}
                    b={itemB!.description?.slice(0, 100) + (itemB!.description && itemB!.description.length > 100 ? "…" : "") || "—"}
                  />
                </tbody>
              </table>
            </div>

            <div className="p-5 border-t border-border bg-secondary/10 flex gap-4 flex-wrap">
              <Button
                variant="default"
                className="gap-2 flex-1 shadow-sm"
                onClick={() => navigate(`/${domain}/${itemA!._id || itemA!.id}`)}
              >
                <Info className="h-4 w-4" /> View Full Data: {formatName(itemA!.name || itemA!.common_name || "A")}
              </Button>
              <Button
                variant="default"
                className="gap-2 flex-1 shadow-sm"
                onClick={() => navigate(`/${domain}/${itemB!._id || itemB!.id}`)}
              >
                <Info className="h-4 w-4" /> View Full Data: {formatName(itemB!.name || itemB!.common_name || "B")}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-16 text-center border-dashed bg-muted/20 animate-fade-in">
            <AlertCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Select Two {domain === "animals" ? "Animals" : "Plants"} to Compare</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Use the search boxes above to securely query the database. 
              The engine will match biological characteristics and dynamically highlight any distinct traits.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
