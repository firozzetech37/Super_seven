import type { Metadata } from "next";
import { CommitteePage } from "@/components/about/committee-page";

export const metadata: Metadata = {
  title: "Core Members",
  description: "Photo, name, role and state of every core member.",
};

export default function Page() {
  return <CommitteePage id="core" title="Core Members" description="The core group that runs tournaments and districts." />;
}
