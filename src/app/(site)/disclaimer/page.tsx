import type { Metadata } from "next";
import { LegalArticle, type LegalSection } from "@/components/about/legal-article";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for the SSCFI website.",
};

const sections: LegalSection[] = [
  {
    id: "information",
    heading: "Information on this site",
    paragraphs: [
      "The Super Seven Cricket Federation of India (SSCFI) publishes this website for general information about the federation, its tournaments, rules and people. We work to keep it accurate, but fixtures move, venues change and results are corrected after review by the technical committee. Always confirm match details with the organising association before you travel.",
    ],
  },
  {
    id: "archive",
    heading: "Archive and sample content",
    paragraphs: [
      "Some pages carry records from the federation's 2014 website, marked \"Archive\" or \"Records from the 2014 site\". They show what was published at the time and may not reflect current office bearers, contacts or results.",
      "Maps and status colours marked \"Sample data\" illustrate how the district tracker will work. They do not show the real status of any state, district or locality until the registration system goes live.",
    ],
  },
  {
    id: "maps",
    heading: "Maps and boundaries",
    paragraphs: [
      "State and district boundaries are drawn from census-based open data for orientation only. They are not authoritative and do not represent any position of SSCFI on administrative or international boundaries. Ground locations and pins are approximate.",
    ],
  },
  {
    id: "people",
    heading: "People and contact details",
    paragraphs: [
      "Names, designations and contact details of office bearers and committee members are published with their knowledge for federation business. Please use them for cricket matters only. Email addresses on the former sscfi.in domain no longer work and are shown for reference.",
    ],
  },
  {
    id: "external",
    heading: "External links and documents",
    paragraphs: [
      "Links to social networks, video platforms, map providers and documents on the previous site open third-party services that SSCFI does not control. Their availability and content are their responsibility.",
    ],
  },
  {
    id: "no-advice",
    heading: "No professional advice",
    paragraphs: [
      "Nothing on this site is legal, medical or financial advice. Players take part in matches at their own risk and should be medically fit to play; associations are responsible for ground safety and insurance where required.",
    ],
  },
  {
    id: "contact",
    heading: "Report an error",
    paragraphs: [
      "If you find something wrong, write to coo@sscfi.org with the page address and what needs to change. This disclaimer is a draft prepared for review by the federation's office bearers.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <LegalArticle
      title="Disclaimer"
      description="What this site is for, what is archive or sample content, and how to report an error."
      updated="28 October 2026"
      sections={sections}
    />
  );
}
