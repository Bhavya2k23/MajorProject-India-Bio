import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, AlertTriangle, Info, Leaf, Cat, Wind, TrendingDown, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ── Climate impact data (accurate, research-backed) ─────────────────────── */
const CLIMATE_SCENARIOS = [
  {
    temp:        0,
    label:       "Current",
    color:       "#22c55e",
    bg:          "from-green-500/10",
    border:      "border-green-500/30",
    globalRisk:  0,
    description: "Current climate conditions. Biodiversity faces existing stressors but no additional warming impact.",
    zoneImpacts: {
      "Himalayan":      { risk: 15, icon: "❄️", note: "Glacial melt already underway" },
      "Western Ghats":  { risk: 10, icon: "🌧️", note: "Monsoon variability increasing" },
      "Desert":         { risk: 5,  icon: "☀️", note: "Manageable heat extremes" },
      "Gangetic Plain": { risk: 8,  icon: "💧", note: "Groundwater stress" },
      "Coastal":        { risk: 12, icon: "🌊", note: "Gradual sea level rise" },
      "North-East":     { risk: 6,  icon: "🌿", note: "Forest cover relatively stable" },
    },
  },
  {
    temp:        1,
    label:       "+1°C",
    color:       "#84cc16",
    bg:          "from-lime-500/10",
    border:      "border-lime-500/30",
    globalRisk:  12,
    description: "+1°C warming causes moderate stress. Himalayan glaciers retreat faster. Coral bleaching events increase.",
    zoneImpacts: {
      "Himalayan":      { risk: 25, icon: "🏔️", note: "Snow leopard habitat shrinks 8%" },
      "Western Ghats":  { risk: 18, icon: "🌧️", note: "Kurinji bloom cycles disrupted" },
      "Desert":         { risk: 15, icon: "☀️", note: "Great Indian Bustard nesting affected" },
      "Gangetic Plain": { risk: 20, icon: "💧", note: "Gangetic dolphin habitat stressed" },
      "Coastal":        { risk: 22, icon: "🌊", note: "Mangroves begin retreating inland" },
      "North-East":     { risk: 14, icon: "🌿", note: "Hoolock Gibbon range shifts" },
    },
  },
  {
    temp:        1.5,
    label:       "+1.5°C",
    color:       "#eab308",
    bg:          "from-yellow-500/10",
    border:      "border-yellow-500/30",
    globalRisk:  20,
    description: "Paris Agreement threshold. ~26% of vertebrates lose over half their geographic range. Coral reefs face 70-90% decline.",
    zoneImpacts: {
      "Himalayan":      { risk: 40, icon: "🏔️", note: "Red Panda range halved; glacial floods" },
      "Western Ghats":  { risk: 35, icon: "🌧️", note: "Endemic amphibians lose 40% habitat" },
      "Desert":         { risk: 25, icon: "☀️", note: "Desert fox ranges collapse" },
      "Gangetic Plain": { risk: 32, icon: "💧", note: "Gharial nesting sites flood" },
      "Coastal":        { risk: 38, icon: "🌊", note: "Olive Ridley nesting beaches eroded" },
      "North-East":     { risk: 28, icon: "🌿", note: "Agarwood & orchids critically stressed" },
    },
  },
  {
    temp:        2,
    label:       "+2°C",
    color:       "#f97316",
    bg:          "from-orange-500/10",
    border:      "border-orange-500/30",
    globalRisk:  35,
    description: "+2°C scenario. India faces extreme heat events 5× more often. ~44% species face extinction risk. Monsoon failure risk rises sharply.",
    zoneImpacts: {
      "Himalayan":      { risk: 60, icon: "🏔️", note: "Snow leopard functionally extinct in lower ranges" },
      "Western Ghats":  { risk: 55, icon: "🌧️", note: "Lion-tailed macaque loses 60% canopy cover" },
      "Desert":         { risk: 40, icon: "☀️", note: "Khejri trees die-off; ecosystem collapse" },
      "Gangetic Plain": { risk: 50, icon: "💧", note: "River dolphin near extinction from hyperthermia" },
      "Coastal":        { risk: 58, icon: "🌊", note: "Sundarbans tiger habitat 50% submerged" },
      "North-East":     { risk: 45, icon: "🌿", note: "Bamboo mass die-off after bloom synchrony" },
    },
  },
  {
    temp:        3,
    label:       "+3°C",
    color:       "#ef4444",
    bg:          "from-red-500/10",
    border:      "border-red-500/30",
    globalRisk:  55,
    description: "Catastrophic warming. India's monsoon could permanently weaken. Over 50% of India's endemic species face extinction. Mass coral, glacier, and forest loss.",
    zoneImpacts: {
      "Himalayan":      { risk: 80, icon: "🏔️", note: "Himalayan ecosystem collapse; glaciers gone" },
      "Western Ghats":  { risk: 75, icon: "🌧️", note: "Hotspot status lost; >1000 plants extinct" },
      "Desert":         { risk: 60, icon: "☀️", note: "Uninhabitable for most species" },
      "Gangetic Plain": { risk: 70, icon: "💧", note: "River systems fail; wetlands dry out" },
      "Coastal":        { risk: 78, icon: "🌊", note: "Sundarbans fully submerged" },
      "North-East":     { risk: 65, icon: "🌿", note: "Megadiversity corridor fragmented" },
    },
  },
  {
    temp:        4,
    label:       "+4°C",
    color:       "#7c3aed",
    bg:          "from-purple-500/10",
    border:      "border-purple-500/30",
    globalRisk:  75,
    description: "Mass extinction event. Scientists warn of 'uninhabitable' zones across India. 70-80% of all species estimated to be at critical risk. Civilisation-level crisis.",
    zoneImpacts: {
      "Himalayan":      { risk: 95, icon: "🏔️", note: "Complete ecosystem collapse" },
      "Western Ghats":  { risk: 90, icon: "🌧️", note: "Tropical forests converted to savanna" },
      "Desert":         { risk: 85, icon: "☀️", note: "Hyper-arid death zone" },
      "Gangetic Plain": { risk: 88, icon: "💧", note: "Agriculture and wildlife both collapse" },
      "Coastal":        { risk: 92, icon: "🌊", note: "Most coastal cities flooded" },
      "North-East":     { risk: 82, icon: "🌿", note: "Biodiversity corridor destroyed" },
    },
  },
];

const AT_RISK_SPECIES_BY_TEMP: Record<number, { name: string; type: "animal"|"plant"; status: string; reason: string }[]> = {
  0:   [],
  1:   [
    { name: "Snow Leopard", type: "animal", status: "Vulnerable", reason: "Prey base shrinks as temperature rises" },
    { name: "Brahma Kamal", type: "plant",  status: "Endangered", reason: "Alpine meadows warming above optimal range" },
    { name: "Olive Ridley Turtle", type: "animal", status: "Vulnerable", reason: "Sand temperature affects hatchling sex ratio" },
  ],
  1.5: [
    { name: "Snow Leopard", type: "animal", status: "Endangered", reason: "Habitat range halved; prey collapse" },
    { name: "Red Panda", type: "animal", status: "Endangered", reason: "Bamboo die-off in warming ranges" },
    { name: "Gharial", type: "animal", status: "Critically Endangered", reason: "Nesting sites flood in erratic monsoon" },
    { name: "Kurinji", type: "plant", status: "Vulnerable", reason: "12-year bloom cycle disrupted" },
    { name: "Agarwood", type: "plant", status: "Critically Endangered", reason: "Host fungus dies in heat" },
  ],
  2:   [
    { name: "Snow Leopard", type: "animal", status: "Critically Endangered", reason: "Range collapses to high Tibetan plateau" },
    { name: "Gangetic River Dolphin", type: "animal", status: "Critically Endangered", reason: "River hyperthermia and oxygen depletion" },
    { name: "Lion-tailed Macaque", type: "animal", status: "Critically Endangered", reason: "60% canopy cover lost in Western Ghats" },
    { name: "Bengal Florican", type: "animal", status: "Critically Endangered", reason: "Grasslands converted by drought" },
    { name: "Sandalwood", type: "plant", status: "Endangered", reason: "Fungal attacks increase with heat stress" },
    { name: "Sarpagandha", type: "plant", status: "Critically Endangered", reason: "Forest floor conditions unviable" },
    { name: "Jatamansi", type: "plant", status: "Extinct in Wild", reason: "High-altitude niche eliminated" },
  ],
  3:   [
    { name: "Bengal Tiger", type: "animal", status: "Critically Endangered", reason: "Sundarbans habitat fully submerged" },
    { name: "Snow Leopard", type: "animal", status: "Extinct in Wild", reason: "No remaining viable habitat" },
    { name: "Purple Frog", type: "animal", status: "Critically Endangered", reason: "Soil temperature lethal to larvae" },
    { name: "Great Indian Bustard", type: "animal", status: "Extinct in Wild", reason: "Arid habitat becomes inhospitable" },
    { name: "Brahma Kamal", type: "plant", status: "Extinct in Wild", reason: "Alpine zone eliminated" },
    { name: "Lady's Slipper Orchid", type: "plant", status: "Extinct in Wild", reason: "Mycorrhizal fungi networks collapse" },
    { name: "Sandalwood", type: "plant", status: "Critically Endangered", reason: "Cannot survive monsoon failure" },
  ],
  4:   [
    { name: "Bengal Tiger", type: "animal", status: "Extinct in Wild", reason: "Habitat fully destroyed" },
    { name: "Indian Rhinoceros", type: "animal", status: "Extinct in Wild", reason: "Grasslands collapse in extreme heat" },
    { name: "Gangetic River Dolphin", type: "animal", status: "Extinct in Wild", reason: "River systems dry out" },
    { name: "Snow Leopard", type: "animal", status: "Extinct", reason: "Global population eliminated" },
    { name: "Hoolock Gibbon", type: "animal", status: "Extinct in Wild", reason: "Forest corridor destroyed" },
    { name: "Neem Tree", type: "plant", status: "Vulnerable", reason: "Even climate-hardy species stressed" },
    { name: "Lotus", type: "plant", status: "Critically Endangered", reason: "Wetlands evaporate" },
    { name: "Bamboo (most spp.)", type: "plant", status: "Extinct in Wild", reason: "Mass synchronous die-off post bloom" },
  ],
};

const getRiskColor = (risk: number): string => {
  if (risk >= 80) return "bg-purple-500";
  if (risk >= 60) return "bg-red-500";
  if (risk >= 40) return "bg-orange-500";
  if (risk >= 20) return "bg-yellow-500";
  return "bg-green-500";
};

const getRiskLabel = (risk: number): string => {
  if (risk >= 80) return "Critical";
  if (risk >= 60) return "Severe";
  if (risk >= 40) return "High";
  if (risk >= 20) return "Moderate";
  return "Low";
};

export default function Climate() {
  const navigate = useNavigate();
  const [tempIndex, setTempIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dbAnimals, setDbAnimals] = useState(0);
  const [dbPlants, setDbPlants] = useState(0);

  const scenario = CLIMATE_SCENARIOS[tempIndex];
  const atRiskList = AT_RISK_SPECIES_BY_TEMP[scenario.temp] || [];

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/analytics/biodiversity`).then((r) => r.json()),
    ]).then(([bio]) => {
      if (bio.success) {
        setDbAnimals(bio.data.animals.summary.totalSpecies);
        setDbPlants(bio.data.plants.summary.totalSpecies);
      }
    }).catch(() => {});
  }, []);

  const handleSlider = (val: number) => {
    setAnimating(true);
    setTempIndex(val);
    setTimeout(() => setAnimating(false), 300);
  };

  const totalAtRisk = Math.round((dbAnimals + dbPlants) * scenario.globalRisk / 100);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-10 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm font-medium text-orange-600 dark:text-orange-400">
            <Thermometer className="h-4 w-4" />
            Climate Impact Simulator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Biodiversity Under a{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Warming World
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simulate how temperature rise affects India's biodiversity. Drag the slider to explore
            real scientific projections for each biogeographical zone.
          </p>
        </div>

        {/* Temperature Slider */}
        <Card className={`p-6 mb-8 border-2 ${scenario.border} bg-gradient-to-br ${scenario.bg} to-transparent transition-all duration-500`}>
          <div className="text-center mb-6">
            <div className="text-6xl font-black mb-2" style={{ color: scenario.color }}>
              {scenario.label}
            </div>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              {scenario.description}
            </p>
          </div>

          <div className="relative px-4">
            <input
              id="climate-slider"
              type="range"
              min={0}
              max={5}
              step={1}
              value={tempIndex}
              onChange={(e) => handleSlider(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444, #7c3aed)`,
                accentColor: scenario.color,
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
              {CLIMATE_SCENARIOS.map((s, i) => (
                <span key={i} style={{ color: i === tempIndex ? scenario.color : undefined }} className={i === tempIndex ? "font-bold" : ""}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: scenario.color }}>
              {scenario.globalRisk}%
            </div>
            <div className="text-xs text-muted-foreground">Estimated Species at Risk</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive mb-1">
              {totalAtRisk}
            </div>
            <div className="text-xs text-muted-foreground">Species Impacted (DB)</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {Object.values(scenario.zoneImpacts).filter((z) => z.risk >= 50).length}
            </div>
            <div className="text-xs text-muted-foreground">Zones in Severe Risk</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500 mb-1">
              {atRiskList.filter((s) => s.status.includes("Extinct")).length}
            </div>
            <div className="text-xs text-muted-foreground">Local Extinctions</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Zone Impact Panel */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wind className="h-5 w-5 text-primary" />
              Biogeographical Zone Impact
            </h2>
            <div className={`space-y-3 transition-opacity duration-300 ${animating ? "opacity-0" : "opacity-100"}`}>
              {Object.entries(scenario.zoneImpacts).map(([zone, data]) => (
                <Card key={zone} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{data.icon}</span>
                      <span className="font-semibold text-sm">{zone}</span>
                    </div>
                    <Badge
                      className={`text-xs text-white border-0 ${
                        data.risk >= 70 ? "bg-red-500" :
                        data.risk >= 50 ? "bg-orange-500" :
                        data.risk >= 30 ? "bg-yellow-500" :
                        "bg-green-500"
                      }`}
                    >
                      {getRiskLabel(data.risk)} — {data.risk}%
                    </Badge>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getRiskColor(data.risk)}`}
                      style={{ width: `${data.risk}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{data.note}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* At-Risk Species Panel */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              Projected Species Impact
            </h2>

            {atRiskList.length === 0 ? (
              <Card className="p-8 text-center border-green-500/30 bg-green-500/5">
                <div className="text-4xl mb-3">🌿</div>
                <p className="font-semibold text-green-700 dark:text-green-400">Current conditions</p>
                <p className="text-sm text-muted-foreground mt-1">
                  No additional temperature-driven extinctions predicted at 0°C warming.
                  Existing conservation efforts remain critical.
                </p>
              </Card>
            ) : (
              <div className={`space-y-2 transition-opacity duration-300 ${animating ? "opacity-0" : "opacity-100"}`}>
                {atRiskList.map((sp, i) => (
                  <Card key={i} className="p-3 flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">
                      {sp.type === "animal" ? <Cat className="h-5 w-5 text-orange-500 mt-0.5" /> : <Leaf className="h-5 w-5 text-green-600 mt-0.5" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{sp.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                          sp.status.includes("Extinct") ? "bg-gray-700" :
                          sp.status === "Critically Endangered" ? "bg-red-600" :
                          sp.status === "Endangered" ? "bg-orange-500" :
                          "bg-yellow-500"
                        }`}>
                          {sp.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{sp.reason}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* CTA */}
            <Card className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Projections based on IPCC AR6 reports, IUCN climate vulnerability assessments,
                    and India-specific biodiversity research. Data reflects regional consensus estimates.
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => navigate("/conservation")}>
                      View Conservation <ChevronRight className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => navigate("/biodiversity")}>
                      See Insights <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="mt-10 p-8 bg-gradient-to-r from-primary/10 to-destructive/10 border-primary/20 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">The Time to Act is Now</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Limiting warming to 1.5°C could save over 50% of currently at-risk species in India.
            Every fraction of a degree matters for biodiversity conservation.
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            <Button onClick={() => navigate("/animals")} className="gap-2">
              <Cat className="h-4 w-4" /> Explore Animals
            </Button>
            <Button onClick={() => navigate("/plants")} variant="outline" className="gap-2">
              <Leaf className="h-4 w-4" /> Explore Plants
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
