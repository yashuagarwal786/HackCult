import React from "react";
import { Search, PlusCircle, Sparkles, Box, Compass } from "lucide-react";

interface HeaderProps {
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  onNewNote: () => void;
  onOpen3D: () => void;
  onOpenMap: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  globalSearch,
  setGlobalSearch,
  onNewNote,
  onOpen3D,
  onOpenMap,
}) => {
  return (
    <header className="h-16 border-b border-gray-800 bg-[#0e1422]/90 backdrop-blur-md px-6 flex items-center justify-between gap-4 z-20 shrink-0">
      {/* Global Search Bar with Multilingual prompt */}
      <div className="flex-1 max-w-xl relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Global archival search — English · हिन्दी · संस्कृत · Gujarati..."
          className="w-full pl-9 pr-4 py-2 bg-gray-950/80 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpen3D}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-amber-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-amber-500/20 shadow-sm"
        >
          <Box className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Studio</span>
        </button>

        <button
          onClick={onOpenMap}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-cyan-500/20 shadow-sm"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Explorer Map</span>
        </button>

        <button
          onClick={onNewNote}
          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Archival Note</span>
        </button>
      </div>
    </header>
  );
};
