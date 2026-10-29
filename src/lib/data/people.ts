export type PersonGroup = "leadership" | "advisory" | "committee" | "core" | "office_bearer";

export type Person = {
  id: string;
  name?: string;
  role: string;
  group: PersonGroup;
  email?: string;
  emailSuggested?: boolean;
  phone?: string;
  linkedin?: string;
  photo?: string;
  state?: string;
};

export const leadership: Person[] = [
  {
    id: "president",
    name: "Firozze Kamaal Abbasi",
    role: "President",
    group: "leadership",
    email: "president@sscfi.org",
    emailSuggested: true,
    linkedin: "https://www.linkedin.com/in/firozze-kamaal-abbasi",
  },
  {
    id: "secretary",
    role: "Secretary",
    group: "leadership",
    email: "secretary@sscfi.org",
    emailSuggested: true,
  },
  {
    id: "coo",
    name: "Soumendu Kundu",
    role: "Chief Operating Officer",
    group: "leadership",
    email: "coo@sscfi.org",
  },
];

export type CommitteeMember = { initials: string; name: string; role: string; state?: string };

export type Committee = {
  id: string;
  title: string;
  description: string;
  href: string;
  members: CommitteeMember[];
  /** Number of empty avatar slots to show until the list is supplied. */
  placeholders: number;
};

export const committees: Committee[] = [
  {
    id: "advisory",
    title: "Advisory Committee",
    description: "From the current site",
    href: "/about/advisory-committee",
    members: [],
    placeholders: 8,
  },
  {
    id: "committee",
    title: "Committee Members",
    description: "Photo, name, role, state",
    href: "/about/committee",
    members: [{ initials: "FA", name: "Firozze K. Abbasi", role: "President" }],
    placeholders: 7,
  },
  {
    id: "core",
    title: "Core Members",
    description: "Photo, name, role, state",
    href: "/about/core-members",
    members: [{ initials: "FA", name: "Firozze K. Abbasi", role: "President" }],
    placeholders: 7,
  },
];

export type OfficeBearer = {
  id: string;
  name: string;
  designation: string;
  photo: string;
  phones?: string[];
  /** Addresses on the sscfi.in domain no longer resolve; they are shown as text, not links. */
  emails?: string[];
  address?: string;
};

/** Office bearers as published on the 2014 site (office-bearer.html), pending confirmation by SSCFI. */
export const officeBearers2014: OfficeBearer[] = [
  {
    id: "mn-abbasi",
    name: "Mr. M. N. Abbasi",
    designation: "President",
    photo: "/legacy/photos-1.jpg",
    phones: ["+91-9810033346"],
    emails: ["president@sscfi.in"],
    address: "F-30, Green Park Main, New Delhi 110016",
  },
  {
    id: "feroz-abbasi",
    name: "Mr. Feroz Abbasi",
    designation: "Senior Vice President",
    photo: "/legacy/photos-2.jpg",
    phones: ["+91-9810245768"],
    emails: ["sr.vicepresident@sscfi.in"],
    address: "Abbasi Cricket Ground (ACG), Amroha, Uttar Pradesh 244221",
  },
  {
    id: "shri-kant-sharma",
    name: "Mr. Shri Kant Sharma",
    designation: "Secretary General",
    photo: "/legacy/photos-3.jpg",
    phones: ["+91-9319916335", "+91-8791013599"],
    emails: ["secretary@sscfi.in", "isscosk@gmail.com"],
    address: "T-II-9, Staff Colony, Judges Court Compound, Near Natraj Hotel, Bulandshahr, Uttar Pradesh",
  },
  { id: "aslam-farooqui", name: "Mr. Aslam Farooqui", designation: "Chairman, Organizing Committee", photo: "/legacy/photos-4.jpg" },
  { id: "umesh-kumar-goel", name: "Mr. Umesh Kumar Goel", designation: "Chairman, Technical Committee", photo: "/legacy/photos-5.jpg" },
  { id: "nepal-singh", name: "Mr. Nepal Singh", designation: "Deputy Chairman, Technical Committee", photo: "/legacy/photos-6.jpg" },
  { id: "satyapal-singh", name: "Mr. Satyapal Singh", designation: "Public Relation Officer", photo: "/legacy/photos-7.jpg" },
  { id: "pawan-kumar", name: "Mr. Pawan Kumar", designation: "Scorer", photo: "/legacy/photos-8.jpg" },
  { id: "rajesh-sharma", name: "Mr. Rajesh Sharma", designation: "Senior Umpire", photo: "/legacy/photos-9.jpg" },
];
