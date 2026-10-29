import type { Metadata } from "next";
import { LegalArticle, type LegalSection } from "@/components/about/legal-article";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the SSCFI website and registration services.",
};

const sections: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Using this website",
    paragraphs: [
      "These terms apply to sscfi.org and to the services on it: information pages, the player directory, the map, and the registration, enquiry and newsletter forms. By using the site you accept them. If you register a player, team or association you also accept the rules of the Super Seven Cricket Federation of India (SSCFI) as published on the Rules page and in the federation's constitution.",
    ],
  },
  {
    id: "registration",
    heading: "Registration",
    bullets: [
      "Submitting a form is an application, not an approval. SSCFI reviews every submission and may ask for more information or decline it.",
      "You must give true and complete information. A player ID, team entry or association certificate obtained with false information can be withdrawn.",
      "A player under 18 must be registered by a parent or guardian, who gives consent on the form.",
      "A person registering a team or an association confirms they are authorised to do so.",
      "Player IDs and certificates remain the property of SSCFI and may be suspended for breaches of the rules of the game or of conduct.",
    ],
  },
  {
    id: "fees",
    heading: "Fees",
    paragraphs: [
      "Registration and tournament fees, where they apply, are set by SSCFI or the state and district associations and are stated before you pay. This website does not take payments at present; any fee is collected by the association directly.",
    ],
  },
  {
    id: "content",
    heading: "Content, photos and results",
    paragraphs: [
      "Text, photographs, logos and documents on this site belong to SSCFI or are used with permission. You may share links and quote short extracts with credit. You may not reproduce the logo, photographs or documents commercially without written permission.",
      "By taking part in SSCFI tournaments you agree that photographs and videos of matches, including of you, may be published on this site and the federation's social channels. Ask coo@sscfi.org to have a specific photo removed.",
      "Scores, league tables and player records are published in good faith from the official scorers' sheets. Report an error to the scorer or to coo@sscfi.org.",
    ],
  },
  {
    id: "conduct",
    heading: "Your conduct",
    bullets: [
      "Do not submit forms on behalf of someone else without their permission.",
      "Do not attempt to access other users' data, to interfere with the site, or to send unsolicited messages through it.",
      "Do not upload documents you do not have the right to share.",
    ],
  },
  {
    id: "third-parties",
    heading: "Links and third parties",
    paragraphs: [
      "The site links to social networks, map providers and documents still hosted on the previous sscfi.org site. Those services have their own terms and privacy policies. SSCFI is not responsible for their content.",
    ],
  },
  {
    id: "liability",
    heading: "Liability",
    paragraphs: [
      "The site is provided as it is. SSCFI works to keep fixtures, results and contact details accurate but cannot guarantee that every page is complete or up to date at every moment, and is not liable for loss arising from reliance on it. Nothing in these terms limits liability that cannot be limited under Indian law.",
    ],
  },
  {
    id: "law",
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of India. Disputes are subject to the courts at the federation's registered office in Bulandshahr, Uttar Pradesh, unless the federation's constitution provides a dispute procedure that applies first.",
    ],
  },
  {
    id: "changes",
    heading: "Changes",
    paragraphs: [
      "SSCFI may update these terms. The date at the top shows the current version. This version is a draft prepared for review by the federation's office bearers.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalArticle
      title="Terms"
      description="Terms of use for the SSCFI website, the registration forms and the player directory."
      updated="28 October 2026"
      sections={sections}
    />
  );
}
