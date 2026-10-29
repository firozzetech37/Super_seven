import type { Metadata } from "next";
import { CommitteePage } from "@/components/about/committee-page";

export const metadata: Metadata = {
  title: "Advisory Committee",
  description: "Members of the SSCFI advisory committee.",
};

export default function Page() {
  return <CommitteePage id="advisory" title="Advisory Committee" description="Senior advisers to the federation, carried over from the current site." />;
}
