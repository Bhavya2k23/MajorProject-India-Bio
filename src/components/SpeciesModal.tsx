import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, AlertTriangle } from "lucide-react";

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

interface SpeciesModalProps {
  species: Species | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SpeciesModal = ({ species, open, onOpenChange }: SpeciesModalProps) => {
  if (!species) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{species.common_name}</DialogTitle>
          <DialogDescription className="italic text-base">
            {species.species_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status & Location */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(species.status)} >
              {species.status}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {species.zone}
            </Badge>
            <Badge variant="secondary">
              {species.ecosystem}
            </Badge>
          </div>

          {/* Description */}
          {species.description && (
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-sm text-muted-foreground">
                {species.description}
              </p>
            </div>
          )}

          {/* Population */}
          {species.population && (
            <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Population</h4>
                <p className="text-sm text-muted-foreground">
                  Estimated: {species.population}
                </p>
              </div>
            </div>
          )}

          {/* Threats */}
          {species.threats && species.threats.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Major Threats</h4>
                <ul className="space-y-1">
                  {species.threats.map((threat, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {threat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Coordinates */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Geographic Location</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Latitude: {species.lat}°</p>
              <p>Longitude: {species.lon}°</p>
              <p className="text-xs mt-2">
                * Representative coordinates, actual distribution may vary
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpeciesModal;
