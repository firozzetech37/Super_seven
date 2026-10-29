import type { Metadata } from "next";
import { LegalArticle, type LegalSection } from "@/components/about/legal-article";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SSCFI collects, uses and protects personal information.",
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    paragraphs: [
      "Super Seven Cricket Federation of India (SSCFI) is a registered society (no. 521/2003-04) that promotes seven-a-side cricket across India. This policy explains what personal information this website collects, why, and what you can ask us to do with it. It applies to sscfi.org and to the forms on it.",
    ],
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    paragraphs: ["We collect only what each form needs."],
    bullets: [
      "Player registration: full name, father or guardian's name, email, mobile, date of birth, gender, address, pincode, city, state, category, batting and bowling style, club or school.",
      "Team or club registration: team name, city, state, captain and vice-captain, squad list, coach or manager contact, previous tournaments.",
      "District association registration: association name and registration number, state and district, contact person, designation, phone, email, full address, current teams and players, and the registration certificate you upload.",
      "Enquiry form: name, mobile, email, the type of enquiry and your message.",
      "Newsletter: your email address.",
      "Website use: standard server logs (IP address, browser, pages visited) kept for security and to keep the site working.",
    ],
  },
  {
    id: "how-we-use-it",
    heading: "How we use it",
    bullets: [
      "To review and approve registrations, issue player IDs and certificates, and call you back about your submission.",
      "To run tournaments: fixtures, team sheets, results and officials' assignments.",
      "To answer enquiries and corporate booking requests.",
      "To send the newsletter you subscribed to. Every email has an unsubscribe link.",
      "To keep the site secure and to understand which pages are useful.",
    ],
  },
  {
    id: "children",
    heading: "Children and guardians",
    paragraphs: [
      "Junior players register with a father or guardian's name and the guardian's consent. We keep a child's date of birth and guardian details only to verify age category and eligibility. They are never published.",
      "The public player directory shows a player's name, player ID, state and category only. It never shows date of birth, guardian's name, phone, email or address, for any player of any age.",
    ],
  },
  {
    id: "sharing",
    heading: "Who we share it with",
    paragraphs: ["We do not sell personal information and we do not share it for advertising."],
    bullets: [
      "State and district associations affiliated to SSCFI, for the teams and players registered through them.",
      "Tournament officials, for team sheets and eligibility checks.",
      "Service providers that run this website: hosting, database, file storage and email delivery. They act on our instructions.",
      "Authorities, where the law requires it.",
    ],
  },
  {
    id: "retention",
    heading: "How long we keep it",
    paragraphs: [
      "Registration records are kept while the player, team or association is active with SSCFI and for the following three seasons, so results and IDs remain verifiable. Enquiries are kept for one year. Newsletter addresses are kept until you unsubscribe. Server logs are kept for 90 days.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your choices",
    bullets: [
      "Ask for a copy of the information we hold about you or your child.",
      "Ask us to correct it, or to delete it where we no longer need it for an active registration.",
      "Unsubscribe from the newsletter at any time using the link in any email.",
      "Ask us not to list a player in the public directory.",
    ],
    paragraphs: ["Write to coo@sscfi.org with the subject line \"Privacy request\". We reply within 30 days."],
  },
  {
    id: "security",
    heading: "Security",
    paragraphs: [
      "Forms are sent over an encrypted connection. Registration data is stored in a database with access limited to SSCFI administrators, and uploaded certificates are stored privately, not at public URLs. No method is perfect, so if you believe your information has been exposed, tell us at coo@sscfi.org.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies",
    paragraphs: [
      "This site uses only the cookies and browser storage needed to keep it working, such as remembering a filter you chose. We do not use advertising cookies. If we add analytics, this section will say which tool and how to opt out.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    paragraphs: [
      "When this policy changes, the date at the top changes with it. Significant changes are announced on the News page. This version is a draft prepared for review by the federation's office bearers.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalArticle
      title="Privacy Policy"
      description="How SSCFI collects, uses and protects personal information from registrations, enquiries and the newsletter."
      updated="28 October 2026"
      sections={sections}
    />
  );
}
