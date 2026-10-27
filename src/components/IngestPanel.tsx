import React, { useRef } from "react";
import { HeritageRecord, Provenance, Validation } from "../types/heritage";
import { extractHeritageRecord } from "../services/nlpEngine";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  Database,
  ArrowRight
} from "lucide-react";

interface IngestPanelProps {
  rawText: string;
  setRawText: (v: string) => void;
  draft: HeritageRecord;
  setDraft: React.Dispatch<React.SetStateAction<HeritageRecord>>;
  extracting: boolean;
  setExtracting: (v: boolean) => void;
  onSave: () => void;
  uploadName: string | null;
  setUploadName: (name: string | null) => void;
}

export const IngestPanel: React.FC<IngestPanelProps> = ({
  rawText,
  setRawText,
  draft,
  setDraft,
  extracting,
  setExtracting,
  onSave,
  uploadName,
  setUploadName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRawText(String(reader.result || ""));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleTriggerExtraction = () => {
    if (!rawText.trim()) return;
    setExtracting(true);

    setTimeout(() => {
      const extracted = extractHeritageRecord(rawText);
      setDraft((prev) => ({
        ...prev,
        ...extracted,
        recordId: prev.recordId || "HA-DRAFT",
      } as HeritageRecord));
      setExtracting(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl border border-gray-800 shadow-2xl">
        <img
          src="/images/hero-archive.png"
          alt="Heritage archive"
          className="h-44 w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Blithchron '27 · HC26-CULT01
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Unstructured Cultural & Architectural Heritage Ingestion
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mt-1 leading-relaxed">
            Transform thousands of unstructured field notes, traveller journals, and photographic decks from the "archival graveyard" into verified, structured cultural knowledge.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Raw Source Ingestion */}
        <div className="bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Unstructured Archival Input
              </h3>
              <p className="text-xs text-gray-400">
                Paste raw field logs, OCR drafts, epigraphic notes, or upload document files.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.json,.csv,.md"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-gray-700"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          {uploadName && (
            <div className="px-3 py-1.5 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs text-amber-300 flex items-center justify-between">
              <span>Loaded: {uploadName}</span>
              <button onClick={() => setUploadName(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
          )}

          <div className="flex-1 flex flex-col">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste field note, OCR text, or architectural observation here..."
              rows={12}
              className="w-full flex-1 bg-gray-950/80 border border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
            />
          </div>

          <button
            onClick={handleTriggerExtraction}
            disabled={extracting || !rawText.trim()}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>{extracting ? "Extracting Entities & Features..." : "Extract Structured Heritage Record"}</span>
          </button>
        </div>

        {/* Right Column: Structured Review & Verification */}
        <div className="bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Structured Metadata Review
              </h3>
              <p className="text-xs text-gray-400">
                Inspect AI/NLP entity extraction, architectural categories, and flagged uncertainties before committing to the archive.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {draft.validationStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Monument Name</label>
              <input
                type="text"
                value={draft.monumentName}
                onChange={(e) => setDraft({ ...draft, monumentName: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Site Type</label>
              <input
                type="text"
                value={draft.siteType}
                onChange={(e) => setDraft({ ...draft, siteType: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">State</label>
              <input
                type="text"
                value={draft.state}
                onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">District</label>
              <input
                type="text"
                value={draft.district}
                onChange={(e) => setDraft({ ...draft, district: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Historical Period / Dynasty</label>
              <input
                type="text"
                value={draft.historicalPeriod}
                onChange={(e) => setDraft({ ...draft, historicalPeriod: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Language</label>
              <input
                type="text"
                value={draft.language}
                onChange={(e) => setDraft({ ...draft, language: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Architectural Features */}
          <div className="text-xs">
            <label className="text-gray-400 block mb-1">Extracted Architectural Features</label>
            <div className="flex flex-wrap gap-1.5">
              {draft.architecturalFeatures.map((f, i) => (
                <span key={i} className="px-2 py-1 rounded bg-gray-800 text-gray-200 border border-gray-700 text-[11px]">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Materials & Keywords */}
          <div className="text-xs">
            <label className="text-gray-400 block mb-1">Construction Materials</label>
            <div className="flex flex-wrap gap-1.5">
              {draft.constructionMaterials.map((m, i) => (
                <span key={i} className="px-2 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-900/40 text-[11px]">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Flagged Uncertainties */}
          {draft.uncertainties.length > 0 && (
            <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Flagged Uncertainties ({draft.uncertainties.length})</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-gray-300 text-[11px]">
                {draft.uncertainties.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onSave}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Save to Dataset</span>
            </button>
            <button
              onClick={() => setDraft({ ...draft, validationStatus: "needs-review" })}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors border border-gray-700"
            >
              Mark for Peer Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
