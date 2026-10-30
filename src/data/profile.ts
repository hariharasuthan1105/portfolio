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
    "A versatile language for data workflows, machine learning and backend services.",
  Java: "Object-oriented programming and strongly typed application development.",
  JavaScript: "Interactive interfaces and web application logic.",
  TensorFlow: "Building and training machine learning models.",
  "Scikit-learn": "Feature preprocessing, classification and model evaluation.",
  CatBoost: "Gradient-boosted decision trees for structured data.",
  NumPy: "Efficient numerical arrays and scientific computation.",
  Pandas: "Cleaning, transforming and exploring tabular data.",
  FastAPI: "Typed Python APIs and service interfaces.",
  Django: "Structured Python web application development.",
  "Node.js": "Server-side JavaScript runtime.",
  "Express.js": "HTTP routing and middleware for Node.js.",
  MongoDB: "Document-oriented data storage.",
  SQL: "Querying and organizing relational data.",
  Git: "Version control and collaborative development.",
  GitHub: "Source hosting and development collaboration.",
  React: "Component-based interactive user interfaces.",
  Streamlit: "Rapid interactive data applications.",
  Qiskit: "Exploring quantum circuits and computation.",
};
export const projects = [
  {
    name: "DocRecon",
    type: "DOCUMENT INTELLIGENCE",
    tags: ["PaddleOCR", "Spatial analysis", "Validation"],
    description:
      "An offline document intelligence pipeline that turns unstructured pages into reviewable, structured information.",
    features: [
      "OCR and spatial layout analysis",
      "Structured field extraction and validation",
      "Confidence scoring and human review",
    ],
    challenge:
      "Preserving field relationships across variable document layouts while keeping uncertain results visible to a human reviewer.",
  },
  {
    name: "Pathway AI",
    type: "LIVE KNOWLEDGE SYSTEMS",
    tags: ["RAG", "IoT data", "LLM"],
    description:
      "Dynamic retrieval-augmented generation for smart urban management, grounded in live IoT sensor information.",
    features: [
      "Live sensor context",
      "Relevant evidence retrieval",
      "Context-grounded responses",
    ],
    challenge:
      "Keeping retrieved context relevant as urban sensor information changes, and connecting answers to supporting evidence.",
  },
  {
    name: "HEFIN",
    type: "DECENTRALIZED INTELLIGENCE",
    tags: ["On-chain storage", "LLM", "Chat interface"],
    description:
      "A decentralized AI chatbot connecting on-chain information storage with a language-model interface.",
    features: [
      "Decentralized information storage",
      "Conversational access to information",
      "Connected knowledge workflows",
    ],
    challenge:
      "Bridging persistent on-chain information and a responsive conversational interface.",
  },
];
export const experience = [
  {
    date: "JUN — JUL 2025",
    role: "Data Science Intern",
    company: "Grow Your Skills",
    detail:
      "Worked on loan approval prediction, feature engineering, machine-learning classification, SQL, and model evaluation.",
  },
  {
    date: "FEB — MAR 2024",
    role: "Robotics Intern",
    company: "Emglitz Technologies",
    detail:
      "Contributed to industrial surveillance prototype development, testing, troubleshooting, and technical documentation.",
  },
];
export const awards = [
  "Convolve 4.0 Pan-IIT AI/ML Hackathon|Semi-Finalist",
  "Pathway AI Hackathon · IIT Ropar|Finalist",
  "World Computer Hacker League|Regional Round Qualifier",
];
