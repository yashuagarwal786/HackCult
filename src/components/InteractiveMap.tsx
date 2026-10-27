import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { HeritageRecord, ExpeditionTrail, ExpeditionWaypoint } from "../types/heritage";
import { EXPEDITION_TRAILS } from "../data/expeditions";
import { MapPin, Navigation, Compass, Calendar, Users, BookOpen, Layers, CheckCircle2 } from "lucide-react";

interface InteractiveMapProps {
  records: HeritageRecord[];
  selectedId: string;
  onSelectMonument: (id: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  records,
  selectedId,
  onSelectMonument,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTrailId, setActiveTrailId] = useState<string>("EXP-WEST-01");
  const [selectedWaypoint, setSelectedWaypoint] = useState<ExpeditionWaypoint | null>(null);
  const [mapMode, setMapMode] = useState<"all" | "expedition">("expedition");

  const activeTrail = EXPEDITION_TRAILS.find((t) => t.id === activeTrailId) || EXPEDITION_TRAILS[0];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map centered on India
      const map = L.map(mapContainerRef.current, {
        center: [23.5, 78.5],
        zoom: 5,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // CartoDB Dark Matter tiles for heritage dark theme
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routeLayer = routeLayerRef.current;

    if (!map || !markersLayer || !routeLayer) return;

    // Clear previous layers
    markersLayer.clearLayers();
    routeLayer.clearLayers();

    // 1. Plot Verified Heritage Monuments
    records.forEach((rec) => {
      if (!rec.coordinates) return;

      const isSelected = rec.recordId === selectedId;
      const customIcon = L.divIcon({
        className: "custom-monument-marker",
        html: `
          <div style="
            background: ${isSelected ? '#e11d48' : '#d97706'};
            border: 2px solid white;
            border-radius: 50%;
            width: ${isSelected ? '22px' : '16px'};
            height: ${isSelected ? '22px' : '16px'};
            box-shadow: 0 0 ${isSelected ? '16px rgba(225,29,72,0.9)' : '8px rgba(217,119,6,0.8)'};
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 9px;
            font-weight: bold;
          ">
            ${isSelected ? '★' : ''}
          </div>
        `,
        iconSize: isSelected ? [22, 22] : [16, 16],
        iconAnchor: isSelected ? [11, 11] : [8, 8],
      });

      const marker = L.marker([rec.coordinates.lat, rec.coordinates.lng], { icon: customIcon });
      marker.bindPopup(`
        <div style="padding: 4px; font-family: sans-serif; min-width: 180px;">
          <div style="font-weight: 700; color: #1e293b; font-size: 14px;">${rec.monumentName}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${rec.district}, ${rec.state} · ${rec.siteType}</div>
          <div style="font-size: 11px; color: #334155; margin-bottom: 6px;">${rec.historicalPeriod}</div>
          <button style="background: #d97706; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;" onclick="window.selectMonument('${rec.recordId}')">
            View Archival Record
          </button>
        </div>
      `);

      marker.on("click", () => {
        onSelectMonument(rec.recordId);
      });

      markersLayer.addLayer(marker);
    });

    // 2. Plot Active Explorer Fellowship Expedition Route
    if (mapMode === "expedition" && activeTrail) {
      const latlngs: [number, number][] = activeTrail.waypoints.map((wp) => [
        wp.coordinates.lat,
        wp.coordinates.lng,
      ]);

      // Route Glow Outline
      const routeGlow = L.polyline(latlngs, {
        color: activeTrail.color,
        weight: 6,
        opacity: 0.35,
        lineCap: "round",
      });
      routeLayer.addLayer(routeGlow);

      // Solid Route Line
      const routeLine = L.polyline(latlngs, {
        color: activeTrail.color,
        weight: 3,
        opacity: 0.9,
        dashArray: "6, 8",
      });
      routeLayer.addLayer(routeLine);

      // Waypoint Markers with Day badge
      activeTrail.waypoints.forEach((wp, index) => {
        const wpIcon = L.divIcon({
          className: "custom-wp-marker",
          html: `
            <div style="
              background: ${activeTrail.color};
              color: #111827;
              border: 2px solid white;
              border-radius: 6px;
              padding: 2px 6px;
              font-size: 10px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>Day ${wp.day}</span>
              <span>•</span>
              <span>${wp.name.split(" ")[0]}</span>
            </div>
          `,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        });

        const wpMarker = L.marker([wp.coordinates.lat, wp.coordinates.lng], { icon: wpIcon });
        wpMarker.on("click", () => {
          setSelectedWaypoint(wp);
          if (wp.monumentId) {
            onSelectMonument(wp.monumentId);
          }
        });
        routeLayer.addLayer(wpMarker);
      });

      // Fit map bounds to expedition trail
      if (latlngs.length > 0) {
        map.fitBounds(L.latLngBounds(latlngs).pad(0.2));
      }
    }

    // Expose global callback for popup buttons
    (window as any).selectMonument = (id: string) => {
      onSelectMonument(id);
    };
  }, [records, selectedId, mapMode, activeTrailId, onSelectMonument]);

  return (
    <div className="flex flex-col h-full bg-[#0d121f] text-gray-200 rounded-xl overflow-hidden border border-amber-950/40 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-[#121826]/90 border-b border-gray-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium text-white tracking-wide">
                Geospatial Explorer Platform
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Pathway 3: Active
              </span>
            </div>
            <p className="text-xs text-gray-400">
              IIT Gandhinagar Explorer Fellowship travel trails & crowdsourced geolocations
            </p>
          </div>
        </div>

        {/* Trail Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMapMode(mapMode === "expedition" ? "all" : "expedition")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              mapMode === "expedition"
                ? "bg-amber-600 text-white border-amber-500"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:text-white"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Fellowship Routes ({EXPEDITION_TRAILS.length})</span>
          </button>
        </div>
      </div>

      {/* Expedition Selector Bar */}
      {mapMode === "expedition" && (
        <div className="px-5 py-2.5 bg-gray-900/60 border-b border-gray-800 flex items-center gap-3 overflow-x-auto text-xs">
          <span className="text-gray-400 uppercase tracking-wider text-[11px] shrink-0">Fellowship Cohort:</span>
          {EXPEDITION_TRAILS.map((trail) => (
            <button
              key={trail.id}
              onClick={() => {
                setActiveTrailId(trail.id);
                setSelectedWaypoint(trail.waypoints[0]);
              }}
              className={`px-3 py-1 rounded-md transition-all shrink-0 flex items-center gap-2 border ${
                activeTrailId === trail.id
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-medium"
                  : "bg-gray-800/40 border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: trail.color }} />
              <span>{trail.title}</span>
              <span className="text-[10px] text-gray-500 font-mono">({trail.totalKm} km)</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Map + Side Waypoint Panel */}
      <div className="relative flex-1 min-h-[480px] w-full flex">
        <div ref={mapContainerRef} className="flex-1 h-full z-0" />

        {/* Slide-out Waypoint / Field Observation Card */}
        {selectedWaypoint && (
          <div className="absolute top-4 right-4 z-10 w-80 max-h-[85%] overflow-y-auto bg-gray-900/95 backdrop-blur-md p-4 rounded-xl border border-gray-800 shadow-2xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Day {selectedWaypoint.day} Expedition Stop
                </span>
                <h3 className="text-sm font-semibold text-white mt-1">{selectedWaypoint.name}</h3>
                <p className="text-xs text-gray-400">{selectedWaypoint.location}</p>
              </div>
              <button
                onClick={() => setSelectedWaypoint(null)}
                className="text-gray-500 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            {/* Waypoint Image */}
            {selectedWaypoint.images.length > 0 && (
              <img
                src={selectedWaypoint.images[0]}
                alt={selectedWaypoint.name}
                className="w-full h-32 object-cover rounded-lg border border-gray-800"
              />
            )}

            {/* Field Notes */}
            <div className="bg-gray-800/50 p-2.5 rounded-lg border border-gray-800 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explorer Fellowship Field Log</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">{selectedWaypoint.notes}</p>
            </div>

            {/* Local Folklore */}
            <div className="bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/40 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Regional Folklore / Oral History
              </span>
              <p className="text-amber-200/90 italic text-[11px] mt-0.5">
                "{selectedWaypoint.folklore}"
              </p>
            </div>

            {/* Student Fellows */}
            <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                Fellows:
              </span>
              <span className="text-white font-medium">{selectedWaypoint.studentFellows.join(", ")}</span>
            </div>

            {selectedWaypoint.monumentId && (
              <button
                onClick={() => onSelectMonument(selectedWaypoint.monumentId!)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Open Full Archival Record ({selectedWaypoint.monumentId})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="px-5 py-3 bg-[#0a0f1a] border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-500 shadow-sm" />
            <span>Verified Monuments ({records.filter((r) => r.coordinates).length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500 shadow-sm" />
            <span>Selected Site</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-amber-400 border-dashed" />
            <span>Expedition Trail Waypoints ({activeTrail.waypoints.length})</span>
          </div>
        </div>
        <div className="text-[11px] text-gray-500">
          OpenStreetMap & CartoDB tiles · WGS84 Epigraph Geocoding
        </div>
      </div>
    </div>
  );
};
