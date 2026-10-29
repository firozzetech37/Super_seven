import type { Metadata } from "next";
import { CommitteePage } from "@/components/about/committee-page";

export const metadata: Metadata = {
  title: "Committee Members",
  description: "Photo, name, role and state of every committee member.",
};

export default function Page() {
  return <CommitteePage id="committee" title="Committee Members" description="Photo, name, role and state of every committee member." />;
}
