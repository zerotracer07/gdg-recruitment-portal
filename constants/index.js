// Current Date
import {
  ManageAccounts,
  Trophy,
  Campaign,
  ConnectWithoutContact,
  DesignServices,
  Palette,
  Language,
  Mobile2,
  SportsEsports,
  Analytics,
  Hub,
  Link,
  Cloud,
} from "@material-symbols-svg/react/outlined";

export const curDay = new Date().getDay();
export const curYear = new Date().getFullYear();
export const curDate = new Date().getDate();
export const curMonth = new Date().getMonth();
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Contact Links
export const LINKS = {
  instagram: "#",
  discord: "#",
  gmail: "#",
  linkedin: "#",
  x: "#",
};

// Department Details
export const reviews = [
  {
      id: "c21ca066-ab4d-40a3-943c-f170d6312bdc",
      icon: ManageAccounts,
      tone: "#8ab4f8",
      name: "Management",
      description: "The crew that plans, coordinates, and keeps every event running.",
      leads: [
        { name: "Varun Achary", role: "Management Lead" },
        { name: "Dhyan", role: "Management Lead" },
      ],
    },
    {
      id: "4499a966-2740-4c36-88dd-8916a909fc77",
      icon: Campaign,
      tone: "#FF7A6B",
      name: "Publicity",
      description: "The team behind the feed — videos, posts, and campaigns.",
      leads: [
        { name: "Vedanti", role: "Publicity Lead" },
        { name: "Ananya Harithas", role: "Publicity Lead" },
      ],
    },
    {
      id: "3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
      icon: ConnectWithoutContact,
      tone: "#FFD45E",
      name: "Outreach",
      description: "The bridge to sponsors, partners, and fellow communities.",
      leads: [
        { name: "Adarsh B Poduval", role: "Outreach Lead" },
        { name: "Sumedh Patange", role: "Outreach Lead" },
      ],
    },
    {
      id: "e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
      icon: DesignServices,
      tone: "#FF7A6B",
      name: "UI/UX",
      description: "User research, wireframes, and interfaces that feel effortless.",
      leads: [{ name: "Adil O", role: "UI/UX Lead" }],
    },
    {
      id: "d3beefc1-f8b0-4202-b26c-36e9804b6636",
      icon: Palette,
      tone: "#FFD45E",
      name: "Creatives",
      description: "Posters, branding, and the visual voice of GDG VITC.",
      leads: [
        { name: "Samriddhi", role: "Creatives Lead" },
        { name: "Sadhana", role: "Creatives Co-Lead" },
      ],
    },
    {
      id: "8143de1d-db17-42fa-958d-13b10804f894",
      icon: Language,
      tone: "#8AB4F8",
      name: "Web Dev",
      description: "Responsive sites and full-stack apps for the open web.",
      leads: [{ name: "Surjyadip Sen", role: "Web Dev Lead" }],
    },
    {
      id: "339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
      icon: Mobile2,
      tone: "#6EE7A0",
      name: "App Dev",
      description: "Native and cross-platform mobile apps with Kotlin and Flutter.",
      leads: [{ name: "Hardik Prem", role: "App Dev Lead" }],
    },
    {
      id: "9055864f-c7dc-44cd-91d5-8759d32a496a",
      icon: SportsEsports,
      tone: "#FF7A6B",
      name: "Game Dev",
      description: "Playable worlds built with Unity, Godot, and web tech.",
      leads: [
        { name: "Kingshuk", role: "Game Dev Lead" },
        { name: "Kanha Arjun Jain", role: "Game Dev Lead" },
      ],
    },
    {
      id: "c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
      icon: Analytics,
      tone: "#8AB4F8",
      name: "Data Science",
      description: "Machine learning and analytics that turn raw data into insight.",
      leads: [{ name: "Srivarshini S", role: "Data Science Lead" }],
    },
    {
      id: "a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
      icon: Cloud,
      tone: "#FFD45E",
      name: "Cloud & DevOps",
      description: "Backends, infrastructure, and everything that keeps apps online.",
      leads: [{ name: "V Srivatsan", role: "Cloud & DevOps Lead" }],
    },
    {
      id: "6a89c4e2-7b19-4f32-821e-9821a41b5201",
      icon: Hub,
      tone: "#FF7A6B",
      name: "Blockchain",
      description: "Decentralised apps, smart contracts, and Web3 tooling.",
      leads: [{ name: "Aditi Singh", role: "Blockchain Lead" }],
    },
    {
      id: "3e9ac635-01d4-495e-aa87-a7335a2403c2",
      icon: Trophy,
      tone: "#6EE7A0",
      name: "Competitive Programming",
      description: "Algorithms, contests, and interview-ready problem solving.",
      leads: [],
    },
];

// Questionnaire Data
export const QuestionnaireData = [
  {
    department: "App Dev",
    questions: [
      {
        name: "What experience do you have with mobile development (Kotlin, Flutter, React Native, or native Android/iOS)?",
        type: "generic",
        placeholder: "Briefly describe apps you've built or tinkered with..."
      },
      {
        name: "Walk us through how you would design a simple campus event app — what screens would it have and how would data flow?",
        type: "long-text",
        placeholder: "Screens, navigation, state management, backend..."
      },
      {
        name: "Have you published anything on the Play Store, App Store, or GitHub? Share links.",
        type: "short-text",
        placeholder: "Links, or 'Not yet'"
      },
      {
        name: "How do you handle app state and offline data (e.g. caching, local DBs like Room or Hive)?",
        type: "generic",
        placeholder: "e.g. Provider/Riverpod/Bloc, Room, Hive, SQLite..."
      }
    ],
  },
  {
    department: "Blockchain",
    questions: [
      {
        name: "Explain in your own words what a smart contract is and why it matters.",
        type: "long-text",
        placeholder: "2-4 sentences in plain language..."
      },
      {
        name: "Have you built anything with Solidity, Rust, or Web3 libraries (ethers.js, web3.js)? Share details or links.",
        type: "generic",
        placeholder: "Projects, repos, or what you've explored so far..."
      },
      {
        name: "What excites you most about Web3 or decentralized apps?",
        type: "generic",
        placeholder: "DeFi, NFTs, DAOs, identity, gaming..."
      },
      {
        name: "Which chain or tooling have you explored?",
        type: "short-text",
        placeholder: "e.g. Ethereum + Hardhat, Solana..."
      }
    ],
  },
  {
    department: "Cloud & DevOps",
    questions: [
      {
        name: "What backend technologies have you worked with (Node, Python, Go, databases)?",
        type: "generic",
        placeholder: "e.g. Node + Postgres, FastAPI + Mongo..."
      },
      {
        name: "Explain what CI/CD means and describe a pipeline you would set up for a simple web app.",
        type: "long-text",
        placeholder: "Build, test, deploy steps and tools..."
      },
      {
        name: "Have you used Docker, AWS/GCP, or any cloud service? What did you deploy?",
        type: "generic",
        placeholder: "Containers, VMs, serverless — whatever you've tried..."
      },
      {
        name: "What does 'infrastructure as code' mean to you?",
        type: "short-text",
        placeholder: "e.g. Terraform, Docker Compose..."
      }
    ],
  },
  {
    department: "Competitive Programming",
    questions: [
      {
        name: "Which platforms do you practice on? Share your handles and ratings.",
        type: "short-text",
        placeholder: "e.g. Codeforces 1400 @handle, LeetCode Knight"
      },
      {
        name: "What is your strongest DSA topic?",
        type: "short-text",
        placeholder: "e.g. DP, graphs, number theory"
      },
      {
        name: "Describe the hardest problem you have solved and your approach.",
        type: "long-text",
        placeholder: "Problem, thought process, complexity..."
      },
      {
        name: "How many contests do you participate in per month?",
        type: "short-text",
        placeholder: "e.g. 4-6"
      },
      {
        name: "Why do you want to join the Competitive Programming department?",
        type: "generic",
        placeholder: "2-3 sentences..."
      }
    ],
  },
  {
    department: "Data Science",
    questions: [
      {
        name: "What experience do you have with Python, pandas, or ML frameworks (scikit-learn, TensorFlow, PyTorch)?",
        type: "generic",
        placeholder: "Libraries, courses, projects..."
      },
      {
        name: "Describe a data project you have done — the dataset, your approach, and what you found.",
        type: "long-text",
        placeholder: "Dataset, cleaning, modelling, insights..."
      },
      {
        name: "How would you explain overfitting to a non-technical person, and how do you prevent it?",
        type: "long-text",
        placeholder: "Intuition + techniques..."
      },
      {
        name: "Which areas interest you the most?",
        type: "short-text",
        placeholder: "e.g. NLP, computer vision, analytics"
      },
      {
        name: "Share links to your notebooks, repos, or Kaggle profile.",
        type: "short-text",
        placeholder: "Links, or 'Not yet'"
      }
    ],
  },
  {
    department: "Creatives",
    questions: [
      {
        name: "Which design tools do you use (Figma, Photoshop, Illustrator, Canva)?",
        type: "short-text",
        placeholder: "e.g. Figma + Photoshop"
      },
      {
        name: "Share links to your portfolio or 2–3 pieces you are proud of.",
        type: "generic",
        placeholder: "Behance, Drive, Instagram..."
      },
      {
        name: "How would you design a poster for a flagship hackathon? Walk us through your process.",
        type: "long-text",
        placeholder: "Concept, layout, typography, color..."
      },
      {
        name: "What design style or designer inspires you?",
        type: "generic",
        placeholder: "2-3 sentences..."
      }
    ],
  },
  {
    department: "Game Dev",
    questions: [
      {
        name: "Which engines or tools have you used (Unity, Godot, Unreal, web)?",
        type: "short-text",
        placeholder: "e.g. Unity + C#, Godot + GDScript"
      },
      {
        name: "Have you built or shipped a game (even a jam game)? Share links.",
        type: "generic",
        placeholder: "itch.io, GitHub, or 'Not yet'"
      },
      {
        name: "Describe a game mechanic you would love to implement and how you would build it.",
        type: "long-text",
        placeholder: "Mechanic, systems, implementation sketch..."
      },
      {
        name: "How do you approach game feel — juice, sound, and feedback?",
        type: "long-text",
        placeholder: "Particles, screenshake, audio, tuning..."
      },
      {
        name: "Why do you want to build games with us?",
        type: "generic",
        placeholder: "2-3 sentences..."
      }
    ],
  },
  {
    department: "Management",
    questions: [
      {
        name: "Have you organized or volunteered at any events before? Describe your role.",
        type: "generic",
        placeholder: "Event, your responsibilities, team size..."
      },
      {
        name: "Imagine a speaker cancels an hour before a 300-person event. What do you do?",
        type: "long-text",
        placeholder: "Step-by-step contingency plan..."
      },
      {
        name: "How do you keep a team on track when deadlines slip?",
        type: "long-text",
        placeholder: "Communication, prioritization, escalation..."
      },
      {
        name: "How many hours per week can you commit during event season?",
        type: "short-text",
        placeholder: "e.g. 6-8 hours"
      }
    ],
  },
  {
    department: "Outreach",
    questions: [
      {
        name: "Have you ever pitched a sponsor, partner, or community for anything? What happened?",
        type: "generic",
        placeholder: "Who, what you asked, outcome..."
      },
      {
        name: "How would you convince a company to sponsor a student tech event?",
        type: "long-text",
        placeholder: "Value proposition, tiers, follow-up..."
      },
      {
        name: "Which communities or clubs are you already part of?",
        type: "generic",
        placeholder: "Clubs, Discord servers, chapters..."
      },
      {
        name: "Draft a 3-line cold outreach message to a potential sponsor.",
        type: "long-text",
        placeholder: "Hook, ask, close..."
      }
    ],
  },
  {
    department: "Publicity",
    questions: [
      {
        name: "Which social platforms do you create for? Share your best-performing post or reel.",
        type: "generic",
        placeholder: "Platform, link, views..."
      },
      {
        name: "How many followers or subscribers do your accounts have?",
        type: "short-text",
        placeholder: "e.g. 2.5k on Instagram"
      },
      {
        name: "Pitch a reel idea to hype recruitments in under 30 seconds.",
        type: "long-text",
        placeholder: "Hook, shots, caption, audio..."
      },
      {
        name: "What tools do you use for editing?",
        type: "short-text",
        placeholder: "e.g. CapCut, Premiere Pro, After Effects"
      }
    ],
  },
  {
    department: "UI/UX",
    questions: [
      {
        name: "What does your design process look like, from research to handoff?",
        type: "long-text",
        placeholder: "Research, wireframes, testing, handoff..."
      },
      {
        name: "Share links to case studies, wireframes, or Figma files.",
        type: "generic",
        placeholder: "Figma, Behance, Notion..."
      },
      {
        name: "How do you design for accessibility? Name 3 concrete practices.",
        type: "generic",
        placeholder: "e.g. contrast, focus states, tap targets..."
      },
      {
        name: "Pick one screen of any app you dislike. What would you redesign and why?",
        type: "long-text",
        placeholder: "App, problems, your solution..."
      },
      {
        name: "Which prototyping tools do you use?",
        type: "short-text",
        placeholder: "e.g. Figma, Framer"
      }
    ],
  },
  {
    department: "Web Dev",
    questions: [
      {
        name: "What frontend and backend tech have you used (React, Next.js, Node, databases)?",
        type: "generic",
        placeholder: "e.g. React + Next.js + Postgres..."
      },
      {
        name: "Why is \"it works on my machine\" a red flag in team development, and what concrete habits or setup choices do you use to ensure your code works on everyone else's environment too?",
        type: "generic",
        placeholder: "Lockfiles, Docker, env docs, CI..."
      },
      {
        name: "Describe a website or web app you have built — stack, challenges, and outcome.",
        type: "long-text",
        placeholder: "What you built, hurdles, result + link..."
      },
      {
        name: "How do you make a site fast and responsive across devices?",
        type: "long-text",
        placeholder: "Layout, images, caching, lighthouse..."
      },
      {
        name: "Share your GitHub or portfolio link.",
        type: "short-text",
        placeholder: "https://github.com/..."
      }
    ],
  },
];

// Allowed email domains (VIT student/staff) — enforced at signup + application
export const ALLOWED_EMAIL_DOMAINS = ["vitstudent.ac.in", "vit.ac.in"];

export const isAllowedEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const domain = email.trim().toLowerCase().split("@")[1] || "";
  return ALLOWED_EMAIL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
};

// Application status pipeline
export const APPLICATION_STATUSES = [
  { value: "applied", label: "Applied", color: "#64748b" },
  { value: "under_review", label: "Under Review", color: "#d97706" },
  { value: "interview", label: "Interview", color: "#2563eb" },
  { value: "accepted", label: "Accepted", color: "#16a34a" },
  { value: "rejected", label: "Rejected", color: "#dc2626" },
];

export const STATUS_VALUES = APPLICATION_STATUSES.map((s) => s.value);
export const DECIDED_STATUSES = ["accepted", "rejected"];
export const SHORTLISTED_STATUSES = ["interview", "accepted"];

// Status-change email templates (#name and #dept are replaced per recipient)
export const statusEmailTemplates = {
  under_review: {
    subject: "Your GDG VITC application is under review",
    body: "<p>Hi #name,</p><p>Good news — your application for the <strong>#dept</strong> department is now <strong>under review</strong> by our leads. We will update you as soon as a decision is made.</p><p>You can follow your progress anytime under <strong>My Applications</strong> on the portal.</p>",
  },
  interview: {
    subject: "Interview invite — GDG VITC (#dept)",
    body: "<p>Hi #name,</p><p>Congratulations — you have been shortlisted for an <strong>interview</strong> for the <strong>#dept</strong> department!</p><p>Our leads will reach out shortly with your slot and venue details. Keep an eye on your inbox (and spam folder).</p>",
  },
  accepted: {
    subject: "Welcome to GDG VITC — #dept!",
    body: "<p>Hi #name,</p><p>We are thrilled to tell you that you have been <strong>selected</strong> for the <strong>#dept</strong> department. Welcome aboard!</p><p>Watch your inbox for onboarding steps and the orientation schedule.</p>",
  },
  rejected: {
    subject: "Update on your GDG VITC application",
    body: "<p>Hi #name,</p><p>Thank you for applying to the <strong>#dept</strong> department. We received many strong applications and could not move forward with yours this time.</p><p>We appreciate the effort — please apply again next cycle. Keep building!</p>",
  },
};

// Sample Admin Data
export const sampleAdminHeader = [
  {
    Header: "SrNo",
    accessor: "srno",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Department",
    accessor: "department",
  },
];

// Headers for CSV exports
export const CSV_Header = [
  {
    label: "Name",
    key: "Name",
  },
  {
    label: "Email",
    key: "Email",
  },
  {
    label: "Registration Number",
    key: "RegistrationNumber",
  },
  {
    label: "Phone",
    key: "Phone",
  },
  {
    label: "Department",
    key: "Department",
  },

  {
    label: "Preference",
    key: "Pref",
  },
  {
    label: "Shortlisted",
    key: "shortlisted",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Note",
    key: "statusNote",
  },
  {
    label: "Questions",
    key: "Questions",
  },
];

// Mailing Templates
export const mailingTemplate = {
  Interview:
    "<p>Edit content</p><br><p>Thank you for applying to GDG VITC. We are excited to let you know that you have been shortlisted for joining the #dept Department!</p><p>We look forward to your active participation!</p>",
};

export const technicalCards = [
  {
    title: "Blockchain",
    description:
      "Decentralised apps, smart contracts, and Web3 tooling.",
    color: "#FF7A6B",
    image: "/assets/images/icons/blockchain.svg",
    formLink: "/join/6a89c4e2-7b19-4f32-821e-9821a41b5201",
  },
  {
    title: "Cloud &\nDevOps",
    description:
      "Backends, infrastructure, and everything that keeps apps online.",
    color: "#FBBC04",
    image: "/assets/images/icons/cloud.svg",
    formLink: "/join/a1d920df-9eb9-49eb-b3a4-e4a3d1245ede", // Cloud & DevOps ID
  },
  {
    title: "Game Dev",
    description:
      "Playable worlds built with Unity, Godot, and web tech.",
    color: "#4285F4",
    image: "/assets/images/icons/game-dev.svg",
    formLink: "/join/9055864f-c7dc-44cd-91d5-8759d32a496a",
  },
  {
    title: "App Dev",
    description:
      "Native and cross-platform mobile apps with Kotlin and Flutter.",
    color: "#EA4335",
    image: "/assets/images/icons/app-dev.svg",
    formLink: "/join/339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
  },
  {
    title: "UI/UX",
    description:
      "User research, wireframes, and interfaces that feel effortless.",
    color: "#0F9D58",
    image: "/assets/images/icons/ui-ux.svg",
    formLink: "/join/e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
  },
  {
    title: "Data\nScience",
    description:
      "Machine learning and analytics that turn raw data into insight.",
    color: "#EA4335",
    image: "/assets/images/icons/data-science.svg",
    formLink: "/join/c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
  },
  {
    title: "Competitive Programming",
    description:
      "Algorithms, contests, and interview-ready problem solving.",
    color: "#0F9D58",
    image: "/assets/images/icons/cp.svg",
    formLink: "/join/3e9ac635-01d4-495e-aa87-a7335a2403c2",
  },
  {
    title: "Web Dev",
    description:
      "Responsive sites and full-stack apps for the open web.",
    color: "#FBBC04",
    image: "/assets/images/icons/web-dev.svg",
    formLink: "/join/8143de1d-db17-42fa-958d-13b10804f894",
  },
];

export const nonTechnicalCards = [
  {
    title: "Creatives",
    description:
      "Posters, branding, and the visual voice of GDG VITC.",
    color: "#329A4E",
    image: "/assets/images/icons/design.svg",
    formLink: "/join/d3beefc1-f8b0-4202-b26c-36e9804b6636",
  },
  {
    title: "Outreach",
    description:
      "The bridge to sponsors, partners, and fellow communities.",
    color: "#4285F4",
    image: "/assets/images/icons/outreach.svg",
    formLink: "/join/3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
  },
  {
    title: "Publicity",
    description:
      "The team behind the feed — videos, posts, and campaigns.",
    color: "#EA4335",
    image: "/assets/images/icons/social-media.svg",
    formLink: "/join/4499a966-2740-4c36-88dd-8916a909fc77",
  },
  {
    title: "Management",
    description:
      "The crew that plans, coordinates, and keeps every event running.",
    color: "#FBBC04",
    image: "/assets/images/icons/management.svg",
    formLink: "/join/c21ca066-ab4d-40a3-943c-f170d6312bdc",
  },
];
