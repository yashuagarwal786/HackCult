import React from "react";
import { 
  FileText, 
  Layers, 
  Compass, 
  Database, 
  Box, 
  CheckCircle2, 
  AlertTriangle,
  Award
} from "lucide-react";
import { HeritageRecord } from "../types/heritage";

export type TabKey = "ingest" | "ocr" | "explorer" | "map" | "3d" | "dataset";

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
  records: HeritageRecord[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  records,
}) => {
  const verifiedCount = records.filter((r) => r.validationStatus === "verified").length;
  const reviewCount = records.filter((r) => r.validationStatus === "needs-review").length;

  const NAV_ITEMS: { key: TabKey; label: string; icon: any; badge?: string }[] = [
    { key: "ingest", label: "Ingest & Extract", icon: FileText },
    { key: "ocr", label: "OCR & Epigraphy", icon: Layers, badge: "Pathway 2" },
    { key: "3d", label: "3D Digital Twin", icon: Box, badge: "Pathway 1" },
    { key: "map", label: "Fellowship Routes", icon: Compass, badge: "Pathway 3" },
    { key: "explorer", label: "Monuments Atlas", icon: Database },
    { key: "dataset", label: "Dataset Workspace", icon: Award },
  ];

  return (
    <aside className="w-64 border-r border-gray-800 bg-[#0d121f] flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2">
          <img
            src="/images/logo.png"
            alt="Heritage Atlas"
            className="w-9 h-9 rounded-lg object-cover border border-amber-500/30 shadow-md"
          />
          <div>
            <h1 className="font-bold text-white text-sm tracking-wide flex items-center gap-1.5">
              <span>HeritageAtlas</span>
            </h1>
            <p className="text-[10px] text-amber-400 font-medium">IITGN Cultural Intelligence</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-amber-600 text-white shadow-lg font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-amber-800/80 text-amber-100"
                        : "bg-gray-800 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Archival Metrics */}
        <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl space-y-2">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Dataset Health
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Total Archival Records</span>
            <span className="text-white font-mono font-bold">{records.length}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verified
            </span>
            <span className="text-emerald-400 font-mono font-bold">{verifiedCount}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Needs Review
            </span>
            <span className="text-amber-400 font-mono font-bold">{reviewCount}</span>
          </div>
        </div>
      </div>

      {/* Footer Track info */}
      <div className="p-3 bg-gradient-to-br from-amber-950/30 to-gray-900/60 rounded-xl border border-amber-900/30 text-[11px] space-y-1">
        <div className="text-amber-400 font-bold flex items-center gap-1">
          <span>Blithchron '27 · Track 2</span>
        </div>
        <div className="text-gray-400 text-[10px] leading-tight">
          Problem ID: HC26-CULT01
        </div>
        <div className="text-gray-500 text-[10px]">
          Digital Revitalisation of Cultural Archives
        </div>
      </div>
    </aside>
  );
};
