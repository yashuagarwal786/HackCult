import React, { useState } from "react";
import { SEED_RECORDS } from "./data/seedRecords";
import { HeritageRecord } from "./types/heritage";
import { Header } from "./components/Header";
import { Sidebar, TabKey } from "./components/Sidebar";
import { IngestPanel } from "./components/IngestPanel";
import { OcrPanel } from "./components/OcrPanel";
import { DigitalTwin3D } from "./components/DigitalTwin3D";
import { InteractiveMap } from "./components/InteractiveMap";
import { ExplorerPanel } from "./components/ExplorerPanel";
import { DatasetPanel } from "./components/DatasetPanel";
import { EvidenceAssistant } from "./components/EvidenceAssistant";

const EMPTY_DRAFT: HeritageRecord = {
  recordId: "HA-DRAFT",
  monumentName: "Modhera Sun Temple",
  siteType: "Temple & Stepped Tank",
  state: "Gujarat",
  district: "Mehsana",
  architecturalFeatures: ["Surya Kund stepped geometry", "52 carved pillar sabhamandapa", "Solar-aligned sanctum"],
  constructionMaterials: ["Golden-yellow sandstone"],
  historicalPeriod: "c. 1026–27 CE · Solanki dynasty",
  culturalSignificance: "Sun temple commissioned by King Bhimdev I; equinoctial sunrise directly illuminated inner garbhagriha.",
  language: "English / Regional Field Notes",
  keywords: ["Surya", "Solanki", "Modhera", "stepwell tank", "सूर्य मंदिर"],
  sourceText: "Field note: Visited the temple at Modhera in Mehsana district, Gujarat. The Sun Temple here was built by King Bhimdev I of the Solanki dynasty around 1026-27 CE.",
  uncertainties: [
    "Dating range 1026–27 CE — verify against epigraphic inscription in stepped tank wall.",
    "GPS coordinates not stated in unstructured text — manual geocoding required.",
  ],
  provenance: "synthetic",
  validationStatus: "draft",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("explorer");
  const [records, setRecords] = useState<HeritageRecord[]>(SEED_RECORDS);
  const [selectedId, setSelectedId] = useState<string>(SEED_RECORDS[0].recordId);

  // Ingest state
  const [rawText, setRawText] = useState(EMPTY_DRAFT.sourceText);
  const [draft, setDraft] = useState<HeritageRecord>(EMPTY_DRAFT);
  const [extracting, setExtracting] = useState(false);
  const [uploadName, setUploadName] = useState<string | null>(null);

  // Explorer filters & search
  const [globalSearch, setGlobalSearch] = useState("");
  const [query, setQuery] = useState("");
  const [fState, setFState] = useState("all");
  const [fType, setFType] = useState("all");

  const selectedRecord = records.find((r) => r.recordId === selectedId) || records[0];

  const handleSaveDraft = () => {
    const nextId = `HA-${String(records.length + 1).padStart(4, "0")}`;
    const newRecord: HeritageRecord = {
      ...draft,
      recordId: nextId,
      validationStatus: "verified",
      provenance: "user",
    };
    setRecords([newRecord, ...records]);
    setSelectedId(nextId);
    setActiveTab("explorer");
  };

  const handleUpdateRecord = (id: string, patch: Partial<HeritageRecord>) => {
    setRecords((prev) =>
      prev.map((r) => (r.recordId === id ? { ...r, ...patch } : r))
    );
  };

  const handleOcrIngestText = (text: string) => {
    setRawText(text);
    setActiveTab("ingest");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0f19] text-gray-100 font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        records={records}
      />

      {/* Center & Right Column Container */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Top Header */}
        <Header
          globalSearch={globalSearch}
          setGlobalSearch={(s) => {
            setGlobalSearch(s);
            setQuery(s);
            if (s.trim()) setActiveTab("explorer");
          }}
          onNewNote={() => setActiveTab("ingest")}
          onOpen3D={() => setActiveTab("3d")}
          onOpenMap={() => setActiveTab("map")}
        />

        {/* Workspace Body: Dynamic View + Right Evidence Assistant */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Main Working View */}
          <main className="flex-1 overflow-y-auto p-6 min-w-0">
            {activeTab === "ingest" && (
              <IngestPanel
                rawText={rawText}
                setRawText={setRawText}
                draft={draft}
                setDraft={setDraft}
                extracting={extracting}
                setExtracting={setExtracting}
                onSave={handleSaveDraft}
                uploadName={uploadName}
                setUploadName={setUploadName}
              />
            )}

            {activeTab === "ocr" && (
              <OcrPanel onIngestText={handleOcrIngestText} />
            )}

            {activeTab === "3d" && (
              <DigitalTwin3D />
            )}

            {activeTab === "map" && (
              <InteractiveMap
                records={records}
                selectedId={selectedId}
                onSelectMonument={(id) => {
                  setSelectedId(id);
                }}
              />
            )}

            {activeTab === "explorer" && (
              <ExplorerPanel
                records={records}
                selectedId={selectedId}
                onSelect={setSelectedId}
                query={query}
                setQuery={setQuery}
                fState={fState}
                setFState={setFState}
                fType={fType}
                setFType={setFType}
                onOpen3D={() => setActiveTab("3d")}
              />
            )}

            {activeTab === "dataset" && (
              <DatasetPanel
                records={records}
                onUpdate={handleUpdateRecord}
                onSelect={(id) => {
                  setSelectedId(id);
                  setActiveTab("explorer");
                }}
              />
            )}
          </main>

          {/* Right Evidence & Grounding Assistant Drawer */}
          <aside className="w-80 lg:w-96 hidden md:flex flex-col shrink-0 h-full">
            <EvidenceAssistant
              records={records}
              selectedRecord={selectedRecord}
              onSelectRecord={setSelectedId}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
