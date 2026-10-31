export const profile = {
  name: "Hariharasuthan V",
  email: "hariharasuthan1105@gmail.com",
  github: "https://github.com/hariharasuthan1105",
  linkedin: "https://www.linkedin.com/in/hariharasuthan-v-b48653300",
  education: {
    degree: "B.Tech · Artificial Intelligence & Data Science",
    college: "V.S.B College of Engineering Technical Campus",
    years: "2023–2027",
    cgpa: "8.25 / 10",
  },
};

export const skills: Record<string, string[]> = {
  Programming: ["Python", "Java", "JavaScript"],
  "AI / ML": ["TensorFlow", "Scikit-learn", "CatBoost", "NumPy", "Pandas"],
  Backend: ["FastAPI", "Django", "Node.js", "Express.js"],
  Databases: ["MongoDB", "SQL"],
  Tools: ["Git", "GitHub", "React", "Streamlit", "Qiskit"],
};

export const descriptions: Record<string, string> = {
  Python:
    "A versatile language for data workflows, machine learning models, and backend microservices.",
  Java: "Object-oriented programming and strongly typed enterprise application architecture.",
  JavaScript: "Interactive modern web applications, state management, and real-time interfaces.",
  TensorFlow: "Designing, training, and deploying deep neural network architectures.",
  "Scikit-learn": "Feature engineering, statistical regression, classification pipelines, and cross-validation.",
  CatBoost: "Gradient-boosted decision trees optimized for categorical tabular data.",
  NumPy: "Vectorized numerical array operations, linear algebra, and mathematical computing.",
  Pandas: "Data cleaning, aggregations, time-series transformations, and tabular analytics.",
  FastAPI: "High-performance typed asynchronous RESTful Python APIs with automatic OpenAPI documentation.",
  Django: "Robust Python web framework with ORM, authentication, and structured design patterns.",
  "Node.js": "Event-driven asynchronous server-side JavaScript runtime for scalable services.",
  "Express.js": "Minimalist HTTP routing, middleware pipelines, and REST service interfaces.",
  MongoDB: "Document-oriented NoSQL database for flexible JSON-style schema design.",
  SQL: "Relational database querying, schema normalization, multi-table joins, and data integrity.",
  Git: "Distributed version control, atomic commits, branching strategies, and repository management.",
  GitHub: "Collaborative source code hosting, code review workflows, and CI/CD automation.",
  React: "Declarative component-driven user interfaces with reactive state and hook architecture.",
  Streamlit: "Rapid prototyping and deployment of interactive data science and machine learning dashboards.",
  Qiskit: "Quantum circuit design, gate simulation, and quantum algorithm experimentation.",
};

export interface ProjectData {
  name: string;
  shortName: string;
  type: string;
  headline: string;
  problem: string;
  approach: string;
  technologies: string[];
  tags: string[];
  features: string[];
  challenge: string;
  lessonsLearned: string;
  github: string;
}

export const projects: ProjectData[] = [
  {
    name: "DocRecon — Document Intelligence & Field Extraction",
    shortName: "DocRecon",
    type: "DOCUMENT INTELLIGENCE",
    headline: "Turning unstructured scan pages into reviewable, structured relational fields.",
    problem:
      "Organizations process thousands of invoices, receipts, and clinical forms with unpredictable layouts, skewed scans, and unstructured text that conventional OCR fails to parse reliably into structured database entities.",
    approach:
      "Employs a two-stage architecture: deep-learning spatial text detection and recognition, followed by geometric heuristic clustering to reconstruct key-value relationships, paired with strict schema validation and confidence-threshold routing for human review.",
    technologies: ["Python", "PaddleOCR", "FastAPI", "OpenCV", "NumPy", "Pydantic"],
    tags: ["PaddleOCR", "Spatial Analysis", "Field Validation", "FastAPI"],
    features: [
      "Offline spatial layout analysis and bounding box detection",
      "Rule-based field extraction and regex-driven semantic validation",
      "Statistical confidence scoring with human-in-the-loop review triggers",
      "Typed REST API endpoints for batch document ingestion",
    ],
    challenge:
      "Preserving logical key-value relationships across highly variable invoice templates without requiring model fine-tuning for every visual variance.",
    lessonsLearned:
      "Spatial proximity heuristics must be coupled with strict schema validation; handling real-world scan artifacts requires adaptive pre-processing before OCR inference.",
    github: "https://github.com/hariharasuthan1105/portfolio",
  },
  {
    name: "Pathway AI — Dynamic RAG for Smart Urban Management",
    shortName: "Pathway AI",
    type: "LIVE KNOWLEDGE SYSTEMS",
    headline: "Real-time retrieval-augmented generation grounded in live municipal IoT telemetry.",
    problem:
      "Traditional static RAG systems query stale document indices, making them incapable of reasoning over real-time urban telemetry like traffic congestion, air quality surges, and grid load fluctuations.",
    approach:
      "Architected a streaming RAG pipeline that continuously ingests municipal IoT telemetry, updates vector index embeddings in real time, and synthesizes grounded answers with verifiable sensor provenance.",
    technologies: ["Python", "Pathway", "LangChain", "FastAPI", "LLMs", "Vector Indexing"],
    tags: ["Streaming RAG", "IoT Telemetry", "Real-time AI", "Pathway"],
    features: [
      "Real-time streaming IoT context ingestion and windowing",
      "Dense vector retrieval over dynamic time-series streams",
      "Source-attributed grounded synthesis preventing hallucinations",
      "Interactive municipal query interface for urban dispatchers",
    ],
    challenge:
      "Maintaining low-latency retrieval while sensor readings update continuously every few seconds across distributed city sectors.",
    lessonsLearned:
      "Dynamic indexing requires sliding temporal windows and strict citation metadata so every AI assertion maps directly to an authenticated sensor timestamp.",
    github: "https://github.com/hariharasuthan1105/portfolio",
  },
  {
    name: "HEFIN — Decentralized AI Chatbot",
    shortName: "HEFIN",
    type: "DECENTRALIZED INTELLIGENCE",
    headline: "Conversational language model interface connected to decentralized storage.",
    problem:
      "Centralized conversational AI architectures create single points of failure and opaque data custody, leaving users without verifiable ownership of their historical interaction records.",
    approach:
      "Architected a hybrid protocol pairing an off-chain conversational inference loop with on-chain cryptographic state commitments and IPFS decentralized document storage.",
    technologies: ["Node.js", "Express.js", "Ethereum / Web3", "Solidity", "IPFS", "OpenAI API"],
    tags: ["On-Chain Storage", "Decentralized AI", "Web3", "IPFS"],
    features: [
      "Cryptographically verifiable on-chain session logs",
      "Decentralized IPFS storage for persistent knowledge documents",
      "Conversational natural language interface for Web3 queries",
      "Non-custodial user privacy preserving identity autonomy",
    ],
    challenge:
      "Bridging asynchronous block confirmation latency with real-time streaming conversational tokens without degrading chat responsiveness.",
    lessonsLearned:
      "Decoupling read-heavy conversational inference from write-heavy blockchain commitments with optimistic client updates creates a seamless Web3 experience.",
    github: "https://github.com/hariharasuthan1105/portfolio",
  },
];

export const experience = [
  {
    date: "JUN — JUL 2025",
    role: "Data Science Intern",
    company: "Grow Your Skills",
    detail:
      "Engineered loan approval prediction pipelines, conducted exploratory data analysis, performed feature engineering, trained gradient-boosted decision trees, and executed SQL query optimizations for financial datasets.",
  },
  {
    date: "FEB — MAR 2024",
    role: "Robotics Intern",
    company: "Emglitz Technologies",
    detail:
      "Contributed to industrial surveillance prototype development, micro-controller sensor interfacing, hardware testing, troubleshooting firmware routines, and authoring technical documentation.",
  },
];

export const awards = [
  "Convolve 4.0 Pan-IIT AI/ML Hackathon|Semi-Finalist",
  "Pathway AI Hackathon · IIT Ropar|Finalist",
  "World Computer Hacker League|Regional Round Qualifier",
];
