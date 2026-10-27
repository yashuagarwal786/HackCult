import React, { useState } from "react";
import { OCR_SAMPLES } from "../data/ocrSamples";
import { OcrDocumentSample, OcrDiff } from "../types/heritage";
import { 
  FileText, 
  Languages, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Upload,
  Check,
  X,
  Send
} from "lucide-react";

interface OcrPanelProps {
  onIngestText: (text: string) => void;
}

export const OcrPanel: React.FC<OcrPanelProps> = ({ onIngestText }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(OCR_SAMPLES[0].id);
  const [activeSample, setActiveSample] = useState<OcrDocumentSample>(OCR_SAMPLES[0]);
  const [acceptedDiffs, setAcceptedDiffs] = useState<Record<number, boolean>>({});

  const handleSelectDoc = (doc: OcrDocumentSample) => {
    setSelectedDocId(doc.id);
    setActiveSample(doc);
    setAcceptedDiffs({});
  };

  const handleToggleDiff = (index: number, accept: boolean) => {
    setAcceptedDiffs((prev) => ({ ...prev, [index]: accept }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#111827] to-[#111827] border border-amber-900/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white tracking-wide">
              Vision Transformer OCR & Archival NLP Pipeline
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Pathway 2: Active
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Transcribes regional scripts (Devanagari, Gujarati, Sanskrit, Tamil) and uncorrected field notebooks, preserving historical epigraphic source authenticity while producing verified research translations.
          </p>
        </div>

        {/* Script badges */}
        <div className="flex items-center gap-2">
          {["Devanagari", "Old Gujarati", "English Field Notes", "Tamil Epigraphy"].map((script) => (
            <span key={script} className="px-2.5 py-1 text-xs rounded-md bg-gray-800 text-gray-300 border border-gray-700">
              {script}
            </span>
          ))}
        </div>
      </div>

      {/* Document Selector Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
        <span className="text-gray-400 uppercase tracking-wider text-[11px] shrink-0">Archival Manuscripts:</span>
        {OCR_SAMPLES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handleSelectDoc(sample)}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2.5 border shrink-0 ${
              selectedDocId === sample.id
                ? "bg-amber-600 text-white border-amber-500 shadow-md font-medium"
                : "bg-gray-900/80 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <div className="text-left">
              <div>{sample.title}</div>
              <div className="text-[10px] opacity-80">{sample.script} · {sample.category}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Original Preserved Raw OCR */}
        <div className="flex flex-col bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-500" />
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                Raw Ingestion Source (Original Preserved)
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              Confidence Score: <span className="text-amber-400 font-mono font-bold">92.4%</span>
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            {activeSample.imageSrc && (
              <div className="mb-3 relative rounded-lg overflow-hidden border border-gray-800 h-32">
                <img
                  src={activeSample.imageSrc}
                  alt={activeSample.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] text-gray-300 font-mono">
                    Archival Plate Scan: {activeSample.id}
                  </span>
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-950/70 rounded-lg border border-gray-800/80 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap flex-1">
              {activeSample.rawOcrText}
            </div>

            <div className="mt-3 text-[11px] text-gray-500 italic">
              * Original character-level anomalies and effaced epigraph gaps are preserved for auditability.
            </div>
          </div>
        </div>

        {/* Right: Vision Transformer Corrected & Translated */}
        <div className="flex flex-col bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                Normalized Transcript & Translation
              </span>
            </div>
            <button
              onClick={() => onIngestText(activeSample.correctedText)}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Send to Ingestion</span>
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col gap-3 justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
                Corrected Transcript
              </span>
              <div className="p-3 bg-gray-950/70 rounded-lg border border-gray-800 font-mono text-xs text-amber-200/90 leading-relaxed whitespace-pre-wrap">
                {activeSample.correctedText}
              </div>
            </div>

            {/* Academic Translation */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mb-1 block flex items-center gap-1">
                <Languages className="w-3 h-3" />
                Modern Academic English Translation
              </span>
              <div className="p-3 bg-cyan-950/20 rounded-lg border border-cyan-900/40 text-xs text-cyan-100/90 leading-relaxed">
                {activeSample.translation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop Correction Ledger */}
      <div className="bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Human-in-the-Loop Epigraphic Correction Ledger
            </h3>
            <p className="text-xs text-gray-400">
              Verify detected OCR errors, archaic dialect transliterations, and flagged uncertainty tokens.
            </p>
          </div>
          <span className="text-xs text-amber-400 font-medium">
            {activeSample.diffs.length} Flagged Token Diff(s)
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-[11px]">
                <th className="py-2.5 px-3">Original Token</th>
                <th className="py-2.5 px-3">Normalized Correction</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Human Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {activeSample.diffs.map((diff, idx) => {
                const status = acceptedDiffs[idx];
                return (
                  <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-rose-400 line-through">{diff.original}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-medium">{diff.corrected}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">
                        {Math.round(diff.confidence * 100)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      {diff.uncertain ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Uncertain · Review
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          High Confidence
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleDiff(idx, true)}
                          className={`p-1 rounded transition-colors ${
                            status === true
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-800 text-gray-400 hover:text-emerald-400"
                          }`}
                          title="Accept Correction"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleDiff(idx, false)}
                          className={`p-1 rounded transition-colors ${
                            status === false
                              ? "bg-rose-600 text-white"
                              : "bg-gray-800 text-gray-400 hover:text-rose-400"
                          }`}
                          title="Reject Correction"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Architectural Terminology Dictionary */}
      <div className="bg-[#0f1523] rounded-xl border border-gray-800 shadow-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Automated Architectural Terminology Glossary
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeSample.architecturalTermsFound.map((term, i) => (
            <div key={i} className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
              <div className="font-semibold text-amber-400 text-xs">{term.term}</div>
              <p className="text-gray-300 text-[11px] mt-1 leading-relaxed">{term.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
