export const nav = [
  { label: "Projects", to: "/projects" as const },
  { label: "Stories", to: "/stories" as const },
  { label: "About", to: "/about" as const },
  { label: "Volunteer", to: "/volunteer" as const },
  { label: "Contact", to: "/contact" as const },
];

export const social = {
  instagram: "https://instagram.com/", // [CLIENT INSTAGRAM URL REQUIRED]
  contactEmail: "[CONTACT EMAIL REQUIRED]",
  contactPhone: "[CONTACT NUMBER REQUIRED]",
  location: "[LOCATION REQUIRED]",
};

export type BodySection = { heading: string; paragraphs: string[] };

export type Project = {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  category: string;
  year: string;
  image: string;
  intro: string;
  body: BodySection[];
  facts: { label: string; value: string }[];
  gallery: string[];
};

const projectFacts = [
  { label: "Location", value: "[LOCATION REQUIRED]" },
  { label: "Partners", value: "[PARTNERS REQUIRED]" },
  { label: "Timeframe", value: "[TIMEFRAME REQUIRED]" },
  { label: "Outcome", value: "[OUTCOME FIGURE REQUIRED]" },
];

const projectBody: BodySection[] = [
  {
    heading: "The context",
    paragraphs: [
      "[CLIENT COPY REQUIRED — describe the community, the need, and how the project began.]",
      "[CLIENT COPY REQUIRED — second paragraph.]",
    ],
  },
  {
    heading: "What we did",
    paragraphs: ["[CLIENT COPY REQUIRED — the approach, the people involved, the making.]"],
  },
  {
    heading: "What changed",
    paragraphs: ["[CLIENT COPY REQUIRED — outcomes, reflections, what comes next.]"],
  },
];

export const projects: Project[] = [
  {
    id: "project-01",
    slug: "project-01",
    number: "01",
    title: "Project 01",
    description: "[PROJECT DESCRIPTION REQUIRED]",
    category: "[CATEGORY]",
    year: "[YEAR]",
    image: "/images/project-01.jpg",
    intro: "[PROJECT INTRO REQUIRED — one or two sentences.]",
    body: projectBody,
    facts: projectFacts,
    gallery: ["/images/project-02.jpg", "/images/project-03.jpg"],
  },
  {
    id: "project-02",
    slug: "project-02",
    number: "02",
    title: "Project 02",
    description: "[PROJECT DESCRIPTION REQUIRED]",
    category: "[CATEGORY]",
    year: "[YEAR]",
    image: "/images/project-02.jpg",
    intro: "[PROJECT INTRO REQUIRED — one or two sentences.]",
    body: projectBody,
    facts: projectFacts,
    gallery: ["/images/project-03.jpg", "/images/project-04.jpg"],
  },
  {
    id: "project-03",
    slug: "project-03",
    number: "03",
    title: "Project 03",
    description: "[PROJECT DESCRIPTION REQUIRED]",
    category: "[CATEGORY]",
    year: "[YEAR]",
    image: "/images/project-03.jpg",
    intro: "[PROJECT INTRO REQUIRED — one or two sentences.]",
    body: projectBody,
    facts: projectFacts,
    gallery: ["/images/project-04.jpg", "/images/project-01.jpg"],
  },
  {
    id: "project-04",
    slug: "project-04",
    number: "04",
    title: "Project 04",
    description: "[PROJECT DESCRIPTION REQUIRED]",
    category: "[CATEGORY]",
    year: "[YEAR]",
    image: "/images/project-04.jpg",
    intro: "[PROJECT INTRO REQUIRED — one or two sentences.]",
    body: projectBody,
    facts: projectFacts,
    gallery: ["/images/project-01.jpg", "/images/project-02.jpg"],
  },
];

export type Story = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  body: string[];
  quote: string;
};

const storyBody = [
  "[CLIENT COPY REQUIRED — opening paragraph of the story.]",
  "[CLIENT COPY REQUIRED — second paragraph.]",
  "[CLIENT COPY REQUIRED — third paragraph.]",
];

export const stories: Story[] = [
  {
    id: "story-01",
    slug: "story-01",
    category: "[CATEGORY]",
    title: "[STORY TITLE REQUIRED]",
    excerpt: "[STORY EXCERPT REQUIRED]",
    image: "/images/story-01.jpg",
    author: "[AUTHOR REQUIRED]",
    date: "[DATE REQUIRED]",
    body: storyBody,
    quote: "[PULL QUOTE REQUIRED]",
  },
  {
    id: "story-02",
    slug: "story-02",
    category: "[CATEGORY]",
    title: "[STORY TITLE REQUIRED]",
    excerpt: "[STORY EXCERPT REQUIRED]",
    image: "/images/story-02.jpg",
    author: "[AUTHOR REQUIRED]",
    date: "[DATE REQUIRED]",
    body: storyBody,
    quote: "[PULL QUOTE REQUIRED]",
  },
  {
    id: "story-03",
    slug: "story-03",
    category: "[CATEGORY]",
    title: "[STORY TITLE REQUIRED]",
    excerpt: "[STORY EXCERPT REQUIRED]",
    image: "/images/story-03.jpg",
    author: "[AUTHOR REQUIRED]",
    date: "[DATE REQUIRED]",
    body: storyBody,
    quote: "[PULL QUOTE REQUIRED]",
  },
];

export type ImpactFigure = { id: string; figure: string; description: string };

export const impactFigures: ImpactFigure[] = [
  { id: "impact-01", figure: "[NUMBER]", description: "[IMPACT DESCRIPTION]" },
  { id: "impact-02", figure: "[NUMBER]", description: "[IMPACT DESCRIPTION]" },
  { id: "impact-03", figure: "[NUMBER]", description: "[IMPACT DESCRIPTION]" },
];

export type Person = { id: string; name: string; role: string; image: string };

export const people: Person[] = [
  { id: "person-01", name: "[NAME]", role: "[ROLE]", image: "/images/person-01.jpg" },
  { id: "person-02", name: "[NAME]", role: "[ROLE]", image: "/images/person-02.jpg" },
  { id: "person-03", name: "[NAME]", role: "[ROLE]", image: "/images/person-03.jpg" },
];

export type Pathway = { id: string; title: string; line: string; detail: string };

export const pathways: Pathway[] = [
  {
    id: "support",
    title: "Support",
    line: "Help make the work possible.",
    detail: "[SUPPORT DETAIL COPY REQUIRED]",
  },
  {
    id: "partner",
    title: "Partner",
    line: "Build something meaningful together.",
    detail: "[PARTNER DETAIL COPY REQUIRED]",
  },
  {
    id: "join",
    title: "Join the Hive",
    line: "Get involved.",
    detail: "[JOIN DETAIL COPY REQUIRED]",
  },
];
