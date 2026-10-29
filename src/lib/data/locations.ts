export type Status = "onboarded" | "talks" | "unreached";

export const statusMeta: Record<Status, { label: string; dot: string; chip: string }> = {
  onboarded: { label: "Onboarded", dot: "bg-status-onboarded", chip: "bg-status-onboarded text-navy" },
  talks: { label: "In discussion", dot: "bg-status-talks", chip: "bg-status-talks text-navy" },
  unreached: { label: "Not reached", dot: "bg-status-unreached", chip: "bg-status-unreached text-navy" },
};

export type District = { n: number; name: string; status: Status; explorable?: boolean };

/** West Bengal's 23 districts. Statuses are SAMPLE DATA from the concept, not real status. */
export const westBengalDistricts: District[] = [
  { n: 1, name: "Alipurduar", status: "unreached" },
  { n: 2, name: "Bankura", status: "talks" },
  { n: 3, name: "Birbhum", status: "unreached" },
  { n: 4, name: "Cooch Behar", status: "unreached" },
  { n: 5, name: "Dakshin Dinajpur", status: "unreached" },
  { n: 6, name: "Darjeeling", status: "unreached" },
  { n: 7, name: "Hooghly", status: "onboarded", explorable: true },
  { n: 8, name: "Howrah", status: "talks" },
  { n: 9, name: "Jalpaiguri", status: "unreached" },
  { n: 10, name: "Jhargram", status: "unreached" },
  { n: 11, name: "Kalimpong", status: "unreached" },
  { n: 12, name: "Kolkata", status: "onboarded" },
  { n: 13, name: "Malda", status: "unreached" },
  { n: 14, name: "Murshidabad", status: "unreached" },
  { n: 15, name: "Nadia", status: "talks" },
  { n: 16, name: "North 24 Parganas", status: "talks" },
  { n: 17, name: "Paschim Bardhaman", status: "unreached" },
  { n: 18, name: "Paschim Medinipur", status: "unreached" },
  { n: 19, name: "Purba Bardhaman", status: "unreached" },
  { n: 20, name: "Purba Medinipur", status: "unreached" },
  { n: 21, name: "Purulia", status: "unreached" },
  { n: 22, name: "South 24 Parganas", status: "unreached" },
  { n: 23, name: "Uttar Dinajpur", status: "unreached" },
];

export type Locality = { name: string; status: Status };

/** Hooghly's towns and localities (sample). */
export const hooghlyLocalities: Locality[] = [
  { name: "Chandannagar", status: "onboarded" },
  { name: "Chinsurah", status: "onboarded" },
  { name: "Serampore", status: "talks" },
  { name: "Uttarpara", status: "unreached" },
  { name: "Dankuni", status: "onboarded" },
  { name: "Singur", status: "unreached" },
  { name: "Tarakeswar", status: "unreached" },
  { name: "Arambagh", status: "talks" },
];

/** The one locality with a full sample card. Every field is placeholder data until registration opens. */
export const sampleLocality = {
  name: "Dankuni",
  rows: [
    { label: "Association", value: "Hooghly District Super Seven Association" },
    { label: "Teams / players", value: "6 teams • 84 players" },
    { label: "Ground", value: "Dankuni ground (to confirm)" },
    { label: "Contact person", value: "Name • phone • email" },
    { label: "Next fixture", value: "Sat 14 Nov • District Cup" },
  ],
};
