# HeritageAtlas — Pitch Deck (10 Slides)
**Track 2: Culture & Digital Heritage (Blithchron '27, IIT Gandhinagar)**  
**Problem Statement ID:** HC26-CULT01  
**Project:** HeritageAtlas — Digital Revitalisation of Unstructured Cultural & Architectural Heritage Archives  

---

## Slide 1: Cover Slide
- **Title:** HeritageAtlas: Breathing Life into Unstructured Cultural & Architectural Archives
- **Subtitle:** An Intelligent, Multi-Pathway Platform for Grassroots Heritage Revitalisation
- **Hackathon:** Blithchron '27, IIT Gandhinagar · Open Innovation
- **Theme:** Culture, Media & Entertainment (Track 2: HC26-CULT01)
- **Team:** Yash Agarwal & Team
- **Core Value Proposition:** Rescuing Indian architectural heritage from the "archival graveyard" through WebGL 3D Digital Twins, Epigraphic Vision OCR, and Fellowship Geospatial Exploration.

---

## Slide 2: The Problem — The "Archival Graveyard"
- **Context at IIT Gandhinagar:** Programs like the **Explorer Fellowship** send hundreds of students across India, generating immense volumes of raw field photos, architectural measurements, regional manuscripts, and travel journals.
- **The Bottleneck:**
  1. **Data Flattening:** Living culture is trapped in dead presentation decks, fragmented Google Drive folders, and unindexed PDFs.
  2. **Script Barriers:** Historical Devanagari, regional stone epigraphs, and guild dialect notes remain unsearchable.
  3. **Spatial Disconnect:** Architectural discoveries lose their geographical and geological context when stripped from travel routes.
  4. **Uncertainty Blindness:** Ambiguous dates and oral folk claims are either discarded or blindly accepted without audit trails.

---

## Slide 3: The Solution — HeritageAtlas
- **A Single Unified Revitalisation Hub:**
  - Ingests raw multi-format data (photos, typed notes, OCR scans, CSVs).
  - Normalizes unstructured text into structured, reviewable `HeritageRecord` schemas.
  - Transparently flags uncertainties, epigraphic effacements, and oral claims.
  - Exports validated data to open research formats (JSON, GeoJSON, GIS layers).
- **Tri-Pathway Convergence:** Rather than choosing only one pathway, HeritageAtlas synergizes **Computer Vision 3D**, **Archival NLP OCR**, and **Geospatial Mapping** into a cohesive workflow.

---

## Slide 4: System Architecture & Data Flow
- **Client Layer:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Three.js (WebGL 2.0), Leaflet GIS.
- **Processing Layer:**
  - **NLP Entity Extractor:** Rule-based Named Entity Recognition (NER), architectural feature dictionary, and uncertainty classifier.
  - **Vision Transformer Epigraphy Engine:** Dual-script character confidence scoring and glossary linker.
  - **Evidence Grounding Engine:** Fact-checking engine that strictly cites Record IDs (`HA-0001`).
- **Data & Export Layer:**
  - Verified Heritage Record Store.
  - IITGN Explorer Fellowship Expedition Store.
  - Real-time GeoJSON / JSON export pipeline for academic researchers.

---

## Slide 5: Pathway 1 — 3D WebGL Digital Twin Studio
- **Photogrammetric 3D Reconstructions:**
  - **Rani ki Vav (Subterranean Stepwell):** 7 descending tiers, columned pavilion pavilions, and sacred groundwater reservoir.
  - **Konark Sun Temple Cosmic Wheel:** 16 radial spokes, central hub, and functional sundial shadow casting.
  - **Brihadeeswarar Vimana:** 66m granite monolithic capstone and seismic floating foundation.
- **Interactive Capabilities:**
  - Real-time **Solar Equinox Alignment Beam** showing astronomical illumination of sanctums.
  - Polygon mesh wireframe inspection (142,800 polygons, 78,420 vertices).
  - PBR lighting shaders: Noon Daylight, Golden Hour, and Night Torchlight.

---

## Slide 6: Pathway 2 — Vision Transformer OCR & Epigraphy
- **Multi-Script Archival Transcription:**
  - Transcribes historical **Devanagari Sanskrit**, **Old Gujarati stepwell logs**, and **English field notebooks**.
- **Human-in-the-Loop Correction Ledger:**
  - Side-by-side view: Preserved Original OCR vs. Normalized Research Transcript.
  - Character-level confidence heatmap and uncertainty flag tags.
  - Accept/Reject controls for digital epigraphers.
- **Architectural Glossary:** Auto-detects and explains classical Indian architectural terms (*Sabhamandapa*, *Surya Kund*, *Garbhagriha*, *Maru-Gurjara*).

---

## Slide 7: Pathway 3 — Geospatial Explorer Fellowship Mapping
- **Spatial Storytelling:**
  - Replaces static presentation decks with dynamic Leaflet / CartoDB dark mapping.
  - Plots complete **IIT Gandhinagar Explorer Fellowship travel expeditions**:
    - *Western Hydraulic & Solar Heritage:* Palaj ➔ Adalaj ➔ Modhera ➔ Patan ➔ Abhaneri ➔ Jaipur (1,420 km).
    - *Dravidian & Deccan Stone Guilds:* Thanjavur ➔ Madurai ➔ Hampi (2,150 km).
- **Enriched Waypoints:**
  - Student fellow attribution, expedition day, ambient measurements, and regional oral folklore.
- **Strict Geocoding Guardrail:** Records without verified coordinates are never plotted, preventing spatial misinformation.

---

## Slide 8: Database Schema & Entity Relationships
- **Unified Heritage Entity (`HeritageRecord`):**
  - Identifiers: `recordId`, `monumentName`, `siteType`.
  - Spatiotemporal: `state`, `district`, `coordinates (WGS84)`, `historicalPeriod`, `dynasty`, `century`.
  - Architectural Taxonomy: `architecturalFeatures[]`, `constructionMaterials[]`, `modelType`.
  - Research Audit: `sourceText`, `uncertainties[]`, `provenance`, `validationStatus`.
- **Relational Links:**
  - Connected to `ExpeditionTrail` via `monumentId` foreign key.
  - Connected to `OcrDocumentSample` via plate references.
- **Export Standards:** Open JSON-LD and GeoJSON standards compatible with QGIS and ArcGIS.

---

## Slide 9: Scalability & Production Readiness
- **Decoupled Open Architecture:**
  - Free from proprietary sandbox dependencies; runs locally, on Docker, or on cloud servers.
  - Zero-bundle latency: Vite optimized production build with client-side caching.
- **Backend & Model Scaling Plan:**
  - Microservice containerization for heavy photogrammetry pipelines (NeRF / 3D Gaussian Splatting).
  - PostgreSQL / PostGIS for enterprise geospatial querying.
  - Vector database (pgvector / Qdrant) for semantic embedding search across multi-century texts.
- **Security & Integrity:** Cryptographic provenance hashing ensuring digitized cultural data remains tamper-proof.

---

## Slide 10: Limitations, Roadmap & Cultural Impact
- **Current Prototype Scope:**
  - Client-side photogrammetric rendering for major architectural archetypes.
  - Seed dataset of 8 verified national monuments and 2 fellowship expeditions.
- **Future Roadmap:**
  - **Q1 2027:** Native mobile app for offline field note capture in remote stepwells.
  - **Q2 2027:** Crowdsourced 2D-to-NeRF automated processing pipeline using Gaussian Splatting.
  - **Q3 2027:** Integration with National Mission on Monuments and Antiquities (NMMA) API.
- **Impact:**
  - Preserving India's imperiled grassroots heritage for future generations.
  - Transforming student exploration into an enduring public cultural commons.
