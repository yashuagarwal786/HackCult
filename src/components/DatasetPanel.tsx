import React from "react";
import { HeritageRecord, Validation } from "../types/heritage";
import { Download, Edit3, CheckCircle2, AlertTriangle, Layers, FileSpreadsheet } from "lucide-react";

interface DatasetPanelProps {
  records: HeritageRecord[];
  onUpdate: (id: string, patch: Partial<HeritageRecord>) => void;
  onSelect: (id: string) => void;
}

export const DatasetPanel: React.FC<DatasetPanelProps> = ({
  records,
  onUpdate,
  onSelect,
}) => {
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `heritage-atlas-dataset-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportGeoJson = () => {
    const geoJson = {
      type: "FeatureCollection",
      features: records
        .filter((r) => r.coordinates)
        .map((r) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [r.coordinates!.lng, r.coordinates!.lat],
          },
          properties: {
            recordId: r.recordId,
            monumentName: r.monumentName,
            siteType: r.siteType,
            state: r.state,
            district: r.district,
            historicalPeriod: r.historicalPeriod,
            materials: r.constructionMaterials,
            features: r.architecturalFeatures,
            provenance: r.provenance,
            validationStatus: r.validationStatus,
          },
        })),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geoJson, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `heritage-atlas-gis-layers.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-5 rounded-xl bg-[#0f1523] border border-gray-800 shadow-xl gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-wide">
            Dataset Curation & Archival Workspace
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Peer review portal for digital archivists, epigraphers, and IIT Gandhinagar fellows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportGeoJson}
            className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium flex items-center gap-2 border border-gray-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export GeoJSON (GIS)</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dataset JSON</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/90 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Monument Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Site Type</th>
                <th className="py-3 px-4">Period / Dynasty</th>
                <th className="py-3 px-4">Uncertainties</th>
                <th className="py-3 px-4">Provenance</th>
                <th className="py-3 px-4">Validation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-sans">
              {records.map((r) => (
                <tr
                  key={r.recordId}
                  onClick={() => onSelect(r.recordId)}
                  className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{r.recordId}</td>
                  <td className="py-3 px-4 font-medium text-white">{r.monumentName}</td>
                  <td className="py-3 px-4 text-gray-300">{r.district}, {r.state}</td>
                  <td className="py-3 px-4 text-gray-300">{r.siteType}</td>
                  <td className="py-3 px-4 text-gray-400">{r.historicalPeriod}</td>
                  <td className="py-3 px-4">
                    {r.uncertainties.length > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{r.uncertainties.length} Flagged</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-800 text-gray-300 border border-gray-700">
                      {r.provenance}
                    </span>
                  </td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={r.validationStatus}
                      onChange={(e) => onUpdate(r.recordId, { validationStatus: e.target.value as Validation })}
                      className="bg-gray-950 border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="verified">Verified</option>
                      <option value="needs-review">Needs Review</option>
                      <option value="draft">Draft</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
