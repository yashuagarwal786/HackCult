import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { HeritageRecord, ExpeditionTrail, ExpeditionWaypoint } from "../types/heritage";
import { EXPEDITION_TRAILS } from "../data/expeditions";
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Calendar, 
  Users, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Globe2, 
  Eye, 
  Sparkles,
  Maximize2
} from "lucide-react";

interface InteractiveMapProps {
  records: HeritageRecord[];
  selectedId: string;
  onSelectMonument: (id: string) => void;
}

type TileSource = "osm" | "satellite" | "topo";

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  records,
  selectedId,
  onSelectMonument,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTrailId, setActiveTrailId] = useState<string>("EXP-WEST-01");
  const [selectedWaypoint, setSelectedWaypoint] = useState<ExpeditionWaypoint | null>(null);
  const [mapMode, setMapMode] = useState<"all" | "expedition">("expedition");
  const [tileSource, setTileSource] = useState<TileSource>("osm");

  const activeTrail = EXPEDITION_TRAILS.find((t) => t.id === activeTrailId) || EXPEDITION_TRAILS[0];

  // Helper to switch base tiles cleanly without API keys
  const getTileConfig = (type: TileSource) => {
    switch (type) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
          maxZoom: 18,
        };
      case "topo":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a> & USGS',
          maxZoom: 18,
        };
      case "osm":
      default:
        return {
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        };
    }
  };

  // Map Initialization & Container Resize Observer
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.8, 74.5],
        zoom: 6,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Base tile layer (100% free OpenStreetMap, no API key required)
      const config = getTileConfig(tileSource);
      const baseLayer = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
      }).addTo(map);

      tileLayerRef.current = baseLayer;
      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    // ResizeObserver ensures Leaflet recalculates layout when rendered inside flex containers
    const ro = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    ro.observe(mapContainerRef.current);

    return () => ro.disconnect();
  }, []);

  // Update Tile Layer when tileSource changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = getTileConfig(tileSource);
    const newTile = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newTile;
  }, [tileSource]);

  // Update Markers, Route, and Bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routeLayer = routeLayerRef.current;

    if (!map || !markersLayer || !routeLayer) return;

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
            border: 2px solid #ffffff;
            border-radius: 50%;
            width: ${isSelected ? '24px' : '18px'};
            height: ${isSelected ? '24px' : '18px'};
            box-shadow: 0 0 ${isSelected ? '18px rgba(225,29,72,0.95)' : '10px rgba(217,119,6,0.85)'};
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
          ">
            ${isSelected ? '★' : ''}
          </div>
        `,
        iconSize: isSelected ? [24, 24] : [18, 18],
        iconAnchor: isSelected ? [12, 12] : [9, 9],
      });

      const marker = L.marker([rec.coordinates.lat, rec.coordinates.lng], { icon: customIcon });
      marker.bindPopup(`
        <div style="padding: 6px; font-family: sans-serif; min-width: 200px;">
          <div style="font-weight: 700; color: #f8fafc; font-size: 14px; margin-bottom: 2px;">${rec.monumentName}</div>
          <div style="font-size: 11px; color: #fbbf24; margin-bottom: 4px;">${rec.district}, ${rec.state} · ${rec.siteType}</div>
          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px;">${rec.historicalPeriod}</div>
          <button style="background: #d97706; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; width: 100%; text-align: center;" onclick="window.selectMonument('${rec.recordId}')">
            View Archival Record (${rec.recordId})
          </button>
        </div>
      `);

      marker.on("click", () => {
        onSelectMonument(rec.recordId);
      });

      markersLayer.addLayer(marker);
    });

    // 2. Plot Active Explorer Fellowship Expedition Route
    const latlngs: [number, number][] = [];

    if (mapMode === "expedition" && activeTrail) {
      activeTrail.waypoints.forEach((wp) => {
        latlngs.push([wp.coordinates.lat, wp.coordinates.lng]);
      });

      // Animated/styled Route Lines
      const routeGlow = L.polyline(latlngs, {
        color: activeTrail.color,
        weight: 7,
        opacity: 0.35,
        lineCap: "round",
      });
      routeLayer.addLayer(routeGlow);

      const routeLine = L.polyline(latlngs, {
        color: activeTrail.color,
        weight: 3.5,
        opacity: 0.95,
        dashArray: "8, 10",
      });
      routeLayer.addLayer(routeLine);

      // Numbered Waypoint Markers (clean, never clutter)
      activeTrail.waypoints.forEach((wp, index) => {
        const isCurrent = selectedWaypoint?.name === wp.name;
        const wpIcon = L.divIcon({
          className: "custom-wp-pin",
          html: `
            <div style="
              background: ${isCurrent ? '#ffffff' : activeTrail.color};
              color: ${isCurrent ? '#111827' : '#111827'};
              border: 2px solid ${isCurrent ? activeTrail.color : '#ffffff'};
              border-radius: 50%;
              width: 26px;
              height: 26px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: 800;
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              cursor: pointer;
              transform: ${isCurrent ? 'scale(1.2)' : 'scale(1)'};
              transition: transform 0.2s ease;
            " title="Day ${wp.day}: ${wp.name}">
              ${wp.day}
            </div>
            <div style="
              background: rgba(17, 24, 39, 0.92);
              color: #f3f4f6;
              border: 1px solid rgba(255, 255, 255, 0.15);
              border-radius: 4px;
              padding: 1px 6px;
              font-size: 10px;
              font-weight: 600;
              white-space: nowrap;
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              top: 28px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              pointer-events: none;
            ">
              ${wp.name.split(" ")[0]}
            </div>
          `,
          iconSize: [26, 46],
          iconAnchor: [13, 13],
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
    }

    // Robust Fit Bounds with Timeout to ensure layout measurement is accurate
    const fitTimer = setTimeout(() => {
      map.invalidateSize();
      if (latlngs.length > 1) {
        map.fitBounds(L.latLngBounds(latlngs).pad(0.18), {
          animate: true,
          maxZoom: 12,
        });
      } else if (records.length > 0) {
        const monumentPoints = records
          .filter((r) => r.coordinates)
          .map((r) => [r.coordinates!.lat, r.coordinates!.lng] as [number, number]);
        if (monumentPoints.length > 0) {
          map.fitBounds(L.latLngBounds(monumentPoints).pad(0.15));
        }
      }
    }, 150);

    // Global callback for popups
    (window as any).selectMonument = (id: string) => {
      onSelectMonument(id);
    };

    return () => clearTimeout(fitTimer);
  }, [records, selectedId, mapMode, activeTrailId, selectedWaypoint, onSelectMonument]);

  return (
    <div className="flex flex-col h-full bg-[#0d121f] text-gray-200 rounded-xl overflow-hidden border border-amber-950/40 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-[#121826]/90 border-b border-gray-800 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-wide">
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

        {/* Controls: Layer Switcher & Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Basemap Switcher */}
          <div className="flex items-center bg-gray-900/90 rounded-lg p-1 border border-gray-800 text-xs">
            <button
              onClick={() => setTileSource("osm")}
              className={`px-2.5 py-1 rounded transition-colors ${
                tileSource === "osm" ? "bg-amber-600 text-white font-medium shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              Map (OSM)
            </button>
            <button
              onClick={() => setTileSource("satellite")}
              className={`px-2.5 py-1 rounded transition-colors ${
                tileSource === "satellite" ? "bg-amber-600 text-white font-medium shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setTileSource("topo")}
              className={`px-2.5 py-1 rounded transition-colors ${
                tileSource === "topo" ? "bg-amber-600 text-white font-medium shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Mode Switcher */}
          <button
            onClick={() => setMapMode(mapMode === "expedition" ? "all" : "expedition")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              mapMode === "expedition"
                ? "bg-amber-600 text-white border-amber-500 shadow-md"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:text-white"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Fellowship Routes ({EXPEDITION_TRAILS.length})</span>
          </button>
        </div>
      </div>

      {/* Expedition Cohort Selector Bar */}
      {mapMode === "expedition" && (
        <div className="px-5 py-2.5 bg-gray-900/80 border-b border-gray-800 flex items-center gap-3 overflow-x-auto text-xs shrink-0">
          <span className="text-gray-400 uppercase tracking-wider text-[11px] shrink-0 font-semibold">
            Fellowship Cohort:
          </span>
          {EXPEDITION_TRAILS.map((trail) => (
            <button
              key={trail.id}
              onClick={() => {
                setActiveTrailId(trail.id);
                setSelectedWaypoint(trail.waypoints[0]);
              }}
              className={`px-3 py-1 rounded-md transition-all shrink-0 flex items-center gap-2 border ${
                activeTrailId === trail.id
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold"
                  : "bg-gray-800/40 border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: trail.color }} />
              <span>{trail.title}</span>
              <span className="text-[10px] text-gray-400 font-mono">({trail.totalKm} km)</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Map + Slide-out Waypoint Drawer */}
      <div className="relative flex-1 min-h-[480px] w-full flex overflow-hidden">
        <div ref={mapContainerRef} className="flex-1 h-full w-full z-0" />

        {/* Slide-out Waypoint / Field Observation Card */}
        {selectedWaypoint && (
          <div className="absolute top-4 right-4 z-10 w-84 max-w-[90%] max-h-[88%] overflow-y-auto bg-gray-900/95 backdrop-blur-md p-4 rounded-xl border border-gray-800 shadow-2xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Day {selectedWaypoint.day} Expedition Stop
                </span>
                <h3 className="text-sm font-semibold text-white mt-1 leading-snug">{selectedWaypoint.name}</h3>
                <p className="text-xs text-gray-400">{selectedWaypoint.location}</p>
              </div>
              <button
                onClick={() => setSelectedWaypoint(null)}
                className="text-gray-500 hover:text-white text-sm p-1"
                aria-label="Close waypoint details"
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
            <div className="bg-gray-800/60 p-2.5 rounded-lg border border-gray-800 text-xs">
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
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors shadow"
              >
                Open Full Archival Record ({selectedWaypoint.monumentId})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="px-5 py-3 bg-[#0a0f1a] border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 shrink-0">
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
            <span>Fellowship Waypoints ({activeTrail.waypoints.length})</span>
          </div>
        </div>
        <div className="text-[11px] text-gray-500">
          OpenStreetMap & Esri GIS tiles · WGS84 Geocoding · Zero API Key Dependency
        </div>
      </div>
    </div>
  );
};
