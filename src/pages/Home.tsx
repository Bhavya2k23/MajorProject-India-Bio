import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight, Map, Search, Award, Globe, TreePine, Brain,
  Thermometer, GitCompareArrows, Leaf, MessageCircle, BarChart3,
  Loader2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DID_YOU_KNOW = [
  "India is one of 17 megadiverse countries, hosting 7–8% of all recorded species.",
  "The Western Ghats is a UNESCO World Heritage Site and one of the world's 8 'hottest' biodiversity hotspots.",
  "The Snow Leopard is found only in the high altitudes of the Trans-Himalayan Zone.",
  "India has the world's largest population of Asiatic Elephants — about 60% of the global total.",
  "The Brahma Kamal, found above 4,000m, blooms once a year and is sacred in Hindu tradition.",
  "The Sundarbans mangrove forest in India & Bangladesh is the only habitat of the swimming Bengal Tiger.",
  "Of 450+ species of bamboo in India, most die after flowering — triggering mass animal migrations.",
  "The Gangetic River Dolphin is India's National Aquatic Animal and uses echolocation to navigate.",
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; scientificName: string }[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [liveStats, setLiveStats] = useState({ animals: 0, plants: 0, endangered: 0, zones: 0 });
  const [factIndex, setFactIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch live stats
  useEffect(() => {
    fetch(`${API_BASE}/analytics/biodiversity`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setLiveStats({
            animals: d.data.animals.summary.totalSpecies,
            plants:  d.data.plants.summary.totalSpecies,
            endangered: d.data.animals.summary.endangeredCount + d.data.plants.summary.endangeredCount,
            zones: d.data.animals.summary.totalZones,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Rotate did-you-know every 5s
  useEffect(() => {
    const t = setInterval(() => setFactIndex((i) => (i + 1) % DID_YOU_KNOW.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSuggestions([]); setShowSugg(false); return; }
    setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSugg(true);
      } catch { setSuggestions([]); }
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const features = [
    { icon: <Leaf className="h-6 w-6" />,        title: "Plants Directory",          description: "Discover 100+ Indian flora — trees, herbs, medicinal plants",  link: "/plants",       color: "bg-green-600" },
    { icon: <Map className="h-6 w-6" />,          title: "Biogeographical Zones",     description: "Explore India's 10 unique biogeographical zones",                link: "/zones",        color: "bg-ecosystem-forest" },
    { icon: <TreePine className="h-6 w-6" />,     title: "Ecosystems",               description: "Learn about different ecosystem types across India",              link: "/ecosystems",   color: "bg-ecosystem-mountain" },
    { icon: <Award className="h-6 w-6" />,        title: "Conservation Status",       description: "Track endangered and at-risk species — animals & plants",        link: "/conservation", color: "bg-status-endangered" },
    { icon: <Globe className="h-6 w-6" />,        title: "Interactive Map",           description: "Visualize animal & plant distribution across zones",             link: "/map",          color: "bg-ecosystem-ocean" },
    { icon: <GitCompareArrows className="h-6 w-6" />, title: "Compare Species",       description: "Side-by-side comparison of any two animals or plants",          link: "/compare",      color: "bg-purple-600" },
    { icon: <Thermometer className="h-6 w-6" />,  title: "🌡️ Climate Simulator",      description: "See how warming affects biodiversity — drag the temperature",    link: "/climate",      color: "bg-orange-500" },
    { icon: <BarChart3 className="h-6 w-6" />,    title: "Biodiversity Analytics",   description: "Charts & insights on species distribution and conservation",      link: "/biodiversity", color: "bg-blue-600" },
    { icon: <Brain className="h-6 w-6" />,        title: "Quiz + Leaderboard",        description: "Test your knowledge & compete with the leaderboard",            link: "/quiz",         color: "bg-accent" },
    { icon: <MessageCircle className="h-6 w-6" />, title: "BioDex AI Chatbot",       description: "Ask our AI assistant anything about India's biodiversity",       link: "#chatbot",      color: "bg-emerald-700" },
  ];

  const stats = [
    { value: liveStats.animals || "100+", label: "Animal Species" },
    { value: liveStats.plants  || "100+", label: "Plant Species" },
    { value: liveStats.endangered || "60+", label: "At-Risk Species" },
    { value: liveStats.zones || "10",    label: "Biogeographical Zones" },
  ];

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">

            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                <Globe className="h-4 w-4" />
                Explore India's Natural Heritage
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              India Biodiversity
              <span className="block text-gradient">Explorer</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the incredible diversity of species, ecosystems, and biogeographical
              zones that make India one of the world's mega-diverse nations.
            </p>

            {/* Quick Search Bar */}
            <div ref={searchRef} className="relative max-w-xl mx-auto">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="home-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && searchQuery.trim()) navigate(`/animals?search=${encodeURIComponent(searchQuery)}`); }}
                    placeholder="Search animals, plants, or ecosystems…"
                    className="pl-10 h-12 text-base shadow-lg"
                    onFocus={() => suggestions.length > 0 && setShowSugg(true)}
                    onBlur={() => setTimeout(() => setShowSugg(false), 200)}
                  />
                  {searchLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                <Button
                  id="home-search-btn"
                  size="lg"
                  className="h-12 px-5"
                  onClick={() => searchQuery.trim() && navigate(`/animals?search=${encodeURIComponent(searchQuery)}`)}
                >
                  Search
                </Button>
              </div>

              {/* Suggestions dropdown */}
              {showSugg && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-16 z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onMouseDown={() => { navigate(`/animals/${s.id}`); setShowSugg(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary text-left transition-colors"
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground italic">{s.scientificName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/animals">
                <Button size="lg" className="group gap-2">
                  Explore Animals
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/plants">
                <Button size="lg" variant="outline" className="gap-2">
                  <Leaf className="h-4 w-4" /> Explore Plants
                </Button>
              </Link>
              <Link to="/map">
                <Button size="lg" variant="outline" className="gap-2">
                  <Map className="h-4 w-4" /> View Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Stats ────────────────────────────────────────────────────── */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Did You Know ──────────────────────────────────────────────────── */}
      <section className="py-6 bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 max-w-3xl">
            <span className="text-2xl flex-shrink-0">🌿</span>
            <div>
              <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Did You Know?</p>
              <p className="text-sm text-foreground transition-all duration-500 key-fact">{DID_YOU_KNOW[factIndex]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Explore India's Natural Wealth</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful interactive tools to understand, compare, and protect India's biodiversity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <Link
                key={i}
                to={feature.link}
                onClick={feature.link === "#chatbot" ? (e) => {
                  e.preventDefault();
                  (document.getElementById("chatbot-toggle-btn") as HTMLButtonElement)?.click();
                } : undefined}
                className="group"
              >
                <Card className="p-5 h-full hover-lift hover:border-primary/50 transition-all">
                  <div className="space-y-3">
                    <div className={`inline-flex p-3 rounded-xl ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    <div className="flex items-center text-primary text-xs font-semibold pt-1">
                      Explore
                      <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action ────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Explore?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Try the Climate Simulator, compare species, chat with BioDex AI, or take the biodiversity quiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 flex-wrap">
            <Link to="/climate">
              <Button size="lg" variant="secondary" className="gap-2">
                <Thermometer className="h-4 w-4" /> Climate Simulator
              </Button>
            </Link>
            <Link to="/quiz">
              <Button size="lg" variant="secondary" className="gap-2">
                <Brain className="h-4 w-4" /> Take the Quiz
              </Button>
            </Link>
            <Link to="/compare">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white gap-2">
                <GitCompareArrows className="h-4 w-4" /> Compare Species
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
