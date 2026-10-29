export type NewsType = "news" | "announcement" | "newsletter";

export type NewsItem = {
  id: string;
  type: NewsType;
  title: string;
  /** ISO date; omitted when SSCFI has not confirmed it yet. */
  date?: string;
  summary: string;
  href?: string;
  cover?: string;
  coverAlt?: string;
  /** From the 2014 site. */
  archive?: boolean;
  featured?: boolean;
  /** Story confirmed, details still to come from SSCFI. */
  pending?: boolean;
};

export const newsTypes: { value: NewsType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "news", label: "News" },
  { value: "announcement", label: "Announcements" },
  { value: "newsletter", label: "Newsletters" },
];

export const newsItems: NewsItem[] = [
  {
    id: "17th-youth-national",
    type: "news",
    title: "17th Youth National Super Seven Cricket Championship (Under-23)",
    summary:
      "The latest national event for under-23 players. The full story, results and photos follow once SSCFI confirms the details.",
    cover: "/legacy/slide2.jpg",
    coverAlt: "Banner of the 17th Youth National Super Seven Cricket Championship (Under-23) Boys",
    featured: true,
    pending: true,
  },
  {
    id: "ncl-s7-amroha-2014-final",
    type: "news",
    title: "NCL Super 7 Amroha 2014: UP Host win the final",
    date: "2014-06-25",
    summary:
      "Uttar Pradesh (Host) beat Mumbai 111 to 52 at Abbasi Cricket Ground to lift the National Cricket League Super 7. Man of the match: Jitendra.",
    href: "/fixtures#results",
    cover: "/legacy/match/final-match.jpg",
    coverAlt: "The final match of NCL Super 7 2014 at Abbasi Cricket Ground, Amroha",
    archive: true,
  },
  {
    id: "hyderabad-u23-2014",
    type: "announcement",
    title: "Hyderabad National Cricket League Super 7 (Under 23)",
    date: "2014-09-24",
    summary: "The under-23 league in Hyderabad, 24 to 28 September 2014, as announced on the 2014 site.",
    archive: true,
  },
];

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function formatNewsDate(iso?: string) {
  return iso ? dateFormat.format(new Date(`${iso}T00:00:00Z`)) : "Date to be confirmed";
}

export const newsTypeLabel: Record<NewsType, string> = {
  news: "News",
  announcement: "Announcement",
  newsletter: "Newsletter",
};
