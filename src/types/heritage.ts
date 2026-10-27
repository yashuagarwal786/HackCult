export type Provenance = "verified" | "synthetic" | "user" | "ai";
export type Validation = "verified" | "needs-review" | "draft";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HeritageRecord {
  recordId: string;
  monumentName: string;
  siteType: string;
  state: string;
  district: string;
  architecturalFeatures: string[];
  constructionMaterials: string[];
  historicalPeriod: string;
  culturalSignificance: string;
  language: string;
  keywords: string[];
  sourceText: string;
  uncertainties: string[];
  provenance: Provenance;
  validationStatus: Validation;
  coordinates?: Coordinates;
  image?: string;
  dynasty?: string;
  century?: string;
  has3DModel?: boolean;
  modelType?: "stepwell" | "vimana" | "wheel" | "fort";
  audioGuideUrl?: string;
}

export interface OcrDiff {
  original: string;
  corrected: string;
  uncertain: boolean;
  confidence: number;
  contextSnippet?: string;
  pos?: number;
}

export interface OcrDocumentSample {
  id: string;
  title: string;
  script: "Devanagari" | "English" | "Gujarati" | "Tamil";
  category: "Field Note" | "Stone Inscription" | "Travel Journal" | "Survey Report";
  rawOcrText: string;
  correctedText: string;
  translation: string;
  diffs: OcrDiff[];
  imageSrc?: string;
  architecturalTermsFound: { term: string; meaning: string }[];
}

export interface ExpeditionWaypoint {
  name: string;
  location: string;
  state: string;
  coordinates: Coordinates;
  day: number;
  monumentId?: string;
  notes: string;
  folklore: string;
  images: string[];
  studentFellows: string[];
}

export interface ExpeditionTrail {
  id: string;
  title: string;
  cohort: string;
  year: number;
  theme: string;
  summary: string;
  color: string;
  totalKm: number;
  waypoints: ExpeditionWaypoint[];
}
