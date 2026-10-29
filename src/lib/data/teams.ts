/** State units and officials, transcribed from the 2014 "SSCFI State Officials" PDF on the old site. */
export type StateUnit = {
  id: string;
  state: string;
  code: string;
  officials: { role: string; name: string }[];
};

export const stateUnits: StateUnit[] = [
  {
    id: "punjab",
    state: "Punjab",
    code: "PB",
    officials: [
      { role: "President", name: "Jasvinder Singh Gill" },
      { role: "Hony. General Secretary", name: "Prem Singh" },
    ],
  },
  { id: "andhra-pradesh", state: "Andhra Pradesh", code: "AP", officials: [{ role: "President", name: "Jagan Mohan Metla" }] },
  { id: "chhattisgarh", state: "Chhattisgarh", code: "CG", officials: [{ role: "Secretary", name: "Mohan Kumar" }] },
  {
    id: "delhi",
    state: "Delhi",
    code: "DL",
    officials: [
      { role: "President", name: "Shyam Sunder" },
      { role: "General Secretary", name: "Mrs Rekha Sharma" },
    ],
  },
  {
    id: "mumbai",
    state: "Mumbai",
    code: "MUM",
    officials: [
      { role: "President", name: "Madan Singh Parmar" },
      { role: "Secretary", name: "Ramdas Chitre" },
    ],
  },
  {
    id: "bengal",
    state: "Bengal",
    code: "WB",
    officials: [
      { role: "President", name: "Asim Kr. Niyogi" },
      { role: "Hony. General Secretary", name: "Kishan C. Dikpati" },
    ],
  },
  { id: "maharashtra", state: "Maharashtra", code: "MH", officials: [{ role: "Secretary", name: "Dr Suraj Yeotikar" }] },
  { id: "uttarakhand", state: "Uttarakhand", code: "UK", officials: [{ role: "Secretary", name: "Dr Nagendra Sharma" }] },
  { id: "gujarat", state: "Gujarat", code: "GJ", officials: [{ role: "President", name: "Dipak Mayani" }] },
];

/** The 24 teams that played the National Cricket League Super 7, Amroha, June 2014 (spellings corrected). */
export const archiveTeams2014 = [
  "Uttar Pradesh",
  "Uttar Pradesh (Host)",
  "Saurashtra",
  "Chhattisgarh",
  "Madhya Pradesh",
  "Punjab",
  "Haryana",
  "Abbasi Cricket Academy",
  "Islamic Culture Centre",
  "Uttarakhand",
  "Chandigarh",
  "Puducherry",
  "Mumbai Association",
  "NCR (Red)",
  "NCR (Blue)",
  "West Bengal",
  "Karnataka",
  "Rajasthan Association",
  "Rajasthan Academy",
  "Gujarat",
  "Delhi",
  "Andhra Pradesh",
  "Tamil Nadu",
  "Maharashtra",
];

export type Official = { id: string; name: string; role: string; state: string; photo: string };

export const officials: Official[] = [
  { id: "anil-kumar", name: "Anil Kumar", role: "Umpire", state: "Uttarakhand", photo: "/legacy/umppire_1.jpg" },
  { id: "kuldeep-nagar", name: "Kuldeep Nagar", role: "Umpire", state: "Uttar Pradesh", photo: "/legacy/umppire_2.jpg" },
];
