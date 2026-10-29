import type { Metadata } from "next";
import { Bell, CalendarRange, Megaphone, Trophy } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { NewsList } from "@/components/news/news-list";
import { newsItems } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "News, newsletters and announcements.",
};

const perks = [
  { icon: CalendarRange, label: "Fixtures" },
  { icon: Trophy, label: "Results" },
  { icon: Megaphone, label: "Announcements" },
];

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
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)] transition hover:bg-gold-deep motion-safe:animate-glow"
          >
            <Bell className="size-4 transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true" />
            Get the newsletter
          </a>
        }
      />

      <section className="relative isolate overflow-hidden bg-surface py-14 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(55%_70%_at_90%_0%,rgba(28,79,160,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Latest" title="From the federation" />
          <div className="mt-8">
            <NewsList items={newsItems} />
          </div>
        </div>
      </section>

      <section id="newsletter" className="scroll-mt-28 bg-surface pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal from="scale">
            <div className="card-premium relative isolate overflow-hidden rounded-[2rem] bg-stadium px-6 py-10 text-white shadow-[0_40px_80px_rgba(15,46,99,0.28)] sm:px-10 lg:px-14 lg:py-14">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_80%_at_15%_50%,#000,transparent)]" />
                <GroundWatermark className="parallax-slow absolute -right-40 -top-20 w-[760px] text-white/[0.05]" />
                <div className="absolute -bottom-32 right-1/4 size-[400px] rounded-full bg-gold/10 blur-[110px]" />
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.8)_25%,rgba(217,174,86,0.8)_75%,transparent)]" />
              </div>
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gold text-navy shadow-[0_14px_30px_rgba(4,15,42,0.45)] motion-safe:animate-float">
                    <Bell className="size-7" aria-hidden="true" />
                  </span>
                  <SectionHeading
                    tone="dark"
                    eyebrow="Newsletter"
                    title="Fixtures, results and announcements in your inbox"
                    description="One email when something happens. Nothing when it doesn't. This replaces the old site's pop-up sign-up."
                  />
                </div>
                <div className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur sm:p-7">
                  <ul className="mb-5 flex flex-wrap gap-2">
                    {perks.map(({ icon: Icon, label }) => (
                      <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white/85 ring-1 ring-white/15">
                        <Icon className="size-3.5 text-gold" aria-hidden="true" />
                        {label}
                      </li>
                    ))}
                  </ul>
                  <NewsletterForm tone="dark" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
