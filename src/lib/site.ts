export type Door = {
  number: number;
  label: string;
  href: string;
  items: string[];
  /** Offset from the ground centre in ground units (boundary rx 400, ry 210, viewBox 820×440). */
  x: number;
  y: number;
};

export type SocialId = "facebook" | "instagram" | "linkedin" | "youtube";

/**
 * Temporary holding messages while SSCFI prepares fresh lists. The saved lists stay in the admin;
 * set a flag to false to show them on the site again.
 */
export const holding = {
  /** Advisory Committee, Office Bearers, Committee Members and Core Members pages, and the committee boxes on the home page. */
  aboutPeople: true,
  /** State unit cards and counts on the Associations page (/teams). */
  stateUnits: true,
};

export const site = {
  name: "Super Seven Cricket Federation of India",
  shortName: "SSCFI",
  url: "https://sscfi.org",
  email: "coo@sscfi.org",
  /** The general address on the Contact page and in the footer (the rest of the site still uses `email`). */
  contactEmail: "contact@sscfi.org",
  foundedYear: 2003,
  foundedBy: "Mr. M. N. Abbasi",
  registration: "Registered society no. 521/2003-04, Societies Registration Act 1860",
  /** Registered office as published on the 2014 site; to be confirmed by SSCFI. */
  address: "T-II-9, Staff Colony, Judges Court Compound, Near Natraj Hotel, Bulandshahr, Uttar Pradesh 203001",
  social: [
    {
      id: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61595635310951",
    },
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/super7indiancricketteam/" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/super-seven-cricket-federation-of-india/" },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCyNNnTrBD7oGIBA94QYCkiQ",
    },
  ] as { id: SocialId; label: string; href: string }[],
};

/** Seven players, seven doors. Positions sit just inside the dashed 30-yard circle. */
export const doors: Door[] = [
  {
    number: 1,
    label: "Associations",
    href: "/teams",
    items: ["State associations", "District associations", "Officials (umpires, coaches)"],
    x: 0,
    y: -150,
  },
  {
    number: 2,
    label: "Fixtures & Results",
    href: "/fixtures",
    items: ["By tournament and city", "Scores", "League tables"],
    x: 252,
    y: -93,
  },
  {
    number: 3,
    label: "Rules",
    href: "/rules",
    items: ["Rule book in 16 Indian languages", "Glossary"],
    x: 314,
    y: 37,
  },
  {
    number: 4,
    label: "New Registration",
    href: "/register",
    items: ["Player", "Team or club", "District Association"],
    x: 140,
    y: 140,
  },
  {
    number: 5,
    label: "Careers",
    href: "/careers",
    items: ["Umpires", "Scorers", "Coaches", "Coordinators"],
    x: -140,
    y: 140,
  },
  {
    number: 6,
    label: "Locations",
    href: "/locations",
    items: ["Map: India › State › District › Locality"],
    x: -314,
    y: 37,
  },
  {
    number: 7,
    label: "Contact",
    href: "/contact",
    items: ["Leadership", "Enquiry form", "Corporate bookings"],
    x: -252,
    y: -93,
  },
];

export const contentAreas = {
  gallery: {
    label: "Photo Gallery",
    href: "/gallery",
    description: "Pictures and media: matches, events, corporate days, videos.",
  },
  news: {
    label: "News & Updates",
    href: "/news",
    description: "News, newsletters and announcements.",
  },
};

export const aboutLinks = [
  { label: "Our story", href: "/about" },
  { label: "Advisory Committee", href: "/about/advisory-committee" },
  { label: "Office Bearers", href: "/about/office-bearers" },
  { label: "Committee Members", href: "/about/committee" },
  { label: "Core Members", href: "/about/core-members" },
];

export const footerColumns = [
  {
    title: "About",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Advisory Committee", href: "/about/advisory-committee" },
      { label: "Office Bearers", href: "/about/office-bearers" },
    ],
  },
  {
    title: "Quick links",
    links: [
      { label: "Associations", href: "/teams" },
      { label: "Fixtures & Results", href: "/fixtures" },
      { label: "Rules", href: "/rules" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "Constitution", href: "/governance/constitution" },
      { label: "Documents", href: "/governance/documents" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

/**
 * Main menu. Every tab of the 2014 site is here under its new name
 * (Fixture + Results → Fixtures & Results, Media + Pictures → Media, News Letters → News).
 */
export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Associations",
    href: "/teams",
    children: [
      { label: "State Associations", href: "/teams#state", description: "Recognized state associations and their office‑bearers" },
      { label: "District Associations", href: "/teams#district", description: "District-level affiliated associations" },
      { label: "Officials", href: "/teams#officials", description: "Umpires, scorers and coaches" },
      { label: "Player Directory", href: "/players", description: "Registered players by state and ID" },
    ],
  },
  {
    label: "Fixtures & Results",
    href: "/fixtures",
    children: [
      { label: "Upcoming fixtures", href: "/fixtures#upcoming", description: "Next matches by tournament and city" },
      { label: "Results", href: "/fixtures#results", description: "Scores from every stage" },
      { label: "League tables", href: "/fixtures#tables", description: "Standings by group" },
    ],
  },
  {
    label: "Rules",
    href: "/rules",
    children: [
      { label: "Rule book (English)", href: "/rules#english", description: "How Super Seven cricket is played" },
      { label: "Rulebook in 17 languages", href: "/rules/rulebook", description: "English, हिन्दी, বাংলা, தமிழ் and thirteen more" },
      { label: "Glossary", href: "/rules#glossary", description: "Terms used on this site" },
    ],
  },
  {
    label: "Media",
    href: "/gallery",
    children: [
      { label: "Photo gallery", href: "/gallery#photos", description: "Matches, events and corporate days" },
      { label: "Press clippings", href: "/gallery#press", description: "Newspaper coverage since 2003" },
      { label: "Videos", href: "/gallery#videos", description: "Highlights on our YouTube channel" },
    ],
  },
  {
    label: "News",
    href: "/news",
    children: [
      { label: "News & updates", href: "/news", description: "Announcements from the federation" },
      { label: "Newsletter", href: "/news#newsletter", description: "Get fixtures and results by email" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our story", href: "/about", description: "Seven players, seven overs, since 2003" },
      { label: "Advisory Committee", href: "/about/advisory-committee" },
      { label: "Office Bearers", href: "/about/office-bearers" },
      { label: "Committee Members", href: "/about/committee" },
      { label: "Core Members", href: "/about/core-members" },
      { label: "Careers", href: "/careers", description: "Umpires, scorers, coaches, coordinators" },
      { label: "Governance & documents", href: "/governance/documents" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Enquiry form", href: "/contact#enquiry", description: "Write to the federation" },
      { label: "Leadership", href: "/contact#leadership", description: "President, Secretary and COO" },
      { label: "Corporate bookings", href: "/contact#corporate", description: "Fun Fridays and corporate days" },
      { label: "Find us on the map", href: "/locations", description: "India › State › District › Locality" },
    ],
  },
];

export const registerCta = { label: "Register", href: "/register" };
