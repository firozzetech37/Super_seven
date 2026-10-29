import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { NewsList } from "@/components/news/news-list";
import { newsItems } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "News, newsletters and announcements.",
};

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ball → News"
        title="News & Updates"
        description="News, newsletters and announcements from the federation. The ticker at the top carries the next matches."
        crumbs={[{ label: "News & Updates" }]}
        aside={
          <a
            href="#newsletter"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)] transition hover:bg-gold-deep"
          >
            <Bell className="size-4" aria-hidden="true" />
            Get the newsletter
          </a>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <NewsList items={newsItems} />
      </section>

      <section id="newsletter" className="scroll-mt-28 border-t border-line bg-surface py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_480px]">
          <SectionHeading
            eyebrow="Newsletter"
            title="Fixtures, results and announcements in your inbox"
            description="One email when something happens. Nothing when it doesn't. This replaces the old site's pop-up sign-up."
          />
          <NewsletterForm tone="light" />
        </div>
      </section>
    </>
  );
}
