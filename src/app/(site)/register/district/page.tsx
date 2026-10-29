import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { DistrictForm } from "@/components/register/district-form";
import { RegisterShell } from "@/components/register/register-shell";

export const metadata: Metadata = {
  title: "District Association Registration",
  description: "Association name, registration number, state and district, contact person, full address, teams and players today, certificate upload.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="New Registration"
        title="District Association Registration"
        description="Bring Super Seven to your district. Once approved, your district turns green on the map and can register teams and players."
        crumbs={[{ label: "New Registration", href: "/register" }, { label: "District Association" }]}
      />
      <RegisterShell current="/register/district">
        <DistrictForm />
      </RegisterShell>
    </>
  );
}
