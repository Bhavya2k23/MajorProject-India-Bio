import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";

interface Species {
  id: number;
  common_name: string;
  species_name: string;
  status: string;
  zone: string;
  lat: number;
  lon: number;
}

interface MapComponentProps {
  species: Species[];
}

const MapComponent = ({ species }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom icon function based on status
    const getMarkerColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "least concern":
          return "#22c55e";
        case "vulnerable":
        case "near threatened":
          return "#eab308";
        case "endangered":
          return "#ef4444";
        case "critically endangered":
          return "#1f2937";
        default:
          return "#3b82f6";
      }
    };

    // Add markers for each species
    species.forEach((s) => {
      const color = getMarkerColor(s.status);

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([s.lat, s.lon], { icon: customIcon }).addTo(map);

      marker.bindPopup(
        `<div class="p-2">
          <h4 class="font-bold text-sm">${s.common_name}</h4>
          <p class="text-xs italic text-gray-600">${s.species_name}</p>
          <div class="mt-2 space-y-1">
            <p class="text-xs"><strong>Zone:</strong> ${s.zone}</p>
            <p class="text-xs"><strong>Status:</strong> ${s.status}</p>
          </div>
        </div>`
      );
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [species]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legend */}
      <Card className="absolute bottom-4 right-4 p-4 z-[1000] bg-background/95 backdrop-blur">
        <h4 className="text-sm font-semibold mb-2">Conservation Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-safe" />
            <span>Least Concern</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-threatened" />
            <span>Vulnerable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-endangered" />
            <span>Endangered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-critical" />
            <span>Critically Endangered</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MapComponent;
