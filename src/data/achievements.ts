export interface AchievementData {
  id: "convolve" | "pathway" | "wchl";
  number: string;
  name: string;
  organizer: string;
  status: "SEMI-FINALIST" | "FINALIST" | "REGIONAL ROUND QUALIFIER";
  tier: string;
  description: string;
  projectConnection?: {
    name: string;
    sectionId: string;
    description: string;
  };
  technicalFocus: string;
  verifiedScope: string;
  citationNotes: string;
  emblemType: "laurel" | "geometric" | "globe";
}

export const ACHIEVEMENTS: AchievementData[] = [
  {
    id: "convolve",
    number: "01",
    name: "CONVOLVE 4.0",
    organizer: "Pan-IIT AI/ML Hackathon",
    status: "SEMI-FINALIST",
    tier: "National Competitive AI Hackathon",
    description:
      "Pan-IIT AI/ML hackathon exploring multimodal classification and computer vision optimization pipelines under real-time constraints.",
    projectConnection: {
      name: "DocRecon — Document Intelligence",
      sectionId: "projects",
      description: "Applied spatial layout analysis and heuristic OCR entity grouping.",
    },
    technicalFocus:
      "Engineered high-accuracy OCR bounding-box recognition, spatial layout heuristics, and rule-based field extraction for unstructured scans.",
    verifiedScope:
      "Selected as National Semi-Finalist among collegiate AI engineering teams across India through rigorous technical benchmark evaluations.",
    citationNotes:
      "Demonstrated robust machine learning inference pipelines capable of extracting tabular invoice key-values without model fine-tuning.",
    emblemType: "laurel",
  },
  {
    id: "pathway",
    number: "02",
    name: "PATHWAY AI HACKATHON",
    organizer: "IIT Ropar",
    status: "FINALIST",
    tier: "National AI Systems Hackathon",
    description:
      "National hackathon hosted by IIT Ropar focusing on dynamic streaming intelligence and context-grounded retrieval.",
    projectConnection: {
      name: "Pathway AI — Smart Urban RAG",
      sectionId: "projects",
      description: "Architected event-driven time-series ingestion and real-time semantic synthesis.",
    },
    technicalFocus:
      "Architected an event-driven RAG architecture processing live urban IoT telemetry, sliding ingestion windows, and dense vector indexing with verified zero hallucinations.",
    verifiedScope:
      "Recognized as Official Finalist at IIT Ropar's competitive hackathon showcase after technical demonstration to faculty and industry evaluators.",
    citationNotes:
      "Integrated sliding temporal windows with strict source attribution, enabling municipal dispatchers to query dynamic telemetry via natural language.",
    emblemType: "geometric",
  },
  {
    id: "wchl",
    number: "03",
    name: "WORLD COMPUTER HACKER LEAGUE",
    organizer: "Regional Round Qualifier",
    status: "REGIONAL ROUND QUALIFIER",
    tier: "Collegiate Systems & Protocol League",
    description:
      "Competitive systems and security hackathon evaluating decentralized protocol engineering and cryptographic logic.",
    projectConnection: {
      name: "HEFIN — Decentralized AI Chatbot",
      sectionId: "projects",
      description: "Implemented on-chain session auditing paired with IPFS decentralized document storage.",
    },
    technicalFocus:
      "Qualified through regional algorithmic rounds covering decentralized consensus, cryptographic verification, IPFS content addressing, and fault-tolerant smart contracts.",
    verifiedScope:
      "Achieved verified qualification through multi-round regional problem-solving benchmarks under competitive time constraints.",
    citationNotes:
      "Validated performance in distributed node topology, optimistic state reconciliation, and cryptographic integrity verification.",
    emblemType: "globe",
  },
];

export interface CertificationData {
  title: string;
  issuer: string;
  category: "Computer Science" | "Cloud" | "Data Science" | "Analytics";
}

export const CERTIFICATIONS: CertificationData[] = [
  {
    title: "Programming in Java",
    issuer: "NPTEL",
    category: "Computer Science",
  },
  {
    title: "Cloud Computing",
    issuer: "NPTEL",
    category: "Cloud",
  },
  {
    title: "Cloud Computing Fundamentals",
    issuer: "IBM SkillsBuild",
    category: "Cloud",
  },
  {
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte",
    category: "Analytics",
  },
  {
    title: "6-Week Data Science and Machine Learning Program",
    issuer: "IIT Guwahati",
    category: "Data Science",
  },
];
