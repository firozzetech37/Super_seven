export type Role = {
  slug: string;
  title: string;
  /** Singular, for "Apply as …". */
  noun: string;
  summary: string;
  lookingFor: string[];
  commitment: string;
};

export const roles: Role[] = [
  {
    slug: "umpire",
    noun: "umpire",
    title: "Umpires",
    summary: "Stand in district, state and national Super Seven matches, from league games to the final.",
    lookingFor: [
      "Knows the Super Seven rule book, including the no-ball and bouncer penalties",
      "Match experience at club level or above",
      "Free on weekends and tournament days",
      "Calm under a two-hour match clock",
    ],
    commitment: "Per match, from district fixtures to national tournaments",
  },
  {
    slug: "scorer",
    noun: "scorer",
    title: "Scorers",
    summary: "Keep the official score, overs and bowling figures that feed the results and league tables on this site.",
    lookingFor: [
      "Accurate with ball-by-ball scoring",
      "Comfortable with a scoring sheet or app",
      "Available for a full day of back-to-back matches",
    ],
    commitment: "Per tournament day",
  },
  {
    slug: "coach",
    noun: "coach",
    title: "Coaches",
    summary: "Prepare district and state squads for the seven-a-side format, where every player bowls.",
    lookingFor: [
      "Coaching certificate or first-class or state-level playing record",
      "Experience with junior, senior or women's squads",
      "Based near a district where Super Seven is played",
    ],
    commitment: "Season-long with a district or state association",
  },
  {
    slug: "coordinator",
    noun: "coordinator",
    title: "Coordinators",
    summary: "Run the ground on match day and keep district associations, teams and the federation talking.",
    lookingFor: [
      "Organised, with a phone that is always on",
      "Local knowledge of grounds, officials and travel",
      "Spoken Hindi or Bengali plus English is a plus",
    ],
    commitment: "Per tournament, with a district or state association",
  },
];

export const careerSteps = [
  { n: 1, title: "Tell us about yourself", text: "Use the enquiry form with the role you want and your experience. No attachments needed yet." },
  { n: 2, title: "A call from SSCFI", text: "The federation checks your experience against the fixtures coming up near you." },
  { n: 3, title: "Your first assignment", text: "Start at a district fixture. National tournaments follow." },
];
