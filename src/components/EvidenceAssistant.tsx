import React, { useState } from "react";
import { HeritageRecord } from "../types/heritage";
import { answerQuestion } from "../services/nlpEngine";
import { MessageSquare, Sparkles, Send, ShieldCheck, AlertCircle, Compass } from "lucide-react";

interface EvidenceAssistantProps {
  records: HeritageRecord[];
  selectedRecord: HeritageRecord;
  onSelectRecord: (id: string) => void;
}

export const EvidenceAssistant: React.FC<EvidenceAssistantProps> = ({
  records,
  selectedRecord,
  onSelectRecord,
}) => {
  const [activeTab, setActiveTab] = useState<"assistant" | "provenance" | "related">("assistant");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);

    setTimeout(() => {
      const resp = answerQuestion(question, records);
      setAnswer(resp);
      setLoading(false);
    }, 400);
  };

  // Find related records
  const related = records
    .filter((r) => r.recordId !== selectedRecord.recordId)
    .filter((r) => r.state === selectedRecord.state || r.siteType === selectedRecord.siteType || (r.dynasty && r.dynasty === selectedRecord.dynasty))
    .slice(0, 3);

  return (
    <div className="flex flex-col h-full bg-[#0d121f] border-l border-gray-800 text-gray-200">
      {/* Top Banner */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-white text-xs truncate max-w-[180px]">
              {selectedRecord.monumentName}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-800 text-amber-400 border border-gray-700">
            {selectedRecord.recordId}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 text-xs gap-1 mt-3">
          <button
            onClick={() => setActiveTab("assistant")}
            className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium transition-colors text-center whitespace-nowrap ${
              activeTab === "assistant" ? "bg-amber-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Assistant
          </button>
          <button
            onClick={() => setActiveTab("provenance")}
            className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium transition-colors text-center whitespace-nowrap ${
              activeTab === "provenance" ? "bg-amber-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Provenance
          </button>
          <button
            onClick={() => setActiveTab("related")}
            className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium transition-colors text-center whitespace-nowrap ${
              activeTab === "related" ? "bg-amber-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Related
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 text-xs space-y-4">
        {activeTab === "assistant" && (
          <div className="space-y-3">
            <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fact-Grounded Archival AI</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Answers cite record IDs strictly from verified archival field records. Missing or contested facts are stated, never halluncinated.
              </p>
            </div>

            <div>
              <label className="text-gray-400 block mb-1.5 font-medium">Ask the Heritage Archive:</label>
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Which monuments use granite? Who built Konark? List stepwells..."
                  rows={3}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  "Which monuments use granite?",
                  "Who built Konark?",
                  "List monuments in Gujarat",
                  "Which stepwells are in the dataset?"
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuestion(s);
                    }}
                    className="px-2 py-1 rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-[10px] transition-colors border border-gray-700"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="w-full mt-3 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? "Querying Archive..." : "Query Evidence Archive"}</span>
              </button>
            </div>

            {/* Answer Display */}
            {answer && (
              <div className="p-3 bg-gray-950/90 border border-gray-800 rounded-lg text-gray-200 leading-relaxed text-xs whitespace-pre-wrap">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                  Corroborated Answer:
                </span>
                {answer}
              </div>
            )}
          </div>
        )}

        {activeTab === "provenance" && (
          <div className="space-y-3">
            <img
              src="/images/info-provenance.png"
              alt="Provenance diagram"
              className="w-full rounded-lg border border-gray-800 object-cover"
            />
            <div className="p-3 bg-gray-950/60 rounded-lg border border-gray-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Provenance:</span>
                <span className="text-amber-400 font-bold uppercase">{selectedRecord.provenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Validation:</span>
                <span className="text-emerald-400 font-bold uppercase">{selectedRecord.validationStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Coordinates:</span>
                <span className="text-white font-mono">
                  {selectedRecord.coordinates ? `${selectedRecord.coordinates.lat}, ${selectedRecord.coordinates.lng}` : "Unplotted"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-gray-400 block mb-1 font-medium">Source Archival Text:</span>
              <p className="p-2.5 bg-gray-950 rounded border border-gray-800 italic text-[11px] text-gray-300 leading-relaxed">
                "{selectedRecord.sourceText}"
              </p>
            </div>

            {selectedRecord.uncertainties.length > 0 && (
              <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg">
                <span className="font-semibold text-amber-400 text-xs block mb-1">
                  Flagged Archival Uncertainties:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-gray-300 text-[11px]">
                  {selectedRecord.uncertainties.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "related" && (
          <div className="space-y-3">
            <p className="text-gray-400 text-xs">
              Correlated heritage sites based on shared architectural style, dynasty, or geography:
            </p>
            {related.map((r) => (
              <div
                key={r.recordId}
                onClick={() => onSelectRecord(r.recordId)}
                className="p-3 bg-gray-950/70 hover:bg-gray-800/60 border border-gray-800 rounded-lg cursor-pointer transition-colors space-y-1"
              >
                <div className="font-semibold text-white text-xs">{r.monumentName}</div>
                <div className="text-[11px] text-amber-400">{r.district}, {r.state} · {r.siteType}</div>
                <div className="text-[10px] text-gray-400">{r.historicalPeriod}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
