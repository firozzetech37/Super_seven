import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { RegisterShell } from "@/components/register/register-shell";
import { TeamForm } from "@/components/register/team-form";

export const metadata: Metadata = {
  title: "Team Registration",
  description: "Team name, city, state, captain and vice-captain, squad of 12, coach or manager contact, previous tournaments.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="New Registration"
        title="Team / Club Registration"
        description="Enter a side for district, state and national championships. SSCFI verifies the squad and emails the team certificate."
        crumbs={[{ label: "New Registration", href: "/register" }, { label: "Team / Club" }]}
      />
      <RegisterShell current="/register/team">
        <TeamForm />
      </RegisterShell>
    </>
  );
}
