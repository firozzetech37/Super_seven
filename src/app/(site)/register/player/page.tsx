import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PlayerForm } from "@/components/register/player-form";
import { RegisterShell } from "@/components/register/register-shell";

export const metadata: Metadata = {
  title: "Player Registration",
  description: "Full name, guardian, contact, date of birth, address, category, batting and bowling style, club or school.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="New Registration"
        title="Player Registration"
        description="About five minutes. SSCFI verifies the details, calls back and issues a Player ID like 00001-WB."
        crumbs={[{ label: "New Registration", href: "/register" }, { label: "Player" }]}
      />
      <RegisterShell current="/register/player">
        <PlayerForm />
      </RegisterShell>
    </>
  );
}
