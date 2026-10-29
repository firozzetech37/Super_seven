import { leadership } from "@/lib/data/people";
import { aboutLinks, contentAreas, doors, footerColumns, legalLinks, navigation, site } from "@/lib/site";

export type SearchEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  section: string;
  keywords: string[];
};

export const popularSearches = ["Rules", "Register", "Fixtures", "Amroha 2014", "Office bearers", "Gallery", "Contact"];

const facts: SearchEntry[] = [
  {
    id: "fact-format",
    title: "How Super Seven cricket is played",
    description:
      "Seven players a side, seven overs an innings, six balls an over, a match inside two hours. No-balls and wides cost two runs; bouncers are not allowed.",
    href: "/rules#english",
    section: "Rules",
    keywords: ["rules", "format", "overs", "players", "no-ball", "wide", "bouncer", "pitch", "ball", "two hours", "innings"],
  },
  {
    id: "fact-amroha",
    title: "NCL Super 7 Amroha 2014: the final",
    description: "Uttar Pradesh (Host) beat Mumbai 111 to 52 at Abbasi Cricket Ground, Amroha. Man of the Match: Jitendra.",
    href: "/fixtures#archive",
    section: "Fixtures & Results",
    keywords: ["amroha", "ncl", "national cricket league", "super 7", "final", "2014", "results", "mumbai", "uttar pradesh", "jitendra", "winner"],
  },
  {
    id: "fact-player-id",
    title: "Player IDs",
    description: "Every approved player gets an ID like 00001-WB: a five-digit number and the state code. The public directory shows only name, ID, state and category.",
    href: "/players",
    section: "Teams",
    keywords: ["player id", "id", "directory", "00001-wb", "state code", "privacy"],
  },
  {
    id: "fact-register",
    title: "Register as a player, team or district association",
    description: "Three online forms. SSCFI reviews every submission and calls back; approved districts turn green on the map.",
    href: "/register",
    section: "New Registration",
    keywords: ["register", "registration", "sign up", "join", "form", "player", "team", "club", "district association", "certificate"],
  },
  {
    id: "fact-founded",
    title: `Founded ${site.foundedYear}`,
    description: `${site.name} was founded in ${site.foundedYear}, initiated by ${site.foundedBy}. ${site.registration}.`,
    href: "/about",
    section: "About",
    keywords: ["founded", "history", "abbasi", "society", "registered", "story", "2003"],
  },
  {
    id: "fact-office",
    title: "Registered office and email",
    description: `${site.address}. Email ${site.email}.`,
    href: "/contact",
    section: "Contact",
    keywords: ["address", "office", "email", "bulandshahr", "phone", "write", "reach"],
  },
  {
    id: "fact-corporate",
    title: "Corporate Fun Fridays and corporate days",
    description: "Book a seven-a-side day for your company: two-hour matches, umpires and scorers provided.",
    href: "/contact#corporate",
    section: "Contact",
    keywords: ["corporate", "fun friday", "booking", "company", "team building", "gurugram"],
  },
  {
    id: "fact-newsletter",
    title: "Newsletter",
    description: "Fixtures, results and announcements by email. One email when something happens.",
    href: "/news#newsletter",
    section: "News",
    keywords: ["newsletter", "subscribe", "email", "updates", "announcements"],
  },
];

function build(): SearchEntry[] {
  const byHref = new Map<string, SearchEntry>();
  const add = (entry: SearchEntry) => {
    const existing = byHref.get(entry.href);
    if (existing) {
      existing.keywords = Array.from(new Set([...existing.keywords, ...entry.keywords, entry.title.toLowerCase()]));
      if (entry.description.length > existing.description.length) existing.description = entry.description;
      return;
    }
    byHref.set(entry.href, { ...entry, keywords: Array.from(new Set(entry.keywords)) });
  };

  for (const item of navigation) {
    add({
      id: `nav-${item.href}`,
      title: item.label,
      description: item.children?.map((c) => c.label).join(" · ") ?? "",
      href: item.href,
      section: item.label === "Home" ? "Pages" : item.label,
      keywords: [item.label.toLowerCase(), ...(item.children?.map((c) => c.label.toLowerCase()) ?? [])],
    });
    for (const c of item.children ?? []) {
      add({
        id: `nav-${c.href}`,
        title: c.label,
        description: c.description ?? "",
        href: c.href,
        section: item.label,
        keywords: [c.label.toLowerCase(), item.label.toLowerCase()],
      });
    }
  }
  for (const d of doors) {
    add({
      id: `door-${d.number}`,
      title: d.label,
      description: d.items.join(" · "),
      href: d.href,
      section: d.label,
      keywords: [`player ${d.number}`, `door ${d.number}`, ...d.items.map((i) => i.toLowerCase())],
    });
  }
  for (const area of Object.values(contentAreas)) {
    add({ id: `area-${area.href}`, title: area.label, description: area.description, href: area.href, section: area.label, keywords: ["bat", "ball", "photos", "media"] });
  }
  for (const l of aboutLinks) {
    add({ id: `about-${l.href}`, title: l.label, description: "", href: l.href, section: "About", keywords: ["about", "people", "members"] });
  }
  for (const col of footerColumns) {
    for (const l of col.links) {
      add({ id: `footer-${l.href}`, title: l.label, description: "", href: l.href, section: col.title, keywords: [col.title.toLowerCase()] });
    }
  }
  for (const l of legalLinks) {
    add({ id: `legal-${l.href}`, title: l.label, description: "", href: l.href, section: "Legal", keywords: ["legal", "policy", "terms"] });
  }
  for (const p of leadership) {
    add({
      id: `person-${p.id}`,
      title: p.name ?? `${p.role} (name to be added)`,
      description: `${p.role}${p.email ? ` · ${p.email}` : ""}`,
      href: "/contact#leadership",
      section: "People",
      keywords: [p.role.toLowerCase(), "leadership", "president", "secretary", "coo", ...(p.name ? p.name.toLowerCase().split(" ") : [])],
    });
  }
  for (const f of facts) add(f);
  return Array.from(byHref.values());
}

export const searchIndex: SearchEntry[] = build();

function tokens(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9ঀ-৿]+/)
    .filter((t) => t.length > 1);
}

/** Simple ranked search: title matches beat keywords, keywords beat descriptions. */
export function search(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  const terms = tokens(q);
  if (!terms.length) return [];

  const scored = searchIndex.map((entry) => {
    const title = entry.title.toLowerCase();
    const description = entry.description.toLowerCase();
    const keywords = entry.keywords.join(" ");
    let score = 0;
    if (title.includes(q)) score += 8;
    for (const t of terms) {
      if (title.includes(t)) score += 5;
      if (keywords.includes(t)) score += 3;
      if (description.includes(t)) score += 1;
      if (entry.href.toLowerCase().includes(t)) score += 1;
    }
    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map((s) => s.entry);
}
