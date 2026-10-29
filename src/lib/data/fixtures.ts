export type UpcomingFixture = {
  id: string;
  title: string;
  city?: string;
  href: string;
  /** Sample entries are placeholders until real fixtures come from Supabase. */
  sample?: boolean;
  /** Present when the fixture comes from the database. */
  teams?: string;
  date?: string;
  time?: string;
  venue?: string;
};

export const upcomingFixtures: UpcomingFixture[] = [
  { id: "district-cup-hooghly", title: "District Cup", city: "Hooghly", href: "/fixtures" },
  { id: "corporate-fun-friday", title: "Corporate Fun Friday", city: "Gurugram", href: "/fixtures" },
  { id: "youth-national", title: "Youth National Championship", href: "/fixtures", sample: true },
];

/* ---------- Results archive: National Cricket League Super 7, Amroha, June 2014 ---------- */

export type Stage = "league" | "quarter" | "semi" | "third" | "final" | "friendly";

export type MatchResult = {
  id: string;
  stage: Stage;
  label: string;
  teamA: string;
  teamB: string;
  /** Runs, optionally with wickets, e.g. "74/3". */
  scoreA?: string;
  scoreB?: string;
  winner?: string;
  margin?: string;
  manOfMatch?: string;
  image?: { src: string; alt: string };
};

export const tournament2014 = {
  id: "ncl-s7-amroha-2014",
  name: "National Cricket League Super 7",
  shortName: "NCL S7 Amroha 2014",
  organiser: "Abbasi National Cricket League Super 7",
  venue: "Abbasi Cricket Ground (ACG), Amroha, Uttar Pradesh",
  dates: "22–25 June 2014",
  teams: 24,
  groups: 8,
  matches: 32,
  format: "Eight groups of three by draw; one team per group to the quarter-finals, then semi-finals, third place and the final.",
  sessions: "Morning 7–11 am (4 matches) and evening 6–10 pm (5 matches).",
  friendly: "A friendly between Secretary XI and President XI opened the tournament on the night of 21 June.",
  documents: [
    { label: "Fixture and groups (PDF)", href: "https://sscfi.org/images/FIXTURE.pdf" },
    { label: "League results, 22–24 June (PDF)", href: "https://sscfi.org/images/NCL-S7-League-Matches-Results.pdf" },
    { label: "Quarter-final results (PDF)", href: "https://sscfi.org/images/NCL-S7-Result-Quarter-Final.pdf" },
    { label: "Semi-final results (PDF)", href: "https://sscfi.org/images/NCL-S7-Result-Sami-Final.pdf" },
    { label: "Final result (PDF)", href: "https://sscfi.org/images/NCL-S7-Result-Final.pdf" },
  ],
};

export const leagueSummary2014 = {
  matches: 24,
  dates: "22–24 June 2014",
  walkovers: 8,
  tie: { teamA: "Gujarat", teamB: "Karnataka", score: "88–88" },
};

export const results2014: MatchResult[] = [
  {
    id: "final",
    stage: "final",
    label: "Final · 25 June, 9 pm",
    teamA: "Uttar Pradesh (Host)",
    teamB: "Mumbai",
    scoreA: "111",
    scoreB: "52",
    winner: "Uttar Pradesh (Host)",
    margin: "by 59 runs",
    manOfMatch: "Jitendra",
    image: { src: "/legacy/match/final-match.jpg", alt: "Uttar Pradesh (Host) with the NCL S7 2014 winners' trophy" },
  },
  {
    id: "sf1",
    stage: "semi",
    label: "Semi-final 1 · 25 June, 6 pm",
    teamA: "Uttar Pradesh (Host)",
    teamB: "Saurashtra",
    scoreA: "123",
    scoreB: "88",
    winner: "Uttar Pradesh (Host)",
    margin: "by 35 runs",
    image: { src: "/legacy/match/semi-final-match-1.jpg", alt: "Players lined up before semi-final 1" },
  },
  {
    id: "sf2",
    stage: "semi",
    label: "Semi-final 2 · 25 June, 7 pm",
    teamA: "Mumbai",
    teamB: "NCR (Blue)",
    scoreA: "72",
    scoreB: "71",
    winner: "Mumbai",
    margin: "by 1 run",
    image: { src: "/legacy/match/semi-final-match-2.jpg", alt: "Mumbai celebrate after semi-final 2" },
  },
  { id: "qf1", stage: "quarter", label: "Quarter-final 1", teamA: "Saurashtra", teamB: "Uttar Pradesh", scoreA: "88", scoreB: "86", winner: "Saurashtra", margin: "by 2 runs" },
  { id: "qf2", stage: "quarter", label: "Quarter-final 2", teamA: "Mumbai", teamB: "Uttarakhand", scoreA: "74/3", scoreB: "70", winner: "Mumbai", margin: "by 7 wickets" },
  { id: "qf3", stage: "quarter", label: "Quarter-final 3", teamA: "Uttar Pradesh (Host)", teamB: "NCR (Red)", scoreA: "116", scoreB: "84/5", winner: "Uttar Pradesh (Host)", margin: "by 32 runs" },
  { id: "qf4", stage: "quarter", label: "Quarter-final 4", teamA: "NCR (Blue)", teamB: "Delhi", scoreA: "107", scoreB: "99", winner: "NCR (Blue)", margin: "by 8 runs" },
  { id: "league-tie", stage: "league", label: "League · 22–24 June", teamA: "Gujarat", teamB: "Karnataka", scoreA: "88", scoreB: "88", margin: "Match tied" },
];
