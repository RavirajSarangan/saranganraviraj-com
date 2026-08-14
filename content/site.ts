/**
 * SINGLE SOURCE OF TRUTH
 * ----------------------
 * Every string, project, link and number on this site lives here.
 * Edit this file — you should never need to open a component to change copy.
 *
 * Sections driven by an empty array render nothing at all.
 */

/** A hero headline word. `accent` sets it in the display serif italic, in gold. */
export type HeadlineWord = { text: string; accent?: boolean };

export const site = {
  url: "https://www.saranganraviraj.com",
  name: "Sarangan Raviraj",
  shortName: "Sarangan",
  role: "Software Engineer & Designer",
  /** Headline positioning. The business is international; the desk happens to be in Jaffna. */
  reach: "Working worldwide",
  location: "Jaffna, Sri Lanka",
  timezone: "UTC+5:30",
  email: "venomstudio29@gmail.com",

  /** Shown as the status pill in the hero. Set `open: false` to read "Booked through …". */
  availability: {
    open: true,
    window: "December", // TODO: confirm — carried over from the previous site
  },

  tagline:
    "Designing and building digital products for clients in Sri Lanka, the US and remote teams since 2019.",

  /** Hero headline. Rendered word-by-word; `accent: true` sets a word in the display serif italic. */
  headline: [
    { text: "Software" },
    { text: "engineer" },
    { text: "who" },
    { text: "designs", accent: true },
    { text: "the" },
    { text: "whole" },
    { text: "thing." },
  ] as HeadlineWord[],

  heroSub:
    "I build websites and products end to end — the interface, the system underneath it, and the reasoning that connects the two. Six years of practice, nine roles, remote-first, wherever you are.",
} as const;

/* ------------------------------------------------------------------ */
/* Links                                                               */
/* ------------------------------------------------------------------ */

/**
 * The CV cites "20+ UI case studies on Behance" but gives no URL, so the callout
 * on /work stays hidden until one is set rather than shipping a guessed link.
 */
export const behance = {
  url: "", // TODO: add the Behance profile URL
  label: "20+ UI case studies on Behance",
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/RavirajSarangan" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sarangan-raviraj/" },
  { label: "Email", href: `mailto:${site.email}` },
] as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Résumé", href: "/resume" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
] as const;

/* ------------------------------------------------------------------ */
/* Facts — verifiable only. No invented metrics.                       */
/* ------------------------------------------------------------------ */

export const facts = [
  { value: "50+", label: "Projects delivered" },
  { value: "30+", label: "Clients served" },
  { value: "06+", label: "Years designing" },
  { value: "OPEN", label: "Taking work" },
] as const;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  index: string;
  title: string;
  sector: string;
  client: string;
  year: string;
  status: "Live" | "In progress" | "Shipped" | "Research";
  summary: string;
  /** Case study body. Sections with empty strings are skipped. */
  overview: string;
  role: string[];
  approach: string;
  outcome: string;
  stack: string[];
  liveUrl?: string;
  /** Two hex colors driving the generated cover plate. */
  duotone: [string, string];
  /** Drop a screenshot at /public/work/<slug>.webp and it replaces the plate automatically. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "degitalkeyz",
    index: "01",
    title: "Degitalkeyz",
    sector: "Commerce",
    client: "Venom X Technology",
    year: "2024",
    status: "Live",
    summary:
      "A digital storefront for software licences and subscriptions, built around instant activation and round-the-clock support.",
    overview:
      "Degitalkeyz sells premium digital products — tools, licences and subscriptions — where the entire value proposition is speed. A customer expects the key in their inbox seconds after paying, not hours. The storefront had to make that promise visible before checkout and keep it after.",
    role: ["Product design", "Front-end build", "Storefront architecture"],
    approach:
      "I led with the delivery guarantee rather than the catalogue: instant activation and 24/7 support sit above the fold, because for this category trust closes the sale, not selection. Product pages were kept to a single decision per screen, and the support channel stays reachable from every step of checkout.",
    outcome:
      "A storefront that reads as a legitimate vendor rather than a reseller page — the difference that lets an unfamiliar buyer complete a first purchase.",
    stack: ["Web", "E-commerce", "UI/UX"],
    duotone: ["#1d3b57", "#0a0a0b"],
  },
  {
    slug: "brasserie-esta",
    index: "02",
    title: "Brasserie Esta",
    sector: "Hospitality",
    client: "Swize",
    year: "2024",
    status: "Live",
    summary:
      "A restaurant site built for the two things diners actually arrive to do: see the room, and book a table.",
    overview:
      "Restaurant websites tend to bury the two actions that matter under a carousel and a mission statement. Brasserie Esta needed the opposite — atmosphere communicated immediately through imagery, and a booking path short enough to survive a phone screen on the walk over.",
    role: ["Web design", "Front-end build"],
    approach:
      "Photography leads and typography stays out of its way. The menu is readable without a download, and booking is reachable from any scroll position. Everything was designed mobile-first, since that is where restaurant traffic actually lives.",
    outcome:
      "A site that answers 'what is this place like' in under three seconds and gets out of the way of the reservation.",
    stack: ["Web", "UI/UX"],
    liveUrl: "https://brasserie-esta.com",
    duotone: ["#4a1f1f", "#0a0a0b"],
  },
  {
    slug: "it-hub-esoft",
    index: "03",
    title: "IT Hub ESOFT",
    sector: "Education",
    client: "ESOFT Metro Campus, Jaffna",
    year: "2024",
    status: "Live",
    summary:
      "A site for ESOFT Jaffna's IT Hub — workshops, events and student work, given a visual identity strong enough to recruit.",
    overview:
      "IT Hub runs workshops and events for students at ESOFT Jaffna. The problem was not information architecture — it was energy. A campus tech community competes for attention against everything else a student could be doing, and a neutral institutional page loses that fight.",
    role: ["Visual identity", "Web design", "Front-end build"],
    approach:
      "I built the site around evidence: past events, student achievements and real photographs carry more weight than a description of what the club does. Motion was used to reward scrolling rather than decorate it, and the identity was pushed hard enough to be recognisable on a shared screenshot.",
    outcome:
      "A public face for the community that works as a recruitment tool, not just a noticeboard.",
    stack: ["Web", "Brand", "Motion"],
    duotone: ["#4a3a1a", "#0a0a0b"],
  },
  {
    slug: "paperpress",
    index: "04",
    title: "PaperPress",
    sector: "Tooling",
    client: "Venom X Technology",
    year: "2026",
    status: "Live",
    summary:
      "A browser-based PDF toolkit with 13 tools, built so that files never leave the machine they are on.",
    overview:
      "Most free PDF tools work by uploading your document to someone else's server. For anything with a contract, an invoice or an ID in it, that is the whole problem. PaperPress does the entire job client-side — the file is read, processed and written back without ever being transmitted.",
    approach:
      "Thirteen tools were built as a single client-side application, then wrapped in a multi-page static site so each tool has its own indexable URL rather than hiding behind a JavaScript router. The site carries full SEO and AEO structure, because a utility nobody can find is a utility nobody uses.",
    outcome:
      "A privacy guarantee that is structural rather than a policy sentence: there is no upload step to trust.",
    role: ["Product design", "Front-end build", "SEO/AEO"],
    stack: ["Web", "Client-side processing", "SEO/AEO"],
    liveUrl: "https://paper-press-three.vercel.app",
    duotone: ["#24303d", "#0a0a0b"],
  },
  {
    slug: "mindmap-ai",
    index: "05",
    title: "MindMap AI",
    sector: "Product",
    client: "MindMap AI",
    year: "2025 – 2026",
    status: "Live",
    summary:
      "UI/UX redesign of an AI mind-mapping application — the canvas workspace, the landing page, and an animated in-app manual.",
    overview:
      "MindMap AI turns prompts into structured mind maps. The canvas is where the entire product lives, so it carries a disproportionate share of whether the tool feels capable or fiddly — and a new user has to understand it before they have any reason to trust it.",
    approach:
      "I led the redesign across three surfaces that each do a different job: the canvas workspace for people already working, the landing page hero for people deciding, and an animated in-app user manual for the gap between the two. Treating onboarding as a designed surface rather than a tooltip was the substantive change.",
    outcome: "",
    role: ["UI/UX design", "Product redesign", "Prototyping"],
    stack: ["Product design", "UI/UX", "Prototyping"],
    liveUrl: "https://mindmapai.app",
    duotone: ["#2a2a5a", "#0a0a0b"],
  },
  {
    slug: "camshield",
    index: "06",
    title: "CamShield Remote Guard",
    sector: "Security",
    client: "Research project — EICON 2026",
    year: "2026",
    status: "Research",
    summary:
      "A multi-platform system that monitors and blocks unauthorised webcam access in real time, built as the countermeasure half of a security research study.",
    overview:
      "Remote desktop software can be exploited to reach a machine's camera without the owner knowing. CamShield Remote Guard (CRG) was designed as the defensive component of a research study into that exploitation — not a paper describing a mitigation, but a working one across desktop, web and mobile.",
    approach:
      "The system watches for camera access at the endpoint and intervenes in real time rather than reporting after the fact. It was developed alongside the offensive research it answers, so the countermeasure was tested against the exact technique it exists to stop.",
    outcome:
      "Submitted to EICON 2026 as the countermeasure component of the study.",
    role: ["Systems design", "Security research", "Multi-platform UX"],
    stack: ["Security", "Desktop", "Web", "Mobile"],
    duotone: ["#1d4038", "#0a0a0b"],
  },
  {
    slug: "presenceiq",
    index: "07",
    title: "PresenceIQ",
    sector: "AI",
    client: "CURSOR Colombo 24H Buildathon",
    year: "2025",
    status: "Shipped",
    summary:
      "An AI avatar platform with a visitor-intelligence pipeline that runs before the conversation starts — built end to end in 24 hours.",
    overview:
      "Most AI avatar demos begin cold: the visitor arrives and the agent knows nothing. PresenceIQ puts an intelligence pipeline in front of the conversation, so the avatar has context about who it is talking to before the first exchange rather than spending it on discovery.",
    approach:
      "Built inside a 24-hour buildathon, which set the architecture: managed services wired together rather than anything bespoke. Convex for data and reactivity, n8n for the pipeline, GPT-4o for reasoning, ElevenLabs for voice and BeyondPresence for the avatar itself.",
    outcome: "",
    role: ["Product design", "Service integration", "Rapid prototyping"],
    stack: ["Convex", "n8n", "OpenAI GPT-4o", "ElevenLabs", "BeyondPresence"],
    duotone: ["#3d2b5f", "#0a0a0b"],
  },
  {
    slug: "aix-lens",
    index: "08",
    title: "AIX Lens",
    sector: "AI",
    client: "Self-initiated",
    year: "2026",
    status: "Shipped",
    summary:
      "A Chrome extension that uses machine learning to detect and flag potential misinformation on a page as you read it.",
    overview:
      "Misinformation is a reading-time problem, not a research-time one — by the time someone goes looking for a fact check they have already believed or dismissed the claim. AIX Lens moves the check to the moment of reading, inside the page.",
    approach:
      "Built as a browser extension so it works on any site rather than requiring a destination. Detection runs against page content in real time and surfaces flags in place, keeping the judgement visible to the reader instead of silently filtering what they see.",
    outcome: "",
    role: ["Product design", "Extension development"],
    stack: ["Chrome Extension", "AI/ML", "JavaScript"],
    duotone: ["#3d2b5f", "#0a0a0b"],
  },
  {
    slug: "dev-portfolio",
    index: "09",
    title: "Dev-Portfolio",
    sector: "Tooling",
    client: "Venom X Technology",
    year: "2026",
    status: "Live",
    summary:
      "A portfolio site with a fully dynamic admin dashboard, so every piece of content is editable without touching code.",
    overview:
      "A portfolio that needs a developer to change a sentence stops being updated. This one was built the other way around: the site is a shell and the content lives in a database, managed through an admin dashboard behind real authentication.",
    approach:
      "Supabase provides the backend, database and secure authentication; the admin dashboard covers every section of the public site so there is no content that requires a deploy to change. Deployed on GitHub Pages.",
    outcome:
      "The owner maintains their own site — the practical test of whether a CMS was worth building.",
    role: ["Front-end build", "Backend & auth", "Admin dashboard"],
    stack: ["Supabase", "Auth", "Admin dashboard", "GitHub Pages"],
    liveUrl: "https://github.com/RavirajSarangan/Dev-Portfolio",
    duotone: ["#24303d", "#0a0a0b"],
  },
  {
    slug: "flashtech",
    index: "10",
    title: "FlashTech",
    sector: "Web app",
    client: "Team project",
    year: "2026",
    status: "Shipped",
    summary:
      "A collaborative web application, contributed to through a full team Git workflow — feature branches, pull requests, code review and CI.",
    overview:
      "FlashTech was built by a team rather than an individual, which made the process as much the point as the product. My contribution centred on authentication and the login and registration flow.",
    approach:
      "Integrated Clerk for authentication and reworked the login/registration path around it. Everything went through feature branches, pull requests, code review and CI checks — the discipline that makes a multi-person codebase survivable.",
    outcome: "",
    role: ["Authentication", "Front-end contribution", "Code review"],
    stack: ["Clerk", "Web", "Git workflow", "CI"],
    liveUrl: "https://github.com/arthikandev/FlashTech",
    duotone: ["#14424a", "#0a0a0b"],
  },
  {
    slug: "foodi",
    index: "11",
    title: "Foodi",
    sector: "Mobile",
    client: "Self-initiated",
    year: "2025",
    status: "In progress",
    summary:
      "A food delivery app with a deliberately bold visual language — restaurants and dishes presented like a magazine, not a spreadsheet.",
    overview:
      "Most delivery apps converge on the same dense list of thumbnails. Foodi is an argument that the category has room for art direction: bigger imagery, stronger type, and a browsing experience that makes choosing dinner feel good rather than efficient.",
    role: ["Product design", "UI/UX", "Prototyping"],
    approach:
      "I am designing the ordering flow to stay short while giving each restaurant real visual space, and tuning transitions so movement between browse, dish and cart feels continuous rather than like page loads.",
    outcome:
      "Still in design — the ordering flow and its transitions are being prototyped. Nothing is released yet.",
    stack: ["Mobile", "UI/UX", "Prototyping"],
    duotone: ["#5a2a0f", "#0a0a0b"],
  },
  {
    slug: "matrimony",
    index: "12",
    title: "Matrimony Platform",
    sector: "Product",
    client: "Self-initiated",
    year: "2025",
    status: "In progress",
    summary:
      "A matchmaking platform built around values and compatibility, where privacy and verification are the product rather than settings.",
    overview:
      "Matrimony is a category where trust is the entire product. Families are involved, the stakes are long-term, and the failure mode is not a bad match — it is a fake profile. The platform is being built so that verification and privacy are structural, not a toggle in a preferences screen.",
    role: ["Product design", "UI/UX", "Systems design"],
    approach:
      "Matching is modelled on values and long-term compatibility rather than engagement metrics. Every profile field is designed with a visibility decision attached to it, so users control disclosure at the point they enter information instead of hunting for it later.",
    outcome:
      "Still in design. The verification and privacy model is being settled first, since it is what the platform's credibility rests on. Nothing is released yet.",
    stack: ["Web", "Product", "UI/UX"],
    duotone: ["#2a2a5a", "#0a0a0b"],
  },
];

/** The home page shows a curated six; /work carries the full archive. */
export const featuredProjects = projects.slice(0, 6);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const services = [
  {
    index: "01",
    title: "Website Design & Build",
    body: "Marketing sites, storefronts and landing pages designed and built end to end — from the visual identity through to the deployed, responsive, fast-loading result.",
    tags: [
      "Visual identity",
      "Landing pages",
      "Multi-page sites",
      "Responsive build",
    ],
  },
  {
    index: "02",
    title: "UI/UX Design",
    body: "Wireframes through high-fidelity interfaces for web and mobile. Design systems that stay consistent as a product grows, grounded in how people actually use the thing.",
    tags: ["Web & mobile UI", "Prototyping", "Design systems", "User flows"],
  },
  {
    index: "03",
    title: "No-code & Framer",
    body: "High-performing sites built in Framer — responsive, animated, and editable by you without touching code. Fast to launch, straightforward to maintain.",
    tags: ["Framer builds", "Site migration", "CMS setup", "Handover"],
  },
  {
    index: "04",
    title: "Engineering & Research",
    body: "C# application development, chatbot implementation, SEO research and data analysis — the technical work that sits behind the interface.",
    tags: ["C# development", "Chatbots", "SEO research", "Data analysis"],
  },
] as const;

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

export const process = [
  {
    step: "01",
    title: "Book a call",
    body: "We talk through the project, the goals behind it, and whether I am the right person for it. No pitch deck.",
  },
  {
    step: "02",
    title: "Scope & agree",
    body: "You get a written scope with deliverables, timeline and cost. Nothing starts before both of us agree on what done looks like.",
  },
  {
    step: "03",
    title: "Design & build",
    body: "We work closely — regular updates, shared files, and feedback at each milestone rather than one reveal at the end.",
  },
  {
    step: "04",
    title: "Deliver",
    body: "Final files and a live deployment, handed over polished and documented enough that you can run it without me.",
  },
  {
    step: "05",
    title: "Support",
    body: "One month of post-launch support included, for tweaks, questions and anything that surfaces once real users arrive.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */
/**
 * INTENTIONALLY EMPTY.
 *
 * The quotes on the previous site came from a purchased template and credited
 * a person named "Daniel" — they were never real client feedback. Rather than
 * carry fiction onto a new site, this ships empty and the section does not render.
 *
 * Add real entries here and the section appears automatically:
 *   { quote: "…", author: "Name", title: "Role, Company" }
 */
export type Testimonial = {
  id: string;
  quote: string;
  /** Person's name. */
  author: string;
  /** Role and company, e.g. "Founder, Swize". */
  title: string;
  /** Optional headshot at /public/testimonials/<id>.webp. Falls back to an initials plate. */
  image?: string;
};

export const testimonials: Testimonial[] = [];

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const about = {
  lede: "I design and build websites that feel considered rather than assembled.",
  body: [
    "I am a technology generalist by choice. Six years of freelance practice and nine roles have moved me between UI/UX design, front-end development, WordPress, SEO and video — and the range is the point. Knowing how the interface, the system and the data actually meet means I can design something that survives being built.",
    "In practice that means I can take a project from a conversation to a deployed site without handing it across three people. Figma and Framer get a business online in days rather than months. HTML, CSS and JavaScript handle the work that needs to be built properly. SEO makes sure the result is actually found, and running Venom X Technology means I own the outcome rather than a slice of it.",
    "I work remote-first — the desk is in Jaffna, the work has never been limited to it, and it has included a US-based product team. If you want a partner who listens first and builds with intent, that is the work I am interested in.",
  ],
  /** Drop a photo at /public/portrait.webp and it replaces the placeholder frame. */
  portrait: undefined as string | undefined, // TODO: add a portrait
} as const;

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  heading: "Ready to build something with intent?",
  body: "Tell me what you are working on and what you need it to do. I reply to everything.",
} as const;

/* ------------------------------------------------------------------ */
/* Résumé — every entry below is transcribed from the CV.              */
/* Nothing here is inferred. If a fact is not on the CV, it is absent. */
/* ------------------------------------------------------------------ */

export type Role = {
  title: string;
  org: string;
  location: string;
  /** Display period. `end: null` renders as "Present" so ongoing roles never go stale. */
  start: string;
  end: string | null;
  bullets: string[];
};

export const experience: Role[] = [
  {
    title: "Founder & CEO",
    org: "Venom X Technology",
    location: "Jaffna, Sri Lanka",
    start: "Feb 2024",
    end: null,
    bullets: [
      "Founded and lead a digital solutions brand delivering UI/UX design, web development and branded media for local and international clients.",
      "Designed and shipped client projects across e-commerce, restaurant and community websites, plus product tools such as PaperPress, a browser-based PDF converter with 13 tools.",
      "Manage the full client lifecycle: requirements gathering, proposals, design, delivery and post-launch support.",
    ],
  },
  {
    title: "UI/UX Designer Intern",
    org: "3axislabs",
    location: "Jaffna, Sri Lanka",
    start: "Feb 2026",
    end: "Jun 2026",
    bullets: [
      "Produced wireframes, high-fidelity mockups and interactive prototypes for client-facing web products in an agile team.",
    ],
  },
  {
    title: "UI/UX Designer Intern",
    org: "MindMap AI",
    location: "Jaffna, Sri Lanka",
    start: "Feb 2026",
    end: "Jun 2026",
    bullets: [
      "Redesigned core product surfaces including the mind-map canvas, landing page hero sections and the in-app user manual for an AI-powered mind-mapping web application.",
    ],
  },
  {
    title: "UI/UX Designer Intern",
    org: "Zyner",
    location: "United States (Remote)",
    start: "Jan 2025",
    end: "Jun 2025",
    bullets: [
      "Collaborated remotely with a US-based team on user interface design, contributing screens, components and prototypes across web and mobile projects.",
    ],
  },
  {
    title: "WordPress Developer & Video Editor",
    org: "Lankajob",
    location: "Jaffna, Sri Lanka",
    start: "Jan 2024",
    end: null,
    bullets: [
      "Build and maintain WordPress sites — theme customisation, plugin configuration, performance and on-page SEO.",
      "Edit promotional and social video in Adobe Premiere Pro for the company's digital marketing campaigns.",
    ],
  },
  {
    title: "Co-Founder",
    org: "Degitalkeyz",
    location: "Sri Lanka",
    start: "Jan 2025",
    end: null,
    bullets: [
      "Co-founded an e-commerce platform for premium digital products with instant activation and 24/7 support; led product design and web presence.",
    ],
  },
  {
    title: "Search Engine Optimization Manager",
    org: "ICT Foundation",
    location: "Jaffna, Sri Lanka",
    start: "Mar 2024",
    end: null,
    bullets: [
      "Apply SEO keyword strategy to grow YouTube reach and audience engagement for the foundation's educational content.",
    ],
  },
  {
    title: "UI Designer (Freelance)",
    org: "Fiverr",
    location: "Remote",
    start: "Feb 2019",
    end: "Jan 2025",
    bullets: [
      "Delivered UI design projects for international clients over six years, building long-term relationships through repeat orders and referrals.",
    ],
  },
  {
    title: "UI/UX Designer",
    org: "Bizanomics (The Gift Concept)",
    location: "Sri Lanka",
    start: "Jan 2023",
    end: "Jul 2024",
    bullets: [
      "Designed wireframes, prototypes and interactive UI for digital products and client campaigns.",
    ],
  },
];

export const leadership: Role[] = [
  {
    title: "Sri Lanka Ambassador",
    org: "Newly",
    location: "Sri Lanka",
    start: "Mar 2026",
    end: null,
    bullets: [
      "Represent Newly in Sri Lanka, building an AI and technology community through social campaigns, workshops and hackathon support.",
    ],
  },
  {
    title: "Lead Organizer",
    org: "ESU Jaffna Buildathon 2026",
    location: "Jaffna, Sri Lanka",
    start: "2026",
    end: "2026",
    bullets: [
      "Organising a two-day hackathon for around 100 students across AI, software, cloud, cybersecurity and web/mobile tracks; led sponsorship proposals and partner outreach.",
    ],
  },
  {
    title: "Student Council President",
    org: "ESOFT Metro Campus — Jaffna",
    location: "Two consecutive terms",
    start: "Feb 2023",
    end: "Mar 2025",
    bullets: [
      "Elected President for consecutive academic years; led student events, represented the student body and coordinated with campus administration.",
    ],
  },
  {
    title: "Social Media Designer",
    org: "Pathfinder Club, ESOFT Metro Campus",
    location: "Jaffna, Sri Lanka",
    start: "Jan 2024",
    end: null,
    bullets: [
      "Design thumbnails, posters and social creatives for club events and campaigns.",
    ],
  },
];

export type Credential = {
  qualification: string;
  institution: string;
  period: string;
  note?: string;
};

export const education: Credential[] = [
  {
    qualification: "BSc (Hons) Computer Software Engineering",
    institution: "London Metropolitan University",
    period: "2025 – 2026",
  },
  {
    qualification: "BTEC HND in Computing (Software Engineering)",
    institution: "ESOFT Metro Campus — Jaffna",
    period: "2023 – 2025",
    note: "Higher Achiever Award for academic excellence",
  },
  {
    qualification: "Diploma in Information Technology",
    institution: "ESOFT Metro Campus / ESU Sri Lanka",
    period: "2023",
  },
  {
    qualification: "Diploma in Cyber Security",
    institution: "ATN Campus, Colombo",
    period: "2022 – 2024",
  },
  {
    qualification: "G.C.E. Ordinary Level",
    institution: "J/Chavakachcheri Hindu College",
    period: "2020 / 2021",
  },
];

export type SkillGroup = { label: string; items: string[] };

/** Capability areas — what the work involves. */
export const skills: SkillGroup[] = [
  {
    label: "UI/UX",
    items: [
      "UX Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
      "Responsive Web Design",
      "Mobile App Design",
      "Visual Identity",
    ],
  },
  {
    label: "Digital Marketing",
    items: [
      "Search Engine Optimization",
      "Social Media Marketing",
      "Video Editing",
      "Content Creation",
    ],
  },
  {
    label: "Working with people",
    items: [
      "Leadership",
      "Teamwork",
      "Creativity",
      "Problem Solving",
      "Risk Management",
      "Client Communication",
    ],
  },
  {
    label: "Languages",
    items: ["Tamil — Native", "English — Professional working proficiency"],
  },
];

/** Concrete tools, split the way the work actually splits. */
export const stack: SkillGroup[] = [
  {
    label: "Design",
    items: [
      "Figma",
      "Adobe XD",
      "Adobe Photoshop",
      "Adobe Premiere Pro",
      "Framer",
      "Canva",
    ],
  },
  {
    label: "Development",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "Java",
      "WordPress",
      "Git & GitHub",
      "Supabase",
      "No-code (Framer)",
    ],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date?: string;
  /** Public verification link — the reason this section is worth having at all. */
  verifyUrl: string;
};

export const certifications: Certification[] = [
  {
    name: "Claude 101",
    issuer: "Anthropic Academy",
    date: "May 2026",
    verifyUrl: "https://verify.skilljar.com/c/niew5i7uq46o",
  },
  {
    name: "GitHub Foundations",
    issuer: "GitHub",
    verifyUrl:
      "https://www.credly.com/badges/dcfccb99-d343-40ed-a8b7-4847fe9d7894",
  },
  {
    name: "Applied ChatGPT for Cybersecurity",
    issuer: "Infosec — Coursera",
    date: "Jul 2024",
    verifyUrl:
      "https://coursera.org/account/accomplishments/verify/YP84YVPBRRLY",
  },
  {
    name: "Digital Marketing",
    issuer: "UniAthena",
    verifyUrl: "https://uniathena.com/verify/certificate?certID=1127-0416-3065",
  },
  {
    name: "Digital Marketing",
    issuer: "Coursera",
    verifyUrl:
      "https://coursera.org/account/accomplishments/verify/J9FQPK45JXLL",
  },
];

/** Downloadable CV. Kept in `public/` so it is a plain static asset. */
export const resume = {
  href: "/Sarangan-Raviraj-CV.pdf",
  lede: "Six years of practice, nine roles, five qualifications.",
  summary:
    "UI/UX Designer and Founder of Venom X Technology with six-plus years of freelance design experience and over a year of industry internships across Sri Lankan and US-based teams. Currently completing a BSc in Computer Software Engineering at London Metropolitan University, after a BTEC HND with a Higher Achiever Award.",
} as const;
