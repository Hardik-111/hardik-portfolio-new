/* ============================================================================
 * SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
 * ----------------------------------------------------------------------------
 * Every word, number, link and data point rendered on the site comes from this
 * file. Nothing else needs to be touched to keep the portfolio current.
 *
 * Anything still marked [PLACEHOLDER] is not sourced from the résumé and needs
 * a real value before launch.
 * ==========================================================================*/

export type Social = {
  label: string;
  href: string;
  handle: string;
  icon: "github" | "linkedin" | "twitter" | "mail" | "resume";
};

export type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  detail: string;
};

export type TimelineEntry = {
  year: string;
  title: string;
  body: string;
};

export type SkillCategory = {
  id: string;
  name: string;
  icon: "server" | "cloud" | "database" | "brain" | "layers" | "terminal";
  blurb: string;
  skills: { name: string; note?: string }[];
};

export type Role = {
  company: string;
  companyUrl?: string;
  role: string;
  period: string;
  start: string;
  location: string;
  summary: string;
  achievements: string[];
  stack: string[];
};

export type ArchNode = {
  id: string;
  label: string;
  sublabel?: string;
  /** Percentage coordinates within the diagram viewport. */
  x: number;
  y: number;
  tier: "edge" | "service" | "data" | "async";
  detail: string;
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
  /** Dashed edges render as asynchronous / event-driven flows. */
  async?: boolean;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  status: string;
  overview: string;
  problem: string;
  challenges: { title: string; body: string }[];
  results: { value: string; label: string }[];
  stack: string[];
  links: { github?: string; demo?: string; caseStudy?: string };
  /** Drop a real screenshot in /public and point here to replace the generated visual. */
  screenshot?: string;
  /** Path to a local demo recording (e.g. /public/demo.mp4). Shown as a "Watch demo" lightbox. */
  video?: string;
  accent: "iris" | "cyan" | "ember";
  architecture: { nodes: ArchNode[]; edges: ArchEdge[] };
};

export type Expertise = {
  id: string;
  title: string;
  icon: "server" | "cloud" | "brain" | "network" | "blocks";
  summary: string;
  points: { heading: string; body: string }[];
  tags: string[];
};

export type Repo = {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updated: string;
  href: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
};

/* -------------------------------------------------------------------------- */
/* Profile                                                                     */
/* -------------------------------------------------------------------------- */

export const profile = {
  name: "Hardik Kumar Singh",
  shortName: "Hardik",
  initials: "HS",
  /** Cycled by the hero's animated role marquee. */
  roles: [
    "Backend Engineer",
    "Java & Spring Boot",
    "AI / LLMs",
    "Distributed Systems",
  ],
  headline: "Backend engineer at Grid Dynamics, working in Java on Visa's merchant platform.",
  summary:
    "Software Engineer at Grid Dynamics, currently engaged with Visa building Java backend services for merchant management on a global card network. Previously shipped AI-powered hiring platforms with FastAPI, LLMs, and Google Cloud.",
  location: "Bengaluru, India",
  timezone: "IST · UTC+5:30",
  email: "ihardik.112@gmail.com",
  phone: "+91 95696 46737",
  availability: "Software Engineer at Grid Dynamics",
  /** Hero plate. Set to null to fall back to the generated wireframe composition. */
  portrait: "/portrait.png" as string | null,
  /** About-section frame. "/portrait-dark.jpg" is the alternate, darker shot. */
  portraitAlt: "/portrait.png" as string | null,
  resumeUrl: "/resume.pdf",
  siteUrl: "https://hardiksingh.dev", // [PLACEHOLDER] set your real domain before deploying
};

/** Hero headline, broken into the lines it should render on. */
export const hero = {
  /** Each entry is one line, kept short so it never collides with the portrait plate. `accent` renders in serif italic. */
  lines: [
    { text: "Backend engineer," },
    { text: "Java & AI," },
    { text: "built", accent: "at scale." },
  ] as { text: string; accent?: string }[],
  intro:
    "I am a Software Engineer at Grid Dynamics, currently engaged with Visa — a leading global card network — building Java backend services for merchant management. I care about correct data, clear API contracts, and changes that hold up in production. Before this engagement I spent a year shipping AI hiring systems on FastAPI, LLMs and GCP — that work is still where my proudest numbers live.",
  primaryCta: { label: "View selected work", href: "#projects" },
  secondaryCta: { label: "Read the story", href: "#about" },
  scrollHint: "Scroll",
};

export const socials: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/Hardik-111",
    handle: "Hardik-111",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/hardik-kumar-singh",
    handle: "hardik-kumar-singh",
    icon: "linkedin",
  },
  {
    label: "Email",
    href: "mailto:ihardik.112@gmail.com",
    handle: "ihardik.112@gmail.com",
    icon: "mail",
  },
  {
    label: "Résumé",
    href: "/resume.pdf",
    handle: "Download résumé",
    icon: "resume",
  },
];

/* -------------------------------------------------------------------------- */
/* 2 · Metrics                                                                 */
/* -------------------------------------------------------------------------- */

export const metrics: Metric[] = [
  {
    value: 91,
    suffix: "%",
    label: "Faster candidate screening",
    detail: "An autonomous scoring engine evaluates every open hiring ticket in a single pass.",
  },
  {
    value: 90,
    suffix: "%",
    label: "Manual recruiter effort removed",
    detail: "Screening workflows that used to be human-driven now run end to end without intervention.",
  },
  {
    value: 35,
    suffix: "+",
    label: "Production REST APIs",
    detail: "Asynchronous FastAPI services backing structured and semantic data workloads.",
  },
  {
    value: 80,
    suffix: "%",
    label: "Execution risk reduced",
    detail: "Untrusted user code isolated inside Firecracker microVMs rather than shared runtimes.",
  },
];

/* -------------------------------------------------------------------------- */
/* 3 · About                                                                   */
/* -------------------------------------------------------------------------- */

export const about = {
  eyebrow: "About",
  title: "I would rather design the system than just ship the endpoint.",
  paragraphs: [
    "I am Hardik, a Software Engineer at Grid Dynamics in Bengaluru, currently engaged with Visa — a leading global card network — building Java backend services for merchant management. I graduated from MNNIT Allahabad with a B.Tech in Computer Science and Engineering, and I have spent every role since asking the same question: what has to stay true when traffic, data, or team size grows?",
    "On the Visa engagement my work is production Java — merchant workflows, synchronisation with downstream processing, and API contracts that integrators can actually debug. Before that I was on Grid Dynamics' own enterprise AI platforms: asynchronous FastAPI, Vertex AI and GPT-4, PostgreSQL on Cloud Run, and the kind of throughput numbers that only matter if recruiters feel them.",
    "I am not tied to one stack. I go where the problem is — Java and Spring where the enterprise boundary is, Python and FastAPI where models and async I/O dominate. What I optimise for is impact you can measure, whether that is fresher merchant reporting or ninety-one percent less screening time.",
  ],
  principles: [
    {
      title: "Impact before novelty",
      body: "Every architectural choice should be defensible in terms of latency, cost, or hours of human work removed.",
    },
    {
      title: "Async by default",
      body: "Blocking a request thread on an LLM call is a design decision. Usually the wrong one.",
    },
    {
      title: "Isolate what you cannot trust",
      body: "User code, model output, and third-party responses all get a boundary before they touch the system.",
    },
  ],
  timeline: [
    {
      year: "2021",
      title: "Started at MNNIT Allahabad",
      body: "B.Tech in Computer Science and Engineering, finishing with a CPI of 8.27.",
    },
    {
      year: "2024",
      title: "Built OptiVision",
      body: "Real-time object detection on a Jetson Nano taught me that latency budgets are a hardware conversation.",
    },
    {
      year: "Jan 2025",
      title: "Joined Grid Dynamics as an intern",
      body: "Led the backend of an LLM-powered learning assistant and shipped 35+ REST APIs into production.",
    },
    {
      year: "Aug 2025",
      title: "Junior Software Engineer at Grid Dynamics",
      body: "Owned backend systems for an AI talent acquisition platform used to automate real hiring workflows.",
    },
    {
      year: "Sep 2026",
      title: "Engaged with Visa, as part of Grid Dynamics",
      body: "Still at Grid Dynamics — now building Java backend enhancements across merchant management for Visa, a leading global card network.",
    },
  ] satisfies TimelineEntry[],
};

export const education = {
  eyebrow: "Education & credentials",
  entries: [
    {
      institution: "Motilal Nehru National Institute of Technology, Allahabad",
      qualification: "B.Tech, Computer Science and Engineering",
      period: "Dec 2021 — May 2025",
      score: "CPI 8.27",
    },
    {
      institution: "G.N. National Public School",
      qualification: "CBSE, Class XII",
      period: "Apr 2021",
      score: "95.4%",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      verifyUrl:
        "https://cp.certmetrics.com/amazon/en/public/verify/credential/b03b92380335419ebc6a376ae1c539ad",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* 4 · Skills                                                                  */
/* -------------------------------------------------------------------------- */

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    name: "Languages",
    icon: "terminal",
    blurb: "Chosen for the problem, not the résumé.",
    skills: [
      { name: "Java", note: "primary" },
      { name: "C++", note: "primary" },
      { name: "Python" },
      { name: "SQL" },
      { name: "JavaScript" },
    ],
  },
  {
    id: "backend",
    name: "Backend & APIs",
    icon: "server",
    blurb: "Asynchronous services that hold their latency budget.",
    skills: [
      { name: "FastAPI"},
      { name: "Spring Boot", note: "deep"  },
      { name: "REST APIs" },
      { name: "Microservices" },
      { name: "Async I/O" },
      { name: "ReactJS" },
    ],
  },
  {
    id: "data",
    name: "Data & Storage",
    icon: "database",
    blurb: "Schemas designed for the queries they will actually see.",
    skills: [
      { name: "PostgreSQL", note: "deep" },
      { name: "JSONB modelling" },
      { name: "Redis" },
      { name: "ChromaDB" },
      { name: "MongoDB" },
      { name: "MySQL" },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    icon: "cloud",
    blurb: "Containerised, cost-aware, and operable by a small team.",
    skills: [
      { name: "Google Cloud Run" },
      { name: "Cloud SQL" },
      { name: "Docker", note: "deep"  },
      { name: "Kubernetes" },
      { name: "AWS EC2" },
      { name: "AWS Certified", note: "CCP" },
    ],
  },
  {
    id: "ai",
    name: "AI & LLM Systems",
    icon: "brain",
    blurb: "Models treated as a dependency with a latency and cost budget.",
    skills: [
      { name: "Google Vertex AI" },
      { name: "OpenAI GPT-4" },
      { name: "Semantic search" },
      { name: "Vector databases" },
      { name: "TensorFlow" },
      { name: "OpenCV" },
    ],
  },
  {
    id: "tooling",
    name: "Tooling & Practice",
    icon: "layers",
    blurb: "The unglamorous half of shipping.",
    skills: [
      { name: "Git / GitHub" },
      { name: "GitLab CI" },
      { name: "Maven" },
      { name: "JUnit" },
      { name: "Mockito" },
      { name: "Agile / Scrum" },
      { name: "AI assisted tools:", note: "Claude, Codex, Gemini, Cursor" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* 5 · Experience                                                              */
/* -------------------------------------------------------------------------- */

export const experience: Role[] = [
  {
    company: "Grid Dynamics",
    companyUrl: "https://www.griddynamics.com",
    role: "Software Engineer · Visa (client engagement)",
    period: "Sep 2026 — Present",
    start: "2026",
    location: "Bengaluru, India",
    summary:
      "Engaged by Grid Dynamics with Visa — a leading global card network — engineering Java backend enhancements across merchant management workflows, production defect resolution, and business-driven platform improvements.",
    achievements: [
      "Engineered Java backend enhancements across merchant management workflows, delivering production features, defect resolutions, and business-driven platform improvements.",
      "Resolved a merchant data synchronisation defect by integrating post-onboarding update flows with downstream processing, eliminating stale reporting data through cross-team collaboration.",
      "Enhanced API contracts with three validation scenarios, replacing generic HTTP 400 responses with descriptive error enums to improve merchant integration and diagnostics.",
      "Proposed and introduced clearer Virtual Terminal terminology, aligning merchant-facing labels with business functionality to reduce ambiguity.",
    ],
    stack: ["Java", "Spring Boot", "REST APIs", "Microservices", "Maven", "JUnit"],
  },
  {
    company: "Grid Dynamics",
    companyUrl: "https://www.griddynamics.com",
    role: "Junior Software Engineer",
    period: "Aug 2025 — Sep 2026",
    start: "2025",
    location: "Bengaluru, India",
    summary:
      "Owned backend systems for an AI-powered talent acquisition platform: the APIs, the data model, the model integration, and the deployment path that carried them to production.",
    achievements: [
      "Built the backend for an AI talent acquisition platform that automates candidate screening, removing 90% of the manual effort recruiters previously spent on first-pass review.",
      "Shipped asynchronous, scalable FastAPI services with advanced filtering, pagination and real-time delivery, improving recruiter workflow efficiency by 35%.",
      "Integrated Google Vertex AI and OpenAI GPT-4 for CV-to-job-description matching and candidate ranking, raising match accuracy by 35%.",
      "Designed an autonomous scoring engine that evaluates a candidate against every relevant hiring ticket in a single pass, cutting screening time by 91%.",
      "Replaced profile-keyword evaluation with holistic semantic matching, improving shortlisting consistency by 30% and reducing recruiter bias.",
      "Containerised the platform with Docker on Google Cloud Run, cutting operational overhead by 25% while keeping deployments cost-efficient.",
      "Modelled cloud-native persistence in Cloud SQL for PostgreSQL using optimised JSONB schemas, improving query performance and data flexibility by 30%.",
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "Vertex AI", "GPT-4", "Docker", "Cloud Run"],
  },
  {
    company: "Grid Dynamics",
    companyUrl: "https://www.griddynamics.com",
    role: "Software Engineer Intern",
    period: "Jan 2025 — Jul 2025",
    start: "2025",
    location: "Hyderabad, India",
    summary:
      "Led the backend of an LLM-powered learning assistant that turns arbitrary source material — PDFs, repositories, documentation, code — into interactive learning experiences.",
    achievements: [
      "Led the backend of an LLM-powered learning assistant, converting 90% of supported content types (PDFs, code, docs, GitHub repositories, web links) into interactive material.",
      "Engineered 35+ REST APIs in FastAPI over PostgreSQL, ChromaDB and Redis to serve structured and semantic workloads from one interface.",
      "Ran untrusted user code inside Firecracker microVMs on Amazon EC2, reducing execution-level security risk by 80% compared with shared-runtime execution.",
      "Worked with the data science and frontend teams on chat, Q&A generation and automated code evaluation, lifting learner engagement by 30%.",
      "Containerised backend services with Docker, resolving over 60% of outstanding CI/CD pipeline issues and making staging consistent with production.",
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "ChromaDB", "Redis", "Firecracker", "AWS EC2"],
  },
];

/* -------------------------------------------------------------------------- */
/* Product demo (hash link — must stay before projects; learning-assistant refs href) */
/* -------------------------------------------------------------------------- */

export const productDemo = {
  /** DOM id and hash target — share as `${profile.siteUrl}${href}`. */
  sectionId: "demo",
  href: "#demo",
  navLabel: "Demo",
  eyebrow: "Product demo",
  title: "LLM-Powered Learning Assistant, in motion.",
  description:
    "A short walkthrough of the assistant turning raw source material into something you can actually practise against — the same build referenced in the projects above.",
  slug: "learning-assistant",
};

/* -------------------------------------------------------------------------- */
/* 6 · Featured projects                                                       */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    slug: "talent-ai",
    name: "AI Talent Acquisition Platform",
    tagline: "Screening that finishes before the recruiter opens the tab.",
    year: "2025",
    role: "Backend owner · Grid Dynamics",
    status: "In production",
    accent: "iris",
    overview:
      "An enterprise platform that automates candidate screening end to end. Every incoming CV is parsed, embedded, semantically matched against open job descriptions, scored, and ranked — without a recruiter having to open a single profile first.",
    problem:
      "First-pass screening was entirely manual and inconsistent. Recruiters compared CVs against job descriptions by hand, one ticket at a time, and the result depended heavily on who did the reading and how many profiles they had already been through that day.",
    challenges: [
      {
        title: "Scoring every ticket in one pass",
        body: "Evaluating a candidate against one requisition at a time does not scale with the number of open roles. The scoring engine fans a single parsed CV across every relevant hiring ticket concurrently, which is what turned screening time into a 91% reduction rather than a marginal one.",
      },
      {
        title: "Keeping LLM calls off the request path",
        body: "Model latency is measured in seconds and request budgets in milliseconds. Matching and ranking run as asynchronous work with results persisted on completion, so the API stays responsive regardless of how long inference takes.",
      },
      {
        title: "Structure and flexibility in the same schema",
        body: "Parsed CVs vary wildly in shape. Modelling them as optimised JSONB in Cloud SQL kept relational guarantees for the fields that matter while leaving the long tail queryable, improving query performance and flexibility by 30%.",
      },
    ],
    results: [
      { value: "91%", label: "Faster screening" },
      { value: "90%", label: "Manual effort removed" },
      { value: "+35%", label: "Match accuracy" },
      { value: "-25%", label: "Operational overhead" },
    ],
    stack: ["FastAPI", "Python", "PostgreSQL", "Vertex AI", "GPT-4", "Docker", "Cloud Run"],
    links: { github: "https://github.com/Hardik-111" },
    architecture: {
      nodes: [
        { id: "portal", label: "Recruiter Portal", sublabel: "web client", x: 9, y: 30, tier: "edge", detail: "Filtering, pagination and ranked shortlists delivered in real time." },
        { id: "api", label: "FastAPI Service", sublabel: "async", x: 30, y: 30, tier: "service", detail: "Non-blocking request handling so model latency never reaches the client." },
        { id: "parser", label: "CV Parser", sublabel: "extract · normalise", x: 30, y: 74, tier: "service", detail: "Turns arbitrary résumé formats into a consistent structured document." },
        { id: "scorer", label: "Scoring Engine", sublabel: "all tickets, one pass", x: 54, y: 52, tier: "service", detail: "Fans one candidate across every open requisition concurrently and ranks the results." },
        { id: "vertex", label: "Vertex AI", sublabel: "embeddings", x: 76, y: 26, tier: "async", detail: "Generates the semantic representation used for CV-to-JD matching." },
        { id: "gpt", label: "GPT-4", sublabel: "evaluation", x: 76, y: 52, tier: "async", detail: "Holistic reasoning over candidate fit rather than keyword overlap." },
        { id: "sql", label: "Cloud SQL", sublabel: "JSONB schema", x: 76, y: 78, tier: "data", detail: "Relational guarantees where they matter, JSONB for the long tail of parsed fields." },
        { id: "run", label: "Cloud Run", sublabel: "containerised", x: 93, y: 52, tier: "edge", detail: "Scales to zero between hiring bursts, which is where the cost saving comes from." },
      ],
      edges: [
        { from: "portal", to: "api" },
        { from: "api", to: "parser" },
        { from: "api", to: "scorer" },
        { from: "parser", to: "scorer", async: true },
        { from: "scorer", to: "vertex", label: "embed", async: true },
        { from: "scorer", to: "gpt", label: "rank", async: true },
        { from: "scorer", to: "sql" },
        { from: "sql", to: "run" },
      ],
    },
  },
  {
    slug: "learning-assistant",
    name: "LLM-Powered Learning Assistant",
    tagline: "Any source material, turned into something you can practise against.",
    year: "2025",
    role: "Backend lead · Grid Dynamics",
    status: "Shipped",
    accent: "cyan",
    overview:
      "A learning platform that ingests PDFs, GitHub repositories, documentation and raw code, then generates interactive material from them: Q&A, guided explanation, and coding exercises that are evaluated automatically by executing the learner's submission.",
    problem:
      "Learning content was static and disconnected from the systems it described. There was no safe way to let a learner run code against generated exercises, and no single interface that could serve both keyword-precise lookups and semantic questions over the same corpus.",
    challenges: [
      {
        title: "Executing untrusted code safely",
        body: "Learner submissions are arbitrary code. Each execution is isolated in a Firecracker microVM on EC2 with its own kernel and lifetime, which reduced execution-level security risk by 80% relative to running submissions in a shared container runtime.",
      },
      {
        title: "One API over three storage models",
        body: "PostgreSQL holds relational state, ChromaDB holds embeddings, and Redis absorbs hot reads. 35+ REST endpoints present all three as a single coherent interface so the client never has to know which store answered.",
      },
      {
        title: "Ingesting genuinely heterogeneous sources",
        body: "A GitHub repository, a PDF and a documentation site have nothing structurally in common. A normalising ingestion layer reduced them to a shared chunked representation, which is what made 90% content coverage achievable.",
      },
    ],
    results: [
      { value: "35+", label: "REST APIs shipped" },
      { value: "90%", label: "Content types supported" },
      { value: "-80%", label: "Code execution risk" },
      { value: "+30%", label: "Learner engagement" },
    ],
    stack: ["FastAPI", "PostgreSQL", "ChromaDB", "Redis", "Firecracker", "Docker", "AWS EC2"],
    links: { github: "https://github.com/Hardik-111", demo: productDemo.href },
    video: "/LLM_Learning_Assistant_Demo.mp4",
    architecture: {
      nodes: [
        { id: "sources", label: "Sources", sublabel: "pdf · repo · docs", x: 9, y: 26, tier: "edge", detail: "PDFs, GitHub repositories, documentation sites and raw web links." },
        { id: "ingest", label: "Ingestion", sublabel: "normalise · chunk", x: 29, y: 26, tier: "service", detail: "Reduces every source type to one chunked representation." },
        { id: "api", label: "FastAPI", sublabel: "35+ endpoints", x: 29, y: 72, tier: "service", detail: "A single interface over relational, vector and cache storage." },
        { id: "chroma", label: "ChromaDB", sublabel: "embeddings", x: 52, y: 16, tier: "data", detail: "Semantic retrieval across the ingested corpus." },
        { id: "pg", label: "PostgreSQL", sublabel: "relational state", x: 52, y: 46, tier: "data", detail: "Courses, progress, submissions and grading records." },
        { id: "redis", label: "Redis", sublabel: "hot path", x: 52, y: 76, tier: "data", detail: "Absorbs repeated reads so the database is not the bottleneck." },
        { id: "exec", label: "Firecracker microVM", sublabel: "per submission", x: 77, y: 46, tier: "async", detail: "Each learner submission runs in its own kernel with its own lifetime." },
        { id: "ec2", label: "Amazon EC2", sublabel: "execution host", x: 93, y: 46, tier: "edge", detail: "Hosts the microVM pool that backs automated code evaluation." },
      ],
      edges: [
        { from: "sources", to: "ingest" },
        { from: "ingest", to: "chroma", async: true },
        { from: "ingest", to: "pg" },
        { from: "api", to: "chroma", label: "semantic" },
        { from: "api", to: "pg" },
        { from: "api", to: "redis" },
        { from: "api", to: "exec", label: "evaluate", async: true },
        { from: "exec", to: "ec2" },
      ],
    },
  },
  {
    slug: "optivision",
    name: "OptiVision",
    tagline: "Real-time detection on hardware that fits in your hand.",
    year: "2024",
    role: "Solo build · final-year project",
    status: "Open source",
    accent: "ember",
    overview:
      "A computer vision system for real-time object detection and intelligent surveillance, running CenterNet ResNet-101 on a Jetson Nano across multiple live RTSP streams, with a chatbot layer that answers questions about what the cameras actually saw.",
    problem:
      "Detection models are usually benchmarked on a workstation GPU. Running one across several concurrent live streams on an edge device with a fixed power envelope is a different problem, and the detection logs it produces are useless unless someone can actually query them.",
    challenges: [
      {
        title: "A latency budget set by the hardware",
        body: "CenterNet ResNet-101 had to hold 34ms inference at 32.4 mAP on a Jetson Nano. The accuracy-per-millisecond tradeoff was the whole design, and it was decided by what the device could sustain rather than what the model could score.",
      },
      {
        title: "Multiple live streams, one device",
        body: "Five or more concurrent RTSP streams share a single accelerator. Frame scheduling and tracking state per stream kept multi-object tracking above 85% accuracy without any one camera starving the others.",
      },
      {
        title: "Making the logs answerable",
        body: "Ten thousand detection records are a data problem, not an insight. A TF-IDF and cosine-similarity chatbot over the logs let a human ask what happened instead of writing a query.",
      },
    ],
    results: [
      { value: "34ms", label: "Inference latency" },
      { value: "32.4", label: "mAP on CenterNet" },
      { value: "5+", label: "Concurrent RTSP streams" },
      { value: "85%+", label: "Tracking accuracy" },
    ],
    stack: ["Python", "TensorFlow", "OpenCV", "Jetson Nano", "TF-IDF"],
    links: { github: "https://github.com/Hardik-111" },
    architecture: {
      nodes: [
        { id: "cams", label: "IP Cameras", sublabel: "5+ RTSP", x: 9, y: 50, tier: "edge", detail: "Concurrent live streams feeding a single edge device." },
        { id: "decode", label: "Stream Decoder", sublabel: "OpenCV", x: 28, y: 50, tier: "service", detail: "Decodes and schedules frames so no stream starves the accelerator." },
        { id: "detect", label: "CenterNet R-101", sublabel: "34ms · 32.4 mAP", x: 50, y: 28, tier: "service", detail: "Detection tuned to the Jetson Nano's sustained throughput, not a workstation GPU's." },
        { id: "track", label: "Multi-Object Tracker", sublabel: "85%+ accuracy", x: 50, y: 72, tier: "service", detail: "Maintains identity across frames per stream." },
        { id: "logs", label: "Detection Log", sublabel: "10k+ records", x: 73, y: 50, tier: "data", detail: "Every detection persisted for later analysis." },
        { id: "chat", label: "Log Chatbot", sublabel: "TF-IDF · cosine", x: 91, y: 50, tier: "async", detail: "Natural-language questions over the detection history." },
      ],
      edges: [
        { from: "cams", to: "decode" },
        { from: "decode", to: "detect" },
        { from: "decode", to: "track" },
        { from: "detect", to: "track", label: "boxes" },
        { from: "track", to: "logs" },
        { from: "detect", to: "logs", async: true },
        { from: "logs", to: "chat", async: true },
      ],
    },
  },
];

/* -------------------------------------------------------------------------- */
/* 7 · Technical expertise                                                     */
/* -------------------------------------------------------------------------- */

export const expertise: Expertise[] = [
  {
    id: "backend",
    title: "Backend Engineering",
    icon: "server",
    summary: "Asynchronous services designed so that slow dependencies never become slow responses.",
    points: [
      {
        heading: "Async as the default",
        body: "FastAPI services built non-blocking from the start, so an API that depends on multi-second inference still answers in milliseconds and reports progress rather than holding a connection open.",
      },
      {
        heading: "Query-shaped APIs",
        body: "Advanced filtering and pagination designed against the access patterns the client actually has, which is what turned into a 35% improvement in recruiter workflow efficiency.",
      },
      {
        heading: "Interfaces over implementations",
        body: "35+ endpoints presenting relational, vector and cache storage as one coherent surface, so callers never need to know which store answered them.",
      },
    ],
    tags: ["FastAPI", "Spring Boot", "REST", "Microservices", "Async I/O"],
  },
  {
    id: "ai",
    title: "AI & LLM Integration",
    icon: "brain",
    summary: "Treating a model as a dependency with a latency budget, a cost, and a failure mode.",
    points: [
      {
        heading: "Semantic matching over keywords",
        body: "Replacing profile-keyword evaluation with holistic CV-to-job-description matching improved shortlisting consistency by 30% and raised match accuracy by 35%.",
      },
      {
        heading: "Inference off the request path",
        body: "Vertex AI and GPT-4 calls run as background work with results persisted on completion. The API surface stays fast and the model provider stays swappable.",
      },
      {
        heading: "Retrieval that can be rebuilt",
        body: "Embeddings in ChromaDB are a derived artefact, never the system of record, so the corpus can be re-indexed without risking the source of truth.",
      },
    ],
    tags: ["Vertex AI", "GPT-4", "ChromaDB", "Semantic search", "TensorFlow"],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    icon: "cloud",
    summary: "Containerised infrastructure a small team can deploy and afford to run.",
    points: [
      {
        heading: "Containerised end to end",
        body: "Docker from local development through to Cloud Run, which removed the class of bugs that only appear in staging and resolved over 60% of the CI/CD issues on the learning platform.",
      },
      {
        heading: "Cost as a design input",
        body: "Deploying on Cloud Run so services scale to zero between bursts cut operational overhead by 25% without adding an operator to the team.",
      },
      {
        heading: "Isolation where it matters",
        body: "Firecracker microVMs on EC2 for untrusted code execution: a per-submission kernel boundary rather than a shared runtime, reducing execution-level risk by 80%.",
      },
    ],
    tags: ["Docker", "Cloud Run", "Cloud SQL", "Kubernetes", "AWS EC2", "Firecracker"],
  },
  {
    id: "data",
    title: "Data & Storage",
    icon: "blocks",
    summary: "Choosing the storage model per access pattern instead of per habit.",
    points: [
      {
        heading: "Relational plus JSONB",
        body: "Optimised JSONB schemas in Cloud SQL kept strict guarantees on the fields that carry invariants while leaving genuinely variable data queryable, improving performance and flexibility by 30%.",
      },
      {
        heading: "The right store for the read",
        body: "PostgreSQL for state, ChromaDB for semantics, Redis for the hot path. Three stores is a cost worth paying when one of them would have to be wrong for two of the workloads.",
      },
      {
        heading: "Derived data stays derived",
        body: "Anything that can be recomputed from the source is treated as disposable, which keeps re-indexing and cache invalidation from being high-risk operations.",
      },
    ],
    tags: ["PostgreSQL", "JSONB", "Redis", "ChromaDB", "MongoDB", "MySQL"],
  },
  {
    id: "systems",
    title: "System Design",
    icon: "network",
    summary: "Deciding where work happens, and what is allowed to be slow.",
    points: [
      {
        heading: "Batch the fan-out",
        body: "Scoring a candidate against every open requisition in a single pass rather than one ticket at a time is the design decision behind a 91% reduction in screening time.",
      },
      {
        heading: "Boundaries around the untrusted",
        body: "User code, model output and third-party responses each get an explicit boundary before they reach anything stateful.",
      },
      {
        heading: "Measured, then argued",
        body: "Every claim on this page has a number behind it because performance opinions without measurements are just preferences.",
      },
    ],
    tags: ["Microservices", "Concurrency", "Latency budgets", "Caching", "Agile"],
  },
];

/* -------------------------------------------------------------------------- */
/* 9 · GitHub                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Mirrors the real GitHub account. Everything here is verifiable against
 * github.com/Hardik-111 — refresh the counts when they drift rather than
 * rounding them up.
 */
export const github = {
  username: "Hardik-111",
  profileUrl: "https://github.com/Hardik-111",
  note: "Almost everything I have built professionally lives behind a company login, so this is the smaller half of the picture: the computer vision system from my final year, a conference site, and the web projects I learned on before I moved to backend work.",
  stats: {
    publicRepos: 13,
    originalRepos: 10,
    memberSince: "2021",
  },
  repos: [
    {
      name: "OptiVision",
      description:
        "Real-time object detection and live stream analysis on a Jetson Nano, using TensorFlow CenterNet ResNet-101, OpenCV and RTSP stream integration.",
      language: "Python",
      languageColor: "#3572A5",
      stars: 2,
      forks: 1,
      updated: "Apr 2025",
      href: "https://github.com/Hardik-111/OptiVision",
    },
    {
      name: "Research-Conference-Website",
      description:
        "Site for the International Conference on HABIT 2025, covering participant resources, registration and paper submissions.",
      language: "JavaScript",
      languageColor: "#f1e05a",
      stars: 0,
      forks: 0,
      updated: "Mar 2026",
      href: "https://github.com/Hardik-111/Research-Conference-Website",
    },
    {
      name: "VIBE-Lane",
      description:
        "Responsive MERN e-commerce platform with dynamic product pages, authentication, a cart and Stripe checkout.",
      language: "JavaScript",
      languageColor: "#f1e05a",
      stars: 1,
      forks: 0,
      updated: "Mar 2024",
      href: "https://github.com/Hardik-111/VIBE-Lane",
    },
    {
      name: "NewsX",
      description:
        "React news reader with category browsing across business, sports, entertainment, health, science and technology.",
      language: "JavaScript",
      languageColor: "#f1e05a",
      stars: 1,
      forks: 1,
      updated: "Jul 2024",
      href: "https://github.com/Hardik-111/NewsX",
    },
  ] satisfies Repo[],
};

/* -------------------------------------------------------------------------- */
/* 10 · Testimonials                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Empty on purpose: an invented endorsement is worse than no section at all.
 * The carousel is skipped entirely while this array is empty, and appears the
 * moment you add a real quote. Ask two or three colleagues at Grid Dynamics
 * for something specific — the shape to aim for is one concrete thing you did
 * and what it changed, in two or three sentences:
 *
 *   {
 *     quote: "…",
 *     name: "Full Name",
 *     title: "Engineering Manager",
 *     company: "Grid Dynamics",
 *     initials: "FN",
 *   }
 */
export const testimonials: Testimonial[] = [];

/* -------------------------------------------------------------------------- */
/* 11 · Contact & 12 · Footer                                                  */
/* -------------------------------------------------------------------------- */

export const contact = {
  eyebrow: "Contact",
  title: "Let's build something that scales.",
  body: "I am at Grid Dynamics, currently engaged with Visa on merchant platforms, and still enjoy talking backend design, Java services, and the AI systems work I did before. If you want to compare notes or explore something together, reach out.",
  cta: { label: "Start a conversation", href: "mailto:ihardik.112@gmail.com" },
  secondary: { label: "Download résumé", href: "/resume.pdf" },
  responseTime: "Usually replies within a day",
};

export const footer = {
  message: "Grid Dynamics engineer — Java for Visa today, AI platforms before that.",
  colophon: "Next.js · TypeScript · Tailwind · Framer Motion · GSAP · Three.js",
};

/* -------------------------------------------------------------------------- */
/* Section headings                                                            */
/* -------------------------------------------------------------------------- */

export const sectionCopy = {
  skills: {
    eyebrow: "Capabilities",
    title: "The toolkit, grouped by what it is actually for.",
    description:
      "Depth in a handful of things and working literacy in the rest. This is what I reach for, not everything I have installed.",
  },
  experience: {
    eyebrow: "Experience",
    title: "One company, two very different engagements.",
    description:
      "Still at Grid Dynamics — currently engaged with Visa on Java merchant platforms. The AI platform numbers below came from the engagement before this one, and every bullet is tied to something that shipped.",
  },
  projects: {
    eyebrow: "Selected work",
    title: "Three systems, and the decisions behind them.",
    hint: "Scroll to travel sideways",
  },
  github: {
    eyebrow: "Open source",
    title: "What is public, and what is not.",
    description:
      "The systems I am proudest of are proprietary. These are the repositories anyone can read.",
  },
  expertise: {
    eyebrow: "Technical expertise",
    title: "Five areas, and what I actually mean by them.",
    description: "Labels are cheap. Each card opens onto the specific practices behind it.",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What the people I shipped with say.",
  },
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: productDemo.sectionId, label: productDemo.navLabel },
  { id: "expertise", label: "Expertise" },
  { id: "contact", label: "Contact" },
];
