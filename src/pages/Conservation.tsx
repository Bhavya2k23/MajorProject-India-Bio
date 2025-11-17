import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface Species {
  id: number;
  common_name: string;
  species_name: string;
  status: string;
  zone: string;
  ecosystem: string;
  population?: string;
}

const Conservation = () => {
  const [speciesData, setSpeciesData] = useState<Species[]>([]);

  useEffect(() => {
    fetch("/data/species.json")
      .then((res) => res.json())
      .then((data) => setSpeciesData(data))
      .catch((error) => console.error("Error loading species data:", error));
  }, []);

  const statusCategories = [
    {
      name: "Least Concern",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-status-safe text-status-safe-foreground",
      borderColor: "border-status-safe",
      description: "Species are widespread and abundant",
    },
    {
      name: "Vulnerable",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "bg-status-threatened text-status-threatened-foreground",
      borderColor: "border-status-threatened",
      description: "Facing high risk of extinction in the wild",
    },
    {
      name: "Endangered",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "bg-status-endangered text-status-endangered-foreground",
      borderColor: "border-status-endangered",
      description: "Facing very high risk of extinction",
    },
    {
      name: "Critically Endangered",
      icon: <XCircle className="h-5 w-5" />,
      color: "bg-status-critical text-status-critical-foreground",
      borderColor: "border-status-critical",
      description: "Facing extremely high risk of extinction",
    },
  ];

  const getSpeciesByStatus = (status: string) => {
    return speciesData.filter((s) => s.status === status);
  };

  const getPercentage = (status: string) => {
    if (speciesData.length === 0) return 0;
    const count = getSpeciesByStatus(status).length;
    return Math.round((count / speciesData.length) * 100);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold">Conservation Status</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Understanding the conservation status of species helps prioritize
            protection efforts and track biodiversity health
          </p>
        </div>

        {/* Overview Stats */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Conservation Overview</h2>
            <p className="text-muted-foreground">
              Distribution of species by IUCN conservation status
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statusCategories.map((category) => {
              const count = getSpeciesByStatus(category.name).length;
              return (
                <div key={category.name} className="text-center space-y-2">
                  <div
                    className={`inline-flex p-4 rounded-full ${category.color} mb-2`}
                  >
                    {category.icon}
                  </div>
                  <div className="text-3xl font-bold">{count}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {getPercentage(category.name)}% of total
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Status Categories */}
        <div className="space-y-6">
          {statusCategories.map((category, index) => {
            const species = getSpeciesByStatus(category.name);
            const percentage = getPercentage(category.name);

            return (
              <Card
                key={index}
                className={`overflow-hidden border-l-4 ${category.borderColor} animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${category.color} flex-shrink-0`}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={category.color} variant="secondary">
                      {species.length} species
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Percentage of total
                      </span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>

                  {/* Species List */}
                  {species.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">
                        Species in this category:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {species.map((s) => (
                          <div
                            key={s.id}
                            className="p-3 bg-secondary/50 rounded-lg space-y-1"
                          >
                            <div className="font-medium text-sm">
                              {s.common_name}
                            </div>
                            <div className="text-xs text-muted-foreground italic">
                              {s.species_name}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {s.zone}
                              </Badge>
                              {s.population && (
                                <Badge variant="outline" className="text-xs">
                                  Pop: {s.population}
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
            <h2 className="text-2xl font-bold text-center">
              Why Conservation Matters
            </h2>
            <p className="text-muted-foreground">
              The IUCN Red List categories help us understand extinction risk and
              prioritize conservation actions. India has implemented various
              protection measures including:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Wildlife Protection Act, 1972</strong> - Legal framework for species protection</li>
              <li>• <strong>Project Tiger (1973)</strong> - Tiger conservation initiative</li>
              <li>• <strong>Project Elephant (1992)</strong> - Elephant habitat protection</li>
              <li>• <strong>National Parks & Sanctuaries</strong> - 100+ protected areas</li>
              <li>• <strong>Biodiversity Act, 2002</strong> - Conservation of biological diversity</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Conservation;
