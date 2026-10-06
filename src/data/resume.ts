/* ═══════════════════════════════════════════════════════════════════════
   📟 RESUME CONFIG — THE ONE FILE TO EDIT
   ─────────────────────────────────────────────────────────────────────
   Everything on the site renders from this file. No component code needs
   to change when content is updated.

   MAP:
   site.personal        → name, contact, location, availability
   site.hero            → hero headline, role line, CTA labels, hero stats
   site.heroMarquee     → the scrolling skill ticker under the hero
   site.divider         → the giant outline-text ticker mid-page
   site.about           → profile paragraphs, summary-card facts, operating
                          method strip, research / builder interests
   site.skills          → "Stack" groups + tags, "currently exploring" line
   site.experience      → ROLES (internships / programs). `deliverables`
                          holds projects built inside that role.
   site.projects        → PERSONAL PROJECTS ONLY. Optional `repo` links the
                          VIEW REPOSITORY button; optional `image` points at
                          a themed schematic in /public/images.
   site.achievements    → recognition slides
   site.education       → university + school record (CGPA appears once here)
   site.certifications  → certification rows
   site.socials         → github / linkedin / kaggle / phone rows + hero
   site.contact         → contact heading, sub-copy
   site.footer          → footer microcopy

   Experience, Work and Recognition are VERTICAL PIN sections: while pinned,
   scrolling steps through slides in place (vertically), then releases the
   page. Long slides buy extra scroll room automatically; no inner scrollbars.
══════════════════════════════════════════════════════════════════════ */

export const site = {
  personal: {
    full: "Harsh Yadav",
    firstName: "HARSH",
    lastName: "YADAV",
    role: "AI/ML ENGINEER — LLM SYSTEMS · AGENTS · CLOUD & SECURITY",
    location: "Gurgaon, India",
    availability: "OPEN TO WORK — CLASS OF 2027",
    email: "harsh664yadav@gmail.com",
    phone: "+91 98711 21912",
    phoneHref: "tel:+919871121912",
  },

  hero: {
    kicker: "B.TECH CSE (AI/ML) · THE NORTHCAP UNIVERSITY · 2023–2027",
    status: "AVAILABLE FOR INTERNSHIPS & COLLABORATION",
    ctaPrimary: { label: "VIEW PROJECTS", href: "#work" },
    ctaSecondary: { label: "GET IN TOUCH", href: "#contact" },
    stats: [
      {
        value: "1 / 3",
        isStatic: true,
        label: "Competitive hackathons",
        sub: "Wins / finals & podium",
      },
      {
        value: "Research",
        isStatic: true,
        label: "Scholar focus",
        sub: "LLM agents · RAG · Security",
      },
      {
        value: "Contributor",
        isStatic: true,
        label: "GitHub · swiftsane",
        sub: "Open source & team builds",
      },
    ],
  },

  heroMarquee: [
    "RAG Pipelines",
    "Multi-Agent Orchestration",
    "LLM APIs",
    "LangChain",
    "Prompt Engineering",
    "Tool Calling",
    "Python",
    "Go",
    "TypeScript",
    "Docker",
    "Azure",
    "AWS",
    "Cloudflare",
    "React",
    "FastAPI",
    "GitHub Actions",
  ],

  divider: ["HACKATHON WINNER", "CLOUD NATIVE", "LLM NATIVE", "SYSTEMS BUILDER"],

  about: {
    kicker: "PROFILE · COMPUTER SCIENCE (AI/ML)",
    note: "Background, focus and working method",
    paragraphs: [
      "Computer Science (AI/ML) undergraduate with hands-on experience in Python, SQL, cloud deployment, AI/LLM systems, workflow automation, and data analysis.",
      "I have built automated data-processing workflows and AI-powered applications across software development, cloud, and security domains — from model interaction and prompt engineering to tool calling, multi-agent orchestration, and the validation layer that keeps systems reliable.",
      "I prototype quickly and work methodically through unfamiliar codebases and systems, improving AI workflows through structured experimentation, debugging, and measurement.",
    ],
    facts: [
      ["NAME", "Harsh Yadav"],
      ["DEGREE", "B.Tech CSE (AI/ML) — 2027"],
      ["BASE", "Gurgaon, India"],
      ["FOCUS", "LLM systems · Agents · Cloud"],
      ["LANGUAGES", "English · Hindi"],
      ["EMAIL", "harsh664yadav@gmail.com"],
    ],
    method: [
      {
        phase: "01",
        title: "Prototype",
        note: "Build the smallest working version of the workflow, quickly, end to end.",
      },
      {
        phase: "02",
        title: "Experiment",
        note: "Swap models, prompts and architectures; compare with evidence, not vibes.",
      },
      {
        phase: "03",
        title: "Validate",
        note: "Add validation, error handling and observability against silent failures.",
      },
      {
        phase: "04",
        title: "Ship",
        note: "Containerize, deploy to cloud or edge, and troubleshoot until reliable.",
      },
    ],
    dispatch: [
      {
        tag: "WORKING ON",
        items: [
          "IntentDraw — sketch-to-UI LLM pipeline with interchangeable vision providers",
          "Vendor Security Platform — AI-powered TPRM automated cyber due diligence",
          "Smart Chess Instructor — Stockfish evaluation & cross-game pattern agents",
        ],
      },
      {
        tag: "EXPLORING",
        items: [
          "Agent memory & long-horizon autonomous planning architectures",
          "Edge inference & serverless orchestration on Cloudflare Workers",
          "RAG guardrails, automated evaluation pipelines & prompt security",
        ],
      },
    ],
    interests:
      "RESEARCH INTERESTS — AGENT SYSTEMS · RAG EVALUATION & GUARDRAILS · EDGE INFERENCE · ALSO OPEN TO ENTREPRENEURIAL & EARLY-STAGE BUILDING",
  },

  skills: {
    kicker: "TECHNICAL STACK",
    note: "Tools and platforms used in shipped work",
    currently: "CURRENT FOCUS — AGENT MEMORY · EVALUATIONS & GUARDRAILS · EDGE INFERENCE",
    groups: [
      {
        name: "Cloud & Platform",
        items: [
          "Microsoft Azure",
          "AWS",
          "Oracle Cloud",
          "Cloudflare Workers",
          "Cloudflare Pages",
          "DNS & Custom Domains",
        ],
      },
      {
        name: "AI / ML",
        items: [
          "LLM APIs",
          "LangChain",
          "RAG Pipelines",
          "Tool Calling",
          "Multi-Agent Orchestration",
          "Prompt Engineering",
          "TensorFlow",
          "Scikit-learn",
          "Hugging Face",
        ],
      },
      {
        name: "Languages",
        items: ["Python", "Go", "TypeScript", "Java", "SQL", "Bash"],
      },
      {
        name: "Systems & DevOps",
        items: ["Docker", "Docker Compose", "GitHub Actions", "N8N", "Linux / Kali", "REST APIs"],
      },
      {
        name: "Frontend & Backend",
        items: [
          "React",
          "Vite",
          "Tailwind CSS",
          "Express",
          "FastAPI",
          "Flask",
          "GraphQL",
          "Google OAuth",
        ],
      },
    ],
  },

  experience: {
    kicker: "INTERNSHIPS · STRUCTURED PROGRAMS",
    note: "Roles, responsibilities, and the deliverables shipped inside them",
    entries: [
      {
        type: "Internship",
        short: "TinyCrows",
        period: "JUN 2026 — AUG 2026",
        role: "AI and Software Development Intern",
        org: "TinyCrows Pvt. Ltd.",
        location: "Remote",
        points: [
          "Developed a multi-agent autonomous VAPT tool with a Go-based CLI coordinating security-assessment workflows from planning and execution through report generation.",
          "Built the orchestration layer integrating multiple LLM providers: LLMs handle planning and decision-making, while security-testing execution stays controlled by the application.",
          "Rebuilt the majority of an AI security-assessment platform, developing the N8N backend to connect application components, automate data flows, and integrate LLM-powered functionality.",
          "Developed frontend functionality with React, TypeScript, Vite and Tailwind CSS, deployed via Azure, and implemented Google SSO while resolving issues across an unfamiliar codebase.",
          "Containerized assessment environments with Docker and automated workflows with GitHub Actions and CI/CD for reproducible, reliable execution.",
          "Extensively tested and debugged on Linux / Kali Linux — resolving execution failures, timeouts, incomplete workflows, and agent/service interaction issues.",
        ],
        deliverables: [
          {
            name: "Autonomous VAPT & Security Assessment Tool",
            blurb:
              "Multi-agent Go CLI that plans and runs end-to-end security assessments. An LLM orchestration layer (multi-provider) drives planning and decisions while the application controls execution; environments are containerized with Docker and the whole pipeline runs through GitHub Actions CI/CD.",
            stack: ["Go", "LLM Orchestration", "Docker", "GitHub Actions", "Linux/Kali"],
          },
          {
            name: "AI Tools Security Assessment Platform",
            blurb:
              "Major rebuild of an AI security-assessment platform: N8N backend connecting components and automating data flows, React / TypeScript / Vite / Tailwind frontend, Azure deployment, and Google SSO — delivered while working inside an unfamiliar codebase.",
            stack: ["React", "TypeScript", "Vite", "N8N", "Azure", "Google SSO"],
          },
        ],
      },
      {
        type: "Program",
        short: "Azure Program",
        period: "JUN 2025 — JUL 2025",
        role: "AI & Cloud Development Trainee",
        org: "Unique Training Solutions",
        location: "Gurgaon · Microsoft Azure track",
        points: [
          "Completed a 6-week Microsoft Azure cloud training program covering cloud fundamentals, application hosting, deployment, and Azure services.",
          "Built and deployed an AI-powered weather application using Python, the OpenWeather API, and Azure App Services, integrating REST APIs and cloud deployment.",
          "Built data pipelines for real-time multi-city weather data — ingestion, preprocessing, and transformation.",
        ],
        deliverables: [
          {
            name: "AI-Powered Weather Application",
            blurb:
              "Multi-city weather application built with Python and the OpenWeather API behind a REST-driven dashboard, deployed on Azure App Services, with real-time ingestion, preprocessing and transformation pipelines.",
            stack: ["Python", "OpenWeather API", "Azure App Services", "REST"],
          },
        ],
      },
    ],
  },

  projects: {
    kicker: "PERSONAL PROJECTS · LLMs · SECURITY · INTELLIGENT SYSTEMS",
    note: "Self-initiated systems, designed and built end to end",
    items: [
      {
        name: "IntentDraw",
        short: "IntentDraw",
        status: "IN DEVELOPMENT",
        period: "FEB 2026 — PRESENT",
        blurb:
          "An LLM-powered system that transforms hand-drawn UI sketches into structured frontend component trees and reusable UI specifications.",
        highlights: [
          "Model-agnostic LLM interface supporting interchangeable providers including Claude, OpenAI and others, enabling experimentation and comparison across models.",
          "Spatial parsing and sketch-to-component mapping pipeline converting visual layout information into typed, machine-readable UI structures.",
          "Validation and workflow logic for reproducible experimentation, API evaluation, debugging, and iterative development of the sketch-to-UI pipeline.",
        ],
        stack: ["Python", "TypeScript", "LLM APIs", "Computer Vision"],
        image: "/images/intentdraw.jpg",
        schematicLabel: "WORKFLOW · SKETCH → COMPONENT TREE",
        repo: "https://github.com/Harsh-Yadav-664/IntentDraw",
      },
      {
        name: "Vendor Security Assessment Platform",
        short: "Vendor Security",
        status: "PROOF OF CONCEPT",
        period: "MAR 2026 — APR 2026",
        blurb:
          "An AI-powered TPRM platform automating vendor onboarding, risk assessment, due diligence, and compliance workflows end to end.",
        highlights: [
          "Automated workflows for vendor profiling, criticality assessment, evidence collection, security evaluation, and remediation.",
          "Cyber due-diligence pipeline evaluating SSL/TLS, SPF, DKIM, DMARC, security headers, exposed services, open ports, and baseline vulnerability checks.",
          "AI-assisted questionnaire and document validation comparing vendor responses against submitted documentation to flag inconsistencies.",
          "Automated risk scoring, audit trails, evidence collection, and remediation reporting for continuous third-party risk monitoring.",
        ],
        stack: ["N8N", "JavaScript", "LangChain", "AI Agents"],
        image: "/images/vendor-security.jpg",
        schematicLabel: "TPRM · INGEST → DUE DILIGENCE → RISK",
        repo: "",
      },
      {
        name: "Smart Chess Instructor",
        short: "Chess Instructor",
        status: "IN DEVELOPMENT",
        period: "ONGOING",
        blurb:
          "An intelligent chess analysis and training system that evaluates play with Stockfish, surfaces tactical patterns, and builds personalized coaching insights.",
        highlights: [
          "Integrates Stockfish to evaluate moves using centipawn loss and positional metrics.",
          "Cross-game analysis pipeline in Pandas and NumPy identifies recurring mistakes and generates player-specific insights across sessions.",
          "Real-time board analysis layer that detects and visualizes tactical patterns including forks, pins, and discovered attacks.",
          "Agent-based player analysis under development to interpret gameplay patterns and generate personalized training recommendations.",
        ],
        stack: ["Python", "Stockfish", "Pandas", "NumPy", "AI Agents"],
        image: "/images/chess-instructor.jpg",
        schematicLabel: "ANALYSIS · EVALUATION → TACTICS → COACHING",
        repo: "https://github.com/Harsh-Yadav-664/Chess-Analyzer-Instructor",
      },
    ],
  },

  achievements: {
    kicker: "NATIONAL & INTERNATIONAL HACKATHONS",
    note: "Winner, podium finisher, and finalist placements",
    items: [
      {
        result: "1st Place",
        short: "Eclipse 6.0",
        title: "Eclipse 6.0 Hackathon",
        org: "Thapar Institute of Engineering & Technology (TIET)",
        meta: "APR 2026 · TEAM OF 3",
        note: "First-place finish as part of a three-person team, building an AI-powered TPRM platform for automated vendor risk assessment and compliance.",
      },
      {
        result: "2nd Runner-Up",
        short: "SprintForGood",
        title: "SprintForGood AI Hackathon",
        org: "thingQbator · IIT Delhi",
        meta: "2026 · 200+ TEAMS",
        note: "Podium finish for an AI-driven SEBI CSCRF compliance solution; led frontend integration, API connections, and the LLM pipeline.",
      },
      {
        result: "Finalist",
        short: "India Innovates",
        title: "India Innovates 2026",
        org: "National civic-tech hackathon",
        meta: "1,200+ TEAMS · TOP 7 CYBERSECURITY",
        note: "Recognized among the top seven cybersecurity-focused teams and shortlisted for evaluation by Indian Government ministries.",
      },
      {
        result: "Global Top 112",
        short: "Cardano Asia",
        title: "Cardano Hackathon Asia",
        org: "IBW Edition",
        meta: "2025 · 1,000+ SUBMISSIONS",
        note: "Selected among the top entries from 1,000+ international submissions.",
      },
    ],
  },

  education: {
    school: "The NorthCap University",
    degree: "B.Tech — Computer Science (AI/ML)",
    period: "AUG 2023 — MAY 2027",
    location: "Gurgaon, India",
    cgpa: "8.59",
    coursework: [
      "Computer Networks",
      "Data Structures & Algorithms",
      "DBMS",
      "Machine Learning",
      "Object-Oriented Programming",
    ],
    schoolRecord: [
      { level: "Class XII", school: "Blue Bells Public School", grade: "89.00%" },
      { level: "Class X", school: "Blue Bells Public School", grade: "94.20%" },
    ],
  },

  certifications: [
    { name: "AWS Academy Cloud Foundations", issuer: "AWS Academy", year: "2025" },
    { name: "Generative AI Professional", issuer: "Oracle Cloud Infrastructure", year: "2025" },
    { name: "Data Science Professional", issuer: "Oracle Cloud Infrastructure", year: "2025" },
    { name: "Certified AI Foundations Associate", issuer: "Oracle Cloud Infrastructure", year: "2025" },
    { name: "Responsible & Safe AI Systems", issuer: "NPTEL", year: "2025" },
  ],

  socials: [
    { label: "GITHUB", handle: "Harsh-Yadav-664", href: "https://github.com/Harsh-Yadav-664" },
    { label: "LINKEDIN", handle: "in/harsh664", href: "https://linkedin.com/in/harsh664" },
    { label: "KAGGLE", handle: "harshyadav664", href: "https://www.kaggle.com/harshyadav664" },
    { label: "PHONE", handle: "+91 98711 21912", href: "tel:+919871121912" },
  ],

  contact: {
    kicker: "GET IN TOUCH",
    note: "Available for internships, research, and collaboration",
    titleA: "Have a problem",
    titleB: "worth solving?",
    sub: "Internships, full-time opportunities, research collaboration, hackathon teams, or technical side projects — the inbox is open and every message is read.",
  },

  footer: {
    left: "© 2026 HARSH YADAV · GURGAON, INDIA",
    mid: "REACT · THREE.JS · TAILWIND CSS",
  },
};

export type Site = typeof site;
