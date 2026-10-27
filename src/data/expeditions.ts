import { ExpeditionTrail } from "../types/heritage";

export const EXPEDITION_TRAILS: ExpeditionTrail[] = [
  {
    id: "EXP-WEST-01",
    title: "IITGN Explorer Fellowship: Western Hydraulic & Solar Heritage",
    cohort: "Explorer Fellowship Batch '25",
    year: 2025,
    theme: "Subterranean Stepwells & Equinoctial Solar Temples",
    summary: "A 1,400 km expedition documenting subterranean water architecture and solar alignments across Gujarat and Rajasthan.",
    color: "#f59e0b", // Amber
    totalKm: 1420,
    waypoints: [
      {
        name: "IIT Gandhinagar Campus (Palaj)",
        location: "Gandhinagar, Gujarat",
        state: "Gujarat",
        coordinates: { lat: 23.2156, lng: 72.684 },
        day: 1,
        notes: "Expedition flag-off. Equipment calibrated: LiDAR scanner, high-res photogrammetry rigs, and Devanagari manuscript field note journals.",
        folklore: "Sabarmati riverbank cultural genesis",
        images: ["/images/logo.png"],
        studentFellows: ["Aarav Sharma", "Pooja Patel", "Rohan Mehta"]
      },
      {
        name: "Adalaj Stepwell (Adalaj ni Vav)",
        location: "Adalaj, Gandhinagar",
        state: "Gujarat",
        coordinates: { lat: 23.1667, lng: 72.5833 },
        day: 2,
        notes: "Documented five-storey subterranean octagonal pavilions. Identified Solanki and Indo-Islamic hybrid floral carvings on lintels.",
        folklore: "Commissioned by Queen Rudabai in memory of Rana Veer Singh.",
        images: ["/images/ranikivav.png"],
        studentFellows: ["Aarav Sharma", "Pooja Patel"]
      },
      {
        name: "Modhera Sun Temple & Surya Kund",
        location: "Modhera, Mehsana",
        state: "Gujarat",
        coordinates: { lat: 23.5835, lng: 72.1331 },
        day: 4,
        monumentId: "HA-0007",
        notes: "Mapped the 52 carved pillars of the Sabha Mandapa representing the 52 weeks of the solar year. Photographed Surya Kund stepped geometries.",
        folklore: "Local oral tradition recounts the sanctum jewel catching the first ray of the Vernal Equinox dawn.",
        images: ["/images/hero-archive.png"],
        studentFellows: ["Pooja Patel", "Rohan Mehta"]
      },
      {
        name: "Rani ki Vav",
        location: "Patan, Gujarat",
        state: "Gujarat",
        coordinates: { lat: 23.8587, lng: 72.1017 },
        day: 6,
        monumentId: "HA-0004",
        notes: "Detailed 2D photographic capture across all 7 descending tiers. Ingested 180 field photos for 3D digital twin reconstruction.",
        folklore: "Built by Queen Udayamati as an inverted temple honoring water as the divine life-giver.",
        images: ["/images/ranikivav.png"],
        studentFellows: ["Aarav Sharma", "Rohan Mehta"]
      },
      {
        name: "Chand Baori",
        location: "Abhaneri, Rajasthan",
        state: "Rajasthan",
        coordinates: { lat: 27.0073, lng: 76.6064 },
        day: 9,
        monumentId: "HA-0008",
        notes: "Surveyed the 3,500 double-triangular steps. Ambient temperature inside lower tier recorded at 6°C below desert ambient surface temperature.",
        folklore: "Legends attribute construction in a single night by benevolent subterranean spirits.",
        images: ["/images/hawamahal.png"],
        studentFellows: ["Aarav Sharma", "Pooja Patel", "Rohan Mehta"]
      },
      {
        name: "Hawa Mahal & City Palace",
        location: "Jaipur, Rajasthan",
        state: "Rajasthan",
        coordinates: { lat: 26.9239, lng: 75.8267 },
        day: 12,
        monumentId: "HA-0006",
        notes: "Thermal analysis of Venturi effect airflow through 953 jharokha lattice screens. Ingested archival Rajasthani manuscripts.",
        folklore: "Engineered like Lord Krishna's crown by Sawai Pratap Singh.",
        images: ["/images/hawamahal.png"],
        studentFellows: ["Pooja Patel", "Rohan Mehta"]
      }
    ]
  },
  {
    id: "EXP-SOUTH-02",
    title: "IITGN Explorer Fellowship: Dravidian & Deccan Stone Guilds",
    cohort: "Explorer Fellowship Batch '24",
    year: 2024,
    theme: "Granite Monoliths, Musical Mandapas & Riverine Capitals",
    summary: "A 2,100 km field documentation exploring monolithic granite engineering from the Kaveri basin to the Tungabhadra boulder hills.",
    color: "#06b6d4", // Cyan
    totalKm: 2150,
    waypoints: [
      {
        name: "Brihadeeswarar Temple",
        location: "Thanjavur, Tamil Nadu",
        state: "Tamil Nadu",
        coordinates: { lat: 10.7828, lng: 79.1318 },
        day: 1,
        monumentId: "HA-0005",
        notes: "Photographed Tamil epigraphy on temple base plinth recording names of sculptors, dancers, and royal endowments.",
        folklore: "The shadow of the vimana cupola is said never to fall upon the ground at noon.",
        images: ["/images/brihadeeswarar.png"],
        studentFellows: ["Vikas Swaminathan", "Sneha Rao"]
      },
      {
        name: "Meenakshi Amman Temple Complex",
        location: "Madurai, Tamil Nadu",
        state: "Tamil Nadu",
        coordinates: { lat: 9.9195, lng: 78.1193 },
        day: 5,
        notes: "Analyzed 14 towering gopurams and the 1,000-pillar hall carved with Yali mythical beasts.",
        folklore: "Centuries of Sangam literature assembly traditions.",
        images: ["/images/brihadeeswarar.png"],
        studentFellows: ["Vikas Swaminathan", "Sneha Rao"]
      },
      {
        name: "Virupaksha Temple & Hampi Bazaar",
        location: "Hampi, Vijayanagara, Karnataka",
        state: "Karnataka",
        coordinates: { lat: 15.335, lng: 76.4598 },
        day: 10,
        monumentId: "HA-0003",
        notes: "Acoustic frequency analysis on musical pillars in the Vitthala mandapa; inverted pinhole camera projection inside Virupaksha inner chamber.",
        folklore: "Pampa Kshetra mythic wedding site of Shiva and Pampa.",
        images: ["/images/hampi.png"],
        studentFellows: ["Vikas Swaminathan", "Sneha Rao"]
      }
    ]
  }
];
