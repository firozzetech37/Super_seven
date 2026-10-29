/** Super Seven rules, transcribed from "Highlights: Rules of Super Seven Cricket" (SSCFI PDF). */
export const rulesPdf = "https://sscfi.org/images/HIGHLIGHTS-RULES-SUPER-SEVEN-CRICKET.pdf";

export const quickFacts = [
  { value: "7", label: "Players a side" },
  { value: "7", label: "Overs an innings" },
  { value: "6", label: "Balls an over" },
  { value: "2 h", label: "Match time" },
];

export type RuleSection = { n: number; id: string; title: string; points: string[] };

export const ruleSections: RuleSection[] = [
  {
    n: 1,
    id: "players-and-overs",
    title: "Players and overs",
    points: ["Seven players a side.", "Each side bats for seven overs.", "Six balls to an over."],
  },
  {
    n: 2,
    id: "bowling",
    title: "Bowling restrictions",
    points: [
      "Six of the seven players bowl one over each; the wicket-keeper does not bowl.",
      "The seventh over is bowled by any one of those six bowlers.",
    ],
  },
  {
    n: 3,
    id: "pitch-and-ball",
    title: "Pitch and ball",
    points: [
      "The pitch is marked 5 ft wide on either side of the centre line.",
      "The ball weighs 155–165 g and measures 22–23 cm in circumference.",
    ],
  },
  {
    n: 4,
    id: "match-time",
    title: "Match time",
    points: ["A complete match, both innings, is played inside two hours."],
  },
  {
    n: 5,
    id: "no-balls-and-wides",
    title: "No-balls and wides",
    points: [
      "A no-ball costs 2 runs.",
      "After three no-balls in an over, every further no-ball in that over costs 4 runs.",
      "Wides are penalised the same way: 2 runs each, and 4 runs for every wide after the third in an over.",
    ],
  },
  {
    n: 6,
    id: "bouncers",
    title: "Bouncers",
    points: [
      "Bouncers are not allowed. A bouncer is called a no-ball and costs 2 runs.",
      "After one bouncer in an over, each further bouncer in that over costs 4 runs.",
    ],
  },
  {
    n: 7,
    id: "categories-and-colours",
    title: "Categories and team colours",
    points: ["Competitions are held for men and for women.", "Each team plays in the colour of its state."],
  },
];

export const glossary: { term: string; definition: string }[] = [
  { term: "Super Seven", definition: "The SSCFI format: seven players a side, seven overs an innings, a match inside two hours." },
  { term: "District Association", definition: "The SSCFI unit for one district. It registers teams and players and runs district fixtures." },
  { term: "State unit", definition: "The association that represents a state (or a city unit such as Mumbai) within the federation." },
  { term: "Player ID", definition: "The number issued to every approved player, in the form 00001-WB: a serial number and the state code." },
  { term: "Walkover", definition: "A match awarded to one side because the other did not take the field." },
  { term: "Tie", definition: "Both sides finish on the same score, as Gujarat and Karnataka did (88–88) in Amroha in 2014." },
  { term: "Man of the Match", definition: "The player judged to have had the biggest influence on a match, named by the match officials." },
  { term: "League stage", definition: "The group matches at the start of a tournament. In 2014 there were eight groups of three teams." },
  { term: "Knockout", definition: "Quarter-finals, semi-finals, the third-place match and the final: lose and you are out." },
  { term: "No-ball", definition: "An illegal delivery. In Super Seven it costs 2 runs, rising to 4 after the third in an over." },
  { term: "Wide", definition: "A delivery out of the batter's reach. Penalised like a no-ball: 2 runs, then 4 after the third in an over." },
  { term: "Corporate day", definition: "A booked Super Seven event for a company, such as Corporate Fun Friday in Gurugram." },
];
