import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";

interface Species {
  id: any;
  common_name: string;
  species_name: string;
  status: string;
  zone: string;
  ecosystem?: string;
  lat: number;
  lon: number;
}

interface MapComponentProps {
  species: Species[];
  onSpeciesClick?: (id: any) => void; // NEW: notify parent when marker clicked
}

const getMarkerColor = (status: string): string => {
  const s = status.toLowerCase();
  if (s === "safe" || s === "least concern") return "#22c55e";
  if (s === "near threatened")              return "#84cc16";
  if (s === "vulnerable")                   return "#eab308";
  if (s === "endangered")                   return "#f97316";
  if (s === "critically endangered")        return "#ef4444";
  if (s === "extinct in wild")              return "#a855f7";
  if (s === "extinct")                      return "#6b7280";
  return "#3b82f6";
};

const MapComponent = ({ species, onSpeciesClick }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Keep a stable ref to the callback so the effect closure doesn't go stale
  const onClickRef = useRef(onSpeciesClick);
  onClickRef.current = onSpeciesClick;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Re-render markers whenever species list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    species.forEach((s) => {
      if (!s.lat || !s.lon) return;

      const color = getMarkerColor(s.status);

      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            background-color:${color};
            width:14px; height:14px;
            border-radius:50%;
            border:2.5px solid white;
            box-shadow:0 2px 6px rgba(0,0,0,0.4);
            cursor:pointer;
            transition:transform 0.15s;
          "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([s.lat, s.lon], { icon: customIcon }).addTo(map);

      // ── Popup with "View Details" link ───────────────────────────────────
      const popupContent = `
        <div style="min-width:160px; font-family:system-ui,sans-serif;">
          <p style="font-weight:700;font-size:13px;margin:0 0 2px">${s.common_name}</p>
          <p style="font-size:11px;color:#555;font-style:italic;margin:0 0 6px">${s.species_name}</p>
          <div style="font-size:11px;margin-bottom:8px;line-height:1.6;">
            <div><strong>Zone:</strong> ${s.zone}</div>
            ${s.ecosystem ? `<div><strong>Ecosystem:</strong> ${s.ecosystem}</div>` : ""}
            <div><strong>Status:</strong> <span style="color:${color};font-weight:600">${s.status}</span></div>
          </div>
          <a
            href="/species/${s.id}"
            style="
              display:inline-block;padding:5px 12px;
              background:${color};color:white;font-size:11px;font-weight:600;
              border-radius:6px;text-decoration:none;cursor:pointer;
            "
            onclick="event.preventDefault();window.__mapNavTo__('${s.id}');"
          >View Details →</a>
        </div>`;

      marker.bindPopup(popupContent, { maxWidth: 220 });

      // Also handle direct marker click for faster navigation
      marker.on("click", () => {
        if (onClickRef.current) onClickRef.current(s.id);
      });
    });

    // Register a global bridge that the inline onclick can call
    (window as any).__mapNavTo__ = (id: string) => {
      if (onClickRef.current) onClickRef.current(id);
    };

    return () => {
      delete (window as any).__mapNavTo__;
    };
  }, [species]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legend */}
      <Card className="absolute bottom-4 right-4 p-4 z-[1000] bg-background/95 backdrop-blur-sm shadow-lg">
        <h4 className="text-xs font-bold mb-2 uppercase tracking-wide text-muted-foreground">Conservation Status</h4>
        <div className="space-y-1.5 text-xs">
          {[
            { label: "Safe / Least Concern",    color: "#22c55e" },
            { label: "Near Threatened",         color: "#84cc16" },
            { label: "Vulnerable",              color: "#eab308" },
            { label: "Endangered",              color: "#f97316" },
            { label: "Critically Endangered",   color: "#ef4444" },
            { label: "Extinct in Wild",         color: "#a855f7" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-2 border-t pt-2">
          Click a marker to view species
        </p>
      </Card>
    </div>
  );
};

export default MapComponent;
