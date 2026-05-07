import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, Leaf, Cat, Loader2 } from "lucide-react";

interface ConservationItem {
  _id: string;
  name: string;
  scientificName: string;
  conservationStatus: string;
  zone: string;
  ecosystem: string;
  population?: number;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_CATEGORIES = [
  {
    name: "Safe",
    displayName: "Least Concern / Safe",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "bg-emerald-500/10 text-emerald-700",
    borderColor: "border-emerald-500",
    description: "Species are widespread and not facing immediate threats",
  },
  {
    name: "Near Threatened",
    displayName: "Near Threatened",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "bg-lime-500/10 text-lime-700",
    borderColor: "border-lime-500",
    description: "Close to qualifying as threatened in the near future",
  },
  {
    name: "Vulnerable",
    displayName: "Vulnerable",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "bg-yellow-500/10 text-yellow-700",
    borderColor: "border-yellow-500",
    description: "Facing high risk of extinction in the wild",
  },
  {
    name: "Endangered",
    displayName: "Endangered",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "bg-orange-500/10 text-orange-700",
    borderColor: "border-orange-500",
    description: "Facing very high risk of extinction in the wild",
  },
  {
    name: "Critically Endangered",
    displayName: "Critically Endangered",
    icon: <XCircle className="h-5 w-5" />,
    color: "bg-red-500/10 text-red-700",
    borderColor: "border-red-500",
    description: "Facing extremely high risk of extinction in the wild",
  },
];

const Conservation = () => {
  const [domain, setDomain] = useState<"animals" | "plants">("animals");
  const [animalData, setAnimalData] = useState<ConservationItem[]>([]);
  const [plantData, setPlantData] = useState<ConservationItem[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [loadingPlants, setLoadingPlants] = useState(true);

  useEffect(() => {
    setLoadingAnimals(true);
    fetch(`${API_BASE}/animals?limit=300`)
      .then((res) => res.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : data?.data ?? [];
        setAnimalData(raw);
      })
      .catch((err) => console.error("Error loading animals:", err))
      .finally(() => setLoadingAnimals(false));
  }, []);

  useEffect(() => {
    setLoadingPlants(true);
    fetch(`${API_BASE}/plants?limit=300`)
      .then((res) => res.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : data?.data ?? [];
        setPlantData(raw);
      })
      .catch((err) => console.error("Error loading plants:", err))
      .finally(() => setLoadingPlants(false));
  }, []);

  const activeData = domain === "animals" ? animalData : plantData;
  const isLoading  = domain === "animals" ? loadingAnimals : loadingPlants;

  const getByStatus = (status: string) =>
    activeData.filter((s) => s.conservationStatus === status);

  const getPercentage = (status: string) => {
    if (!activeData.length) return 0;
    return Math.round((getByStatus(status).length / activeData.length) * 100);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">Conservation Status</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Understanding the conservation status of species helps prioritize protection
            efforts and track biodiversity health across India.
          </p>

          {/* Domain Toggle */}
          <div className="flex justify-center gap-3 pt-2">
            <Button
              id="conservation-toggle-animals"
              size="sm"
              variant={domain === "animals" ? "default" : "outline"}
              onClick={() => setDomain("animals")}
              className="gap-2"
            >
              <Cat className="h-4 w-4" /> Animals
            </Button>
            <Button
              id="conservation-toggle-plants"
              size="sm"
              variant={domain === "plants" ? "default" : "outline"}
              onClick={() => setDomain("plants")}
              className="gap-2"
            >
              <Leaf className="h-4 w-4" /> Plants
            </Button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Overview Stats */}
            <Card className="p-8 mb-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {domain === "animals" ? "🦁 Animal" : "🌿 Plant"} Conservation Overview
                </h2>
                <p className="text-muted-foreground">
                  Distribution of {domain} by IUCN conservation status
                  {" — "}<strong>{activeData.length}</strong> {domain} in database
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {STATUS_CATEGORIES.map((category) => {
                  const count = getByStatus(category.name).length;
                  return (
                    <div key={category.name} className="text-center space-y-2">
                      <div className={`inline-flex p-3 rounded-full ${category.color} mb-1`}>
                        {category.icon}
                      </div>
                      <div className="text-3xl font-bold">{count}</div>
                      <div className="text-xs font-medium leading-tight">{category.displayName}</div>
                      <div className="text-xs text-muted-foreground">
                        {getPercentage(category.name)}% of total
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Status Category Cards */}
            <div className="space-y-6">
              {STATUS_CATEGORIES.filter((cat) => getByStatus(cat.name).length > 0).map((category, index) => {
                const items = getByStatus(category.name);
                const percentage = getPercentage(category.name);

                return (
                  <Card
                    key={index}
                    className={`overflow-hidden border-l-4 ${category.borderColor} animate-slide-up`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${category.color} flex-shrink-0`}>
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-0.5">{category.displayName}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <Badge className={`${category.color} border-0`} variant="secondary">
                          {items.length} {domain}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Percentage of total</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>

                      {/* Species/Plant List */}
                      {items.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-3">
                            {domain === "animals" ? "Animals" : "Plants"} in this category:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                            {items.map((s) => (
                              <div
                                key={s._id}
                                className="p-3 bg-secondary/50 rounded-lg space-y-1"
                              >
                                <div className="font-medium text-sm">{s.name}</div>
                                <div className="text-xs text-muted-foreground italic">
                                  {s.scientificName}
                                </div>
                                <div className="flex gap-1.5 flex-wrap mt-1">
                                  <Badge variant="outline" className="text-xs py-0">{s.zone}</Badge>
                                  <Badge variant="outline" className="text-xs py-0">{s.ecosystem}</Badge>
                                  {s.population != null && (
                                    <Badge variant="outline" className="text-xs py-0">
                                      Pop: {s.population.toLocaleString()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Conservation Info */}
            <Card className="mt-12 p-8 bg-gradient-to-br from-destructive/5 to-accent/5 border-destructive/20">
              <div className="max-w-3xl mx-auto space-y-4">
                <h2 className="text-2xl font-bold text-center">Why Conservation Matters</h2>
                <p className="text-muted-foreground">
                  The IUCN Red List categories help us understand extinction risk and prioritize
                  conservation actions. India has implemented various protection measures including:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Wildlife Protection Act, 1972</strong> — Legal framework for species protection</li>
                  <li>• <strong>Biological Diversity Act, 2002</strong> — Conservation of biological resources</li>
                  <li>• <strong>Project Tiger (1973)</strong> — Tiger conservation initiative</li>
                  <li>• <strong>Project Elephant (1992)</strong> — Elephant habitat protection</li>
                  <li>• <strong>National Parks & Sanctuaries</strong> — 100+ protected areas</li>
                  <li>• <strong>Plant Variety Protection Act, 2001</strong> — Protecting plant biodiversity</li>
                </ul>
              </div>
            </Card>
          </>
        )}

      </div>
    </div>
  );
};

export default Conservation;
