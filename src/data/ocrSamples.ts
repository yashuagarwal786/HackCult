import { OcrDocumentSample } from "../types/heritage";

export const OCR_SAMPLES: OcrDocumentSample[] = [
  {
    id: "DOC-OCR-001",
    title: "Modhera Sun Temple Field Note (Mehsana Survey)",
    script: "English",
    category: "Field Note",
    rawOcrText: `Field note (uncorrected OCR):
Visited the temple at Modhera in Mehsana distrit, Gujrat. The Sun Temple here was built by king Bhimdev I of the Solanki dynsty around 1026-27 CE. It has a stepped tank (Surya Kund), a sabhamandapa with intricately carved pillers, and the main shrine dedicated to Surya. Stone used appers to be yellow sandstone. The temple is oriented so the rising sun lights the inner sanctum at equinox. Lokal guide claims an inscription mentions the Vikram Samvat date but it is partly effaced.`,
    correctedText: `Field note (corrected):
Visited the temple at Modhera in Mehsana district, Gujarat. The Sun Temple here was built by King Bhimdev I of the Solanki dynasty around 1026–27 CE. It has a stepped tank (Surya Kund), a sabhamandapa with intricately carved pillars, and the main shrine dedicated to Surya. The stone used appears to be yellow sandstone. The temple is oriented so the rising sun lights the inner sanctum at equinox. A local guide claims an inscription mentions the Vikram Samvat date but it is partly effaced.`,
    translation: "Primary architectural observation documenting the Solanki dynasty solar orientation, assembly mandapa with 52 pillars, and stepped reservoir geometry at Modhera.",
    imageSrc: "/images/hero-archive.png",
    diffs: [
      { original: "distrit", corrected: "district", uncertain: false, confidence: 0.98 },
      { original: "Gujrat", corrected: "Gujarat", uncertain: false, confidence: 0.99 },
      { original: "dynsty", corrected: "dynasty", uncertain: false, confidence: 0.97 },
      { original: "pillers", corrected: "pillars", uncertain: false, confidence: 0.96 },
      { original: "appers", corrected: "appears", uncertain: false, confidence: 0.95 },
      { original: "Lokal", corrected: "local", uncertain: false, confidence: 0.99 },
      { original: "1026-27 CE", corrected: "1026–27 CE", uncertain: true, confidence: 0.82 },
      { original: "Vikram Samvat date", corrected: "Vikram Samvat date (effaced)", uncertain: true, confidence: 0.76 }
    ],
    architecturalTermsFound: [
      { term: "Sabhamandapa", meaning: "A pillared open assembly hall in Indian temple architecture used for public gatherings and dance." },
      { term: "Surya Kund", meaning: "A stepped water reservoir or tank situated in front of a sun temple, equipped with shrines along the steps." },
      { term: "Garbhagriha", meaning: "The innermost sanctum sanctorum where the primary deity idol or symbol resides." }
    ]
  },
  {
    id: "DOC-OCR-002",
    title: "Devanagari Epigraphic Palm Leaf (Kalinga Inscription)",
    script: "Devanagari",
    category: "Stone Inscription",
    rawOcrText: `श्री सूर्यदेवाय नमः । महाराजाधिराज नृसिंहदेव प्रथमस्य राज्यकाले कलिंग देशे कोणार्क स्थले द्वादश चक्रयुक्तं महाप्रसादं निर्मितवान् । तत्र सूर्यस्य रथे सप्त अश्वाः विराजन्ते । शिला खण्डोपरि उत्कीर्ण मूर्तयः अतीव रमणीयाः वर्तन्ते ।`,
    correctedText: `श्री सूर्यदेवाय नमः । महाराजाधिराज नरसिंहदेव प्रथमस्य राज्यकाले कलिङ्ग देशे कोणार्क स्थले द्वादश चक्रयुक्तं महाप्रासादं निर्मितवान् । तत्र सूर्यस्य रथे सप्त अश्वाः विराजन्ते । शिला खण्डोपरि उत्कीर्ण मूर्तयः अतीव रमणीयाः वर्तन्ते ।`,
    translation: "Salutations to Lord Surya! During the sovereign reign of King Narasimhadeva I, in the land of Kalinga at Konark, a great palace-shrine equipped with twelve pairs of wheels was constructed. Upon Surya's chariot, seven horses stand resplendent. The sculptures carved atop the stone monoliths are supremely beautiful.",
    imageSrc: "/images/konark.png",
    diffs: [
      { original: "नृसिंहदेव", corrected: "नरसिंहदेव", uncertain: false, confidence: 0.94 },
      { original: "कलिंग", corrected: "कलिङ्ग", uncertain: false, confidence: 0.96 },
      { original: "महाप्रसादं", corrected: "महाप्रासादं (Great Temple Shrine)", uncertain: true, confidence: 0.88 }
    ],
    architecturalTermsFound: [
      { term: "महाप्रासाद (Mahaprasada)", meaning: "Grand monumental temple structure comprising the sanctuary tower and pillared halls." },
      { term: "द्वादश चक्र (Dvadasha Chakra)", meaning: "Twelve pairs of monumental stone chariot wheels acting as both mythic vehicles and astronomical sundials." },
      { term: "सप्त अश्वाः (Sapta Ashva)", meaning: "Seven carved stone horses pulling Surya's chariot, representing the seven days of the week or colors of the spectrum." }
    ]
  },
  {
    id: "DOC-OCR-003",
    title: "Chaulukya Stepwell Guild Notebook (Old Gujarati / Sanskrit)",
    script: "Gujarati",
    category: "Travel Journal",
    rawOcrText: `પાટણ નગરે રાણી ઉદયમતીએ સ્વામી ભીમદેવ ૧ ના સ્મરણાર્થે સાત માળની વાવ બંધાવી. જળતીર્થમાં ભગવાન વિષ્ણુના દશાવતાર પથ્થર પર કંડારાયા છે. શિલ્પીઓએ મારુ-ગુર્જર શૈલીમાં થાંભલા બનાવ્યા છે.`,
    correctedText: `પાટણ નગરે રાણી ઉદયમતીએ સ્વામી ભીમદેવ ૧ ના સ્મરણાર્થે સાત માળની વાવ બંધાવી. જળતીર્થમાં ભગવાન વિષ્ણુના દશાવતાર પથ્થર પર કંડારાયા છે. શિલ્પીઓએ મારુ-ગુર્જર શૈલીમાં થાંભલા બનાવ્યા છે.`,
    translation: "In the city of Patan, Queen Udayamati commissioned a seven-tiered stepwell in memory of her husband King Bhimdev I. Within this sacred water sanctuary, the ten incarnations (Dashavatara) of Lord Vishnu are sculpted in sandstone. The artisans fashioned the pillars in pristine Maru-Gurjara style.",
    imageSrc: "/images/ranikivav.png",
    diffs: [
      { original: "ભીમદેવ ૧", corrected: "ભીમદેવ પ્રથમ (Bhimdev I)", uncertain: false, confidence: 0.97 },
      { original: "વાવ", corrected: "વાવ (Stepwell / Subterranean reservoir)", uncertain: false, confidence: 0.99 }
    ],
    architecturalTermsFound: [
      { term: "વાવ (Vav)", meaning: "A traditional Western Indian stepwell featuring multistoried subterranean pavilions leading down to groundwater level." },
      { term: "મારુ-ગુર્જર શૈલી (Maru-Gurjara Style)", meaning: "Western Indian medieval architectural style known for high relief friezes, tiered platforms, and inverted temple vaults." },
      { term: "દશાવતાર (Dashavatara)", meaning: "The ten primary avatars of Lord Vishnu represented chronologically along descending subterranean tiers." }
    ]
  }
];
