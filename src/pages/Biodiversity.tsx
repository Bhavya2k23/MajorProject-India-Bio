import { useEffect, useState, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend as RechartsLegend, ResponsiveContainer, PieChart, Pie, Cell, 
  ComposedChart, Line
} from "recharts";
import { Activity, Globe, AlertTriangle, Layers, Fish, Leaf, ChartArea, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

// Make sure to match your env config
// If running locally verify port
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type DomainType = "animals" | "plants" | "combined";

interface Species {
  _id: string;
  name: string;
  scientificName: string;
  zone: string;
  ecosystem: string;
  conservationStatus: string;
  population?: number;
  threats?: string[];
  type: string; // "Animal" or "Plant" conceptually
  category?: string; // Bird, Mammal, Tree, etc.
}

const STATUS_COLORS: Record<string, string> = {
  "Endangered": "#ef4444",              // Red
  "Critically Endangered": "#b91c1c",   // Dark Red
  "Vulnerable": "#f59e0b",              // Amber
  "Near Threatened": "#eab308",         // Yellow
  "Least Concern": "#22c55e",           // Green
  "Safe": "#3b82f6",                    // Blue
  "Extinct in Wild": "#6b7280",         // Gray
  "Extinct": "#111827",                 // Dark Gray
};

export default function BiodiversityAnalytics() {
  const [animals, setAnimals] = useState<Species[]>([]);
  const [plants, setPlants] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<DomainType>("animals");

  // Filters
  const [zoneFilter, setZoneFilter] = useState("All");
  const [ecoFilter, setEcoFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/animals?limit=2000`).then((r) => r.json()),
      fetch(`${API_BASE}/plants?limit=2000`).then((r) => r.json())
    ])
      .then(([animData, plantData]) => {
        setAnimals(animData.data || animData || []);
        setPlants(plantData.data || plantData || []);
      })
      .catch((err) => console.error("Error fetching analytics data", err))
      .finally(() => setLoading(false));
  }, []);

  // 1. Filter Data dynamically
  const filteredData = useMemo(() => {
    let base = domain === "animals" ? [...animals] : domain === "plants" ? [...plants] : [...animals, ...plants];
    
    if (zoneFilter !== "All") base = base.filter(s => s.zone === zoneFilter);
    if (ecoFilter !== "All") base = base.filter(s => s.ecosystem === ecoFilter);
    if (statusFilter !== "All") base = base.filter(s => s.conservationStatus === statusFilter);
    
    return base;
  }, [animals, plants, domain, zoneFilter, ecoFilter, statusFilter]);

  // Base data for dropdown options depending on the active domain tab
  const baseOptionsData = useMemo(() => {
    return domain === "animals" ? animals : domain === "plants" ? plants : [...animals, ...plants];
  }, [animals, plants, domain]);

  // Dropdown Options
  const uniqueZones = useMemo(() => Array.from(new Set(baseOptionsData.map(s => s.zone).filter(Boolean))).sort(), [baseOptionsData]);
  const uniqueEcosystems = useMemo(() => Array.from(new Set(baseOptionsData.map(s => s.ecosystem).filter(Boolean))).sort(), [baseOptionsData]);
  const uniqueStatuses = useMemo(() => Array.from(new Set(baseOptionsData.map(s => s.conservationStatus).filter(Boolean))).sort(), [baseOptionsData]);

  // 2. Aggregations
  // A. Status Distribution
  const statusDist = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredData.forEach(s => {
      const status = s.conservationStatus || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
    });
    return Object.entries(acc).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredData]);

  // B. Ecosystem Distribution
  const ecoDist = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredData.forEach(s => {
      const eco = s.ecosystem || "Unknown";
      acc[eco] = (acc[eco] || 0) + 1;
    });
    return Object.entries(acc).map(([name, speciesCount]) => ({ name, speciesCount })).sort((a,b) => b.speciesCount - a.speciesCount).slice(0, 10);
  }, [filteredData]);

  // C. Zone vs Species (Combined uses grouped bar)
  const zoneDist = useMemo(() => {
    const acc: Record<string, { zone: string; animals: number; plants: number }> = {};
    const animalIds = new Set(animals.map(a => a._id)); // O(1) lookup for massive performance gain

    filteredData.forEach(s => {
      const isAnimal = animalIds.has(s._id); 
      const z = s.zone || "Unknown";
      
      if (!acc[z]) acc[z] = { zone: z, animals: 0, plants: 0 };

      if (isAnimal) acc[z].animals++;
      else acc[z].plants++;
    });

    return Object.values(acc).sort((a,b) => (b.animals + b.plants) - (a.animals + a.plants)).slice(0, 8);
  }, [filteredData, animals]);

  // D. Threat Analysis
  const threatDist = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredData.forEach(s => {
      if (s.threats && Array.isArray(s.threats)) {
        s.threats.forEach(t => {
          const threat = t.trim();
          acc[threat] = (acc[threat] || 0) + 1;
        });
      }
    });
    return Object.entries(acc).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0, 8);
  }, [filteredData]);

  // KPI calculations
  const totalCount = filteredData.length;
  const endangeredCount = filteredData.filter(s => s.conservationStatus === "Endangered" || s.conservationStatus === "Critically Endangered").length;
  const activeEcosystems = new Set(filteredData.map(s => s.ecosystem)).size;
  const activeZones = new Set(filteredData.map(s => s.zone)).size;
  const topThreat = threatDist.length > 0 ? threatDist[0].name : "N/A";

  // Dynamic Insights Generator
  const generateInsights = () => {
    const insights = [];
    if (totalCount === 0) return ["No data available for the selected filters."];
    
    // Most endangered ecosystem
    const ecoEndangered: Record<string, number> = {};
    filteredData.forEach(s => {
      if (s.conservationStatus === "Endangered" || s.conservationStatus === "Critically Endangered") {
        ecoEndangered[s.ecosystem] = (ecoEndangered[s.ecosystem] || 0) + 1;
      }
    });
    const entries = Object.entries(ecoEndangered).sort((a,b) => b[1] - a[1]);
    if (entries.length > 0) {
      insights.push(`The ${entries[0][0]} ecosystem has the highest number of critically threatened species (${entries[0][1]} species).`);
    }

    if (topThreat !== "N/A") {
      insights.push(`"${topThreat}" is the leading threat, affecting ${threatDist[0].count} species in the current selection.`);
    }

    if (zoneDist.length > 0) {
      const topZ = zoneDist[0];
      if (domain === "combined") {
        insights.push(`The ${topZ.zone} zone hosts the highest overall biodiversity (${topZ.animals} animals, ${topZ.plants} plants).`);
      } else {
        insights.push(`The ${topZ.zone} zone hosts the highest diversity of ${domain} (${topZ.animals || topZ.plants} species).`);
      }
    }

    if (endangeredCount > 0) {
      insights.push(`${((endangeredCount / totalCount) * 100).toFixed(1)}% of the tracked species in your selection require immediate conservation action.`);
    }

    return insights.length > 0 ? insights : ["Ecosystem appears stable based on current data limit."];
  };

  const currentInsights = useMemo(generateInsights, [filteredData, domain, zoneDist, topThreat, threatDist, endangeredCount, totalCount]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-muted-foreground gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p>Crunching biodiversity data...</p>
      </div>
    );
  }

  // Common Recharts properties utilizing CSS variables for theme compatibility
  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    borderColor: "hsl(var(--border))",
    color: "hsl(var(--card-foreground))",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  };

  return (
    <div className="min-h-screen pb-12 bg-background text-foreground transition-colors">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header & Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="space-y-2 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
              <Activity className="h-4 w-4" /> Real-time Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Biodiversity Dashboard</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore dynamic multi-dimensional data mapping India's species distribution, conservation status, and climate threats.
            </p>
          </div>

          <div className="flex bg-secondary p-1.5 rounded-xl self-stretch md:self-auto border border-border shadow-sm">
            <button 
              onClick={() => setDomain("animals")} 
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${domain === "animals" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Fish className="h-4 w-4" /> Animals
            </button>
            <button 
              onClick={() => setDomain("plants")} 
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${domain === "plants" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Leaf className="h-4 w-4" /> Plants
            </button>
            <button 
              onClick={() => setDomain("combined")} 
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${domain === "combined" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Globe className="h-4 w-4" /> Combined
            </button>
          </div>
        </div>

        {/* Dynamic Filters */}
        <Card className="p-4 mb-8 bg-card border-border shadow-sm animate-slide-up flex flex-wrap gap-4 items-center">
          <div className="text-sm font-semibold text-muted-foreground mr-2 flex items-center gap-2">
            <ChartArea className="h-4 w-4" /> Filters:
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <select 
              value={zoneFilter} 
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm flex-1 min-w-[150px] shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="All">All Zones</option>
              {uniqueZones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>

            <select 
              value={ecoFilter} 
              onChange={(e) => setEcoFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm flex-1 min-w-[150px] shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="All">All Ecosystems</option>
              {uniqueEcosystems.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm flex-1 min-w-[150px] shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {(zoneFilter !== "All" || ecoFilter !== "All" || statusFilter !== "All") && (
            <button 
              onClick={() => { setZoneFilter("All"); setEcoFilter("All"); setStatusFilter("All"); }}
              className="text-xs font-semibold text-primary/80 hover:text-primary px-2 transition-colors"
            >
              Reset
            </button>
          )}
        </Card>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-5 flex flex-col justify-center border-l-4 border-l-primary/60">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Total Tracked</span>
            <span className="text-3xl font-black text-foreground">{totalCount}</span>
            <span className="text-xs text-muted-foreground mt-1">Found in active filter</span>
          </Card>
          
          <Card className="p-5 flex flex-col justify-center border-l-4 border-l-destructive/60">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Endangered</span>
            <span className="text-3xl font-black text-destructive">{endangeredCount}</span>
            <span className="text-xs text-muted-foreground mt-1">Require immediate protection</span>
          </Card>
          
          <Card className="p-5 flex flex-col justify-center border-l-4 border-l-blue-500/60">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Ecosystems</span>
            <span className="text-3xl font-black text-foreground">{activeEcosystems}</span>
            <span className="text-xs text-muted-foreground mt-1">Distinct habitats mapping</span>
          </Card>
          
          <Card className="p-5 flex flex-col justify-center border-l-4 border-l-purple-500/60">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Zones</span>
            <span className="text-3xl font-black text-foreground">{activeZones}</span>
            <span className="text-xs text-muted-foreground mt-1">Biogeographical areas</span>
          </Card>

          <Card className="p-5 flex flex-col justify-center border-l-4 border-l-amber-500/60 col-span-2 lg:col-span-1">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Top Threat</span>
            <span className="text-lg font-bold text-foreground line-clamp-2 leading-tight">{topThreat}</span>
            <span className="text-xs text-muted-foreground mt-auto pt-1">Primary disruptive force</span>
          </Card>
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Chart 1: Conservation Status (Donut) */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-1">Conservation Status</h3>
            <p className="text-sm text-muted-foreground mb-6">Distribution based on IUCN threat classifications.</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip contentStyle={tooltipStyle} itemStyle={{ color: "hsl(var(--foreground))" }} />
                  <RechartsLegend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px" }} />
                  <Pie
                    data={statusDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {statusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "hsl(var(--muted))"} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Zone Map (Bar/Grouped) */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-1">Zone Distribution</h3>
            <p className="text-sm text-muted-foreground mb-6">Concentration of species across biogeographical zones.</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={zoneDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="zone" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                  <RechartsLegend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  {domain === "combined" ? (
                    <>
                      <Bar dataKey="animals" name="Animals" fill="hsl(var(--chart-1, 210, 100%, 50%))" stackId="a" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="plants" name="Plants" fill="hsl(var(--chart-2, 142, 70%, 45%))" stackId="a" radius={[4, 4, 0, 0]} />
                    </>
                  ) : (
                    <Bar dataKey={domain === "animals" ? "animals" : "plants"} name="Species" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 3: Ecosystem Spread */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-1">Ecosystem Focus</h3>
            <p className="text-sm text-muted-foreground mb-6">Top 10 ecosystems hosting the filtered species.</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ecoDist} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} axisLine={false} tickLine={false} width={100} />
                  <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                  <Bar dataKey="speciesCount" name="Species Total" fill="hsl(var(--chart-3, 270, 70%, 60%))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 4: Threat Analysis */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-1">Threat Assessment</h3>
            <p className="text-sm text-muted-foreground mb-6">Frequency of disruptive threats reported across species.</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatDist} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                  <Bar dataKey="count" name="Identified Incidents" fill="hsl(var(--chart-4, 5, 80%, 55%))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* AI Insight Box */}
        <Card className="p-8 bg-primary/5 border border-primary/20 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl">BioDex Insights Engine</h3>
              <p className="text-sm text-muted-foreground">Automated conclusions based on current filters.</p>
            </div>
          </div>
          <ul className="space-y-3 font-medium text-foreground/90">
            {currentInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </Card>

      </div>
    </div>
  );
}
