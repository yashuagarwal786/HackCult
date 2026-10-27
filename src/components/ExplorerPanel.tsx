import React from "react";
import { HeritageRecord } from "../types/heritage";
import { Search, MapPin, Box, Filter, CheckCircle2, AlertTriangle, Calendar, Layers } from "lucide-react";

interface ExplorerPanelProps {
  records: HeritageRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  query: string;
  setQuery: (q: string) => void;
  fState: string;
  setFState: (s: string) => void;
  fType: string;
  setFType: (t: string) => void;
  onOpen3D: () => void;
}

export const ExplorerPanel: React.FC<ExplorerPanelProps> = ({
  records,
  selectedId,
  onSelect,
  query,
  setQuery,
  fState,
  setFState,
  fType,
  setFType,
  onOpen3D,
}) => {
  const states = Array.from(new Set(records.map((r) => r.state))).sort();
  const siteTypes = Array.from(new Set(records.map((r) => r.siteType))).sort();

  const filtered = records.filter((r) => {
    if (fState !== "all" && r.state !== fState) return false;
    if (fType !== "all" && r.siteType !== fType) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const match =
        r.monumentName.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.siteType.toLowerCase().includes(q) ||
        r.architecturalFeatures.some((f) => f.toLowerCase().includes(q)) ||
        r.keywords.some((k) => k.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Filter Controls */}
      <div className="bg-[#0f1523] rounded-xl border border-gray-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">
              Heritage Intelligence Explorer
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Faceted exploration across India's architectural monuments, materials, and dynasties.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              Showing <span className="text-white font-bold">{filtered.length}</span> of {records.length} monuments
            </span>
          </div>
        </div>

        {/* Filter inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search monuments, features, Devanagari (e.g. सूर्य मंदिर, stepwell, granite)..."
              className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={fState}
              onChange={(e) => setFState(e.target.value)}
              className="w-full py-2 px-3 bg-gray-950 border border-gray-800 rounded-lg text-gray-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All States ({states.length})</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={fType}
              onChange={(e) => setFType(e.target.value)}
              className="w-full py-2 px-3 bg-gray-950 border border-gray-800 rounded-lg text-gray-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Architectural Types</option>
              {siteTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Monument Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((rec) => {
          const isSelected = rec.recordId === selectedId;

          return (
            <div
              key={rec.recordId}
              onClick={() => onSelect(rec.recordId)}
              className={`rounded-xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-[#141b2e] border-amber-500/70 shadow-2xl ring-1 ring-amber-500/50"
                  : "bg-[#0f1523] border-gray-800 hover:border-gray-700 hover:bg-[#121929]"
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 overflow-hidden bg-gray-950">
                  {rec.image ? (
                    <img
                      src={rec.image}
                      alt={rec.monumentName}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Layers className="w-10 h-10 opacity-30" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-950/80 text-amber-300 border border-amber-500/30">
                      {rec.recordId}
                    </span>
                    {rec.has3DModel && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white flex items-center gap-1 shadow-md">
                        <Box className="w-3 h-3" />
                        <span>3D Twin</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white bg-gray-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {rec.district}, {rec.state}
                    </span>
                    <span className="text-gray-300">{rec.siteType}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white text-base leading-snug tracking-wide">
                      {rec.monumentName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{rec.historicalPeriod}</span>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {rec.culturalSignificance}
                  </p>

                  {/* Architectural Feature Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rec.architecturalFeatures.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-gray-800/80 text-gray-300 text-[10px] border border-gray-700/60"
                      >
                        {f}
                      </span>
                    ))}
                    {rec.architecturalFeatures.length > 3 && (
                      <span className="text-[10px] text-gray-500 self-center">
                        +{rec.architecturalFeatures.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-gray-400 text-[11px] capitalize">{rec.provenance} archive</span>
                </div>
                {rec.has3DModel && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen3D();
                    }}
                    className="text-amber-400 hover:text-amber-300 font-medium text-[11px] flex items-center gap-1"
                  >
                    <span>Launch 3D</span>
                    <Box className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
