import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Constitution",
  description: "The constitution of the Super Seven Cricket Federation of India.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Constitution"
        description={`The constitution of ${site.name}, a society registered in ${site.foundedYear} under the Societies Registration Act, 1860.`}
        crumbs={[{ label: "Governance" }, { label: "Constitution" }]}
      />
      <SectionPlaceholder
        phase="Document requested from SSCFI"
        note="The constitution and bylaws have been requested from the federation. They will be published here as a readable page and a PDF, alongside annual general meeting minutes."
        items={["Memorandum of association", "Rules and regulations", "Office bearer elections", "AGM minutes"]}
        links={[
          { label: "Documents", href: "/governance/documents" },
          { label: "Office Bearers", href: "/about/office-bearers" },
          { label: "Our story", href: "/about" },
        ]}
      />
    </>
  );
}
