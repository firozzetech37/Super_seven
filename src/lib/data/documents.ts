export type DocCategory = "rules" | "forms" | "fixtures" | "results" | "officials";

export type LegacyDocument = {
  id: string;
  title: string;
  file: string;
  year: number;
  pages: number;
  category: DocCategory;
  description: string;
  /** Full URL for documents hosted on this site; legacy ones resolve from legacyDocumentBase + file. */
  href?: string;
};

/** The 2014 PDFs still hosted on the old site; they move to this site's storage in Phase 2. */
export const legacyDocumentBase = "https://sscfi.org/images/";

export const documentCategories: Record<DocCategory, string> = {
  rules: "Rules",
  forms: "Forms",
  fixtures: "Fixtures",
  results: "Results",
  officials: "Officials",
};

export const documents: LegacyDocument[] = [
  {
    id: "rulebook-multilingual",
    title: "Super Seven Cricket Multilingual Rulebook",
    file: "sscfi-multilingual-rulebook.pdf",
    href: "/documents/sscfi-multilingual-rulebook.pdf",
    year: 2026,
    pages: 173,
    category: "rules",
    description: "All forty rules and the glossary in sixteen Indian languages, translated from the English Pocket Rulebook. Under Technical Committee review.",
  },
  {
    id: "rules-highlights",
    title: "Highlights: Rules of Super Seven Cricket",
    file: "HIGHLIGHTS-RULES-SUPER-SEVEN-CRICKET.pdf",
    year: 2014,
    pages: 1,
    category: "rules",
    description: "Seven players, seven overs, pitch and ball sizes and the penalty runs, on one page.",
  },
  {
    id: "registration-form",
    title: "Registration-cum-Entry Form",
    file: "Registration-Form-SSCFI.pdf",
    year: 2014,
    pages: 2,
    category: "forms",
    description: "Paper entry form for state teams: 12 players, manager and coach. Replaced by online registration.",
  },
  {
    id: "state-officials",
    title: "SSCFI State Officials",
    file: "SSCFI-Team.pdf",
    year: 2014,
    pages: 5,
    category: "officials",
    description: "Presidents and secretaries of nine state associations, with photos.",
  },
  {
    id: "fixture-2014",
    title: "NCL Super 7 2014 Fixture",
    file: "FIXTURE.pdf",
    year: 2014,
    pages: 2,
    category: "fixtures",
    description: "Eight groups of three teams and the knockout tree for Amroha.",
  },
  {
    id: "league-results",
    title: "NCL Super 7 League Match Results",
    file: "NCL-S7-League-Matches-Results.pdf",
    year: 2014,
    pages: 3,
    category: "results",
    description: "All 24 league matches played 22 to 24 June 2014.",
  },
  {
    id: "quarter-final-results",
    title: "NCL Super 7 Quarter-Final Results",
    file: "NCL-S7-Result-Quarter-Final.pdf",
    year: 2014,
    pages: 1,
    category: "results",
    description: "Four quarter-finals with top scorers and man of the match.",
  },
  {
    id: "semi-final-results",
    title: "NCL Super 7 Semi-Final Results",
    file: "NCL-S7-Result-Sami-Final.pdf",
    year: 2014,
    pages: 1,
    category: "results",
    description: "Both semi-finals: UP Host beat Saurashtra, Mumbai beat NCR Blue.",
  },
  {
    id: "final-result",
    title: "NCL Super 7 Final Result",
    file: "NCL-S7-Result-Final.pdf",
    year: 2014,
    pages: 1,
    category: "results",
    description: "UP Host beat Mumbai 111 to 52. Man of the match: Jitendra.",
  },
];
