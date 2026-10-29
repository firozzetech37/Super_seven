import data from "@/data/rulebook.json";

/** The multilingual rulebook: 16 languages, 40 rules each, one PDF. Page numbers come from the PDF bookmarks; see docs/RULEBOOK.md. */
export const rulebookPdf = "/documents/sscfi-multilingual-rulebook.pdf";
export const rulebookPages = data.pages;
export const rulebookReviewRecordPage = data.reviewRecordPage;

export type Script =
  | "devanagari"
  | "bengali"
  | "gujarati"
  | "kannada"
  | "tamil"
  | "telugu"
  | "malayalam"
  | "odia"
  | "arabic"
  | "gurmukhi"
  | "latin";

export type RulebookRule = { n: number; title: string; page: number; inferred?: boolean };

export type RulebookLanguage = {
  n: number;
  slug: string;
  name: string;
  native: string;
  script: Script;
  dir: "ltr" | "rtl";
  /** BCP 47 tag for the lang attribute. */
  code: string;
  page: number;
  endPage: number;
  rules: RulebookRule[];
  /** Page preview rendered from the PDF, served from /documents/rulebook/. */
  thumb: string;
};

const scripts: Record<string, Script> = {
  sanskrit: "devanagari",
  hindi: "devanagari",
  marathi: "devanagari",
  nepali: "devanagari",
  bengali: "bengali",
  "manipuri-meiteilon": "bengali",
  gujarati: "gujarati",
  kannada: "kannada",
  tamil: "tamil",
  telugu: "telugu",
  malayalam: "malayalam",
  odia: "odia",
  urdu: "arabic",
  punjabi: "gurmukhi",
  mizo: "latin",
  khasi: "latin",
};

const codes: Record<string, string> = {
  sanskrit: "sa",
  hindi: "hi",
  bengali: "bn",
  marathi: "mr",
  gujarati: "gu",
  kannada: "kn",
  tamil: "ta",
  telugu: "te",
  malayalam: "ml",
  odia: "or",
  urdu: "ur",
  punjabi: "pa",
  nepali: "ne",
  mizo: "lus",
  khasi: "kha",
  "manipuri-meiteilon": "mni",
};

/** Tailwind class that sets the right font stack for a script (defined in globals.css). */
export const scriptClass: Record<Script, string> = {
  devanagari: "font-devanagari",
  bengali: "font-bengali",
  gujarati: "font-gujarati",
  kannada: "font-kannada",
  tamil: "font-tamil",
  telugu: "font-telugu",
  malayalam: "font-malayalam",
  odia: "font-odia",
  arabic: "font-urdu",
  gurmukhi: "font-gurmukhi",
  latin: "font-sans",
};

export const rulebookLanguages: RulebookLanguage[] = data.languages.map((l) => ({
  n: l.n,
  slug: l.slug,
  name: l.name,
  native: l.native,
  script: scripts[l.slug] ?? "latin",
  dir: l.slug === "urdu" ? "rtl" : "ltr",
  code: codes[l.slug] ?? "en",
  page: l.page,
  endPage: l.endPage,
  rules: l.rules,
  thumb: `/documents/rulebook/${l.slug}.webp`,
}));

export const rulebookCover = "/documents/rulebook/cover.webp";

export const rulebookLanguageBySlug = new Map(rulebookLanguages.map((l) => [l.slug, l]));

/** English titles of the 40 rules, in chapters, for the index. The PDF is translated from the English Pocket Rulebook. */
export const ruleChapters: { title: string; blurb: string; rules: { n: number; title: string }[] }[] = [
  {
    title: "Teams and officials",
    blurb: "Who takes the field and who runs the match.",
    rules: [
      { n: 1, title: "Teams" },
      { n: 2, title: "Substitute players" },
      { n: 3, title: "Runner" },
      { n: 4, title: "Fielder leaving the field" },
      { n: 5, title: "Umpires" },
      { n: 6, title: "Scorers" },
    ],
  },
  {
    title: "Equipment and ground",
    blurb: "Ball, bat, field, wicket and creases.",
    rules: [
      { n: 7, title: "The ball" },
      { n: 8, title: "The bat" },
      { n: 9, title: "Field and pitch" },
      { n: 10, title: "The wicket" },
      { n: 11, title: "Creases" },
      { n: 12, title: "Rolling, sweeping and re-marking" },
      { n: 14, title: "Covering the pitch" },
    ],
  },
  {
    title: "Play and scoring",
    blurb: "Innings, overs, runs and the result.",
    rules: [
      { n: 13, title: "Innings" },
      { n: 15, title: "Start of play" },
      { n: 16, title: "Scoring runs" },
      { n: 17, title: "Boundary" },
      { n: 18, title: "Result" },
      { n: 19, title: "Over" },
      { n: 20, title: "Dead ball" },
      { n: 21, title: "No ball" },
      { n: 22, title: "Wide ball" },
      { n: 23, title: "Bye and leg-bye" },
    ],
  },
  {
    title: "Dismissals",
    blurb: "The eleven ways a batter is out, and the appeal.",
    rules: [
      { n: 24, title: "Appeals" },
      { n: 25, title: "Wicket down" },
      { n: 26, title: "Batter out of ground" },
      { n: 27, title: "Bowled" },
      { n: 28, title: "Timed out" },
      { n: 29, title: "Caught" },
      { n: 30, title: "Handled the ball" },
      { n: 31, title: "Hit the ball twice" },
      { n: 32, title: "Hit wicket" },
      { n: 33, title: "Leg before wicket (LBW)" },
      { n: 34, title: "Obstructing the field" },
      { n: 35, title: "Run out" },
      { n: 36, title: "Stumped" },
    ],
  },
  {
    title: "Fielding side and conduct",
    blurb: "Wicketkeeper, fielders, fair play and protests.",
    rules: [
      { n: 37, title: "Wicketkeeper" },
      { n: 38, title: "Fielder" },
      { n: 39, title: "Unfair play" },
      { n: 40, title: "Protest" },
    ],
  },
];

export const englishRuleTitle = new Map(ruleChapters.flatMap((c) => c.rules.map((r) => [r.n, r.title] as const)));

/** URL that opens the PDF at a page in the browser's own viewer. */
export const pdfPageUrl = (page: number) => `${rulebookPdf}#page=${page}`;
