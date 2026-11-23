import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Hourglass } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { formatNewsDate, newsTypeLabel } from "@/lib/data/news";
import { getNews, getNewsPost } from "@/lib/queries/content";

export async function generateStaticParams() {
  const news = await getNews();
  return news.length ? news.map((n) => ({ slug: n.id })) : [{ slug: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return { title: "News & Updates" };
  return { title: post.title, description: post.summary, openGraph: post.cover ? { images: [post.cover] } : undefined };
}

/** Paragraphs split on blank lines; single line breaks inside a paragraph are kept. */
function Paragraphs({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className="space-y-5 text-[17px] leading-[1.75] text-slate-700">
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split("\n").map((line, j) => (
            <span key={j}>
              {j ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

async function Story({ params }: { params: PageProps<"/news/[slug]">["params"] }) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();
  const link = post.link && post.link !== `/news/${slug}` ? post.link : undefined;
  const external = link ? /^https?:\/\//i.test(link) : false;

  return (
    <>
      <PageHeader
        eyebrow={`Ball → ${newsTypeLabel[post.type]}`}
        title={post.title}
        description={post.body ? post.summary : undefined}
        crumbs={[{ label: "News & Updates", href: "/news" }, { label: newsTypeLabel[post.type] }]}
      />

      <article className="relative isolate overflow-hidden bg-surface py-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(55%_70%_at_90%_0%,rgba(28,79,160,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-line">
              <CalendarDays className="size-3.5 text-gold-deep" aria-hidden="true" />
              {formatNewsDate(post.date)}
            </span>
            {post.archive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-line">
                <Archive className="size-3.5" aria-hidden="true" />
                From the 2014 site
              </span>
            ) : null}
            {post.pending ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 text-gold-deep ring-1 ring-gold/40">
                <Hourglass className="size-3.5" aria-hidden="true" />
                Details to be added
              </span>
            ) : null}
          </Reveal>

          {post.cover ? (
            <Reveal from="scale" className="mt-6">
              <figure className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_30px_70px_rgba(15,46,99,0.18)] ring-1 ring-line">
                <Image src={post.cover} alt={post.coverAlt ?? ""} fill priority sizes="(min-width: 768px) 720px, 92vw" className="object-cover" />
              </figure>
            </Reveal>
          ) : null}

          <Reveal className="mt-8 rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.06)] ring-1 ring-line sm:p-10">
            <Paragraphs text={post.body ?? post.summary} />
            {link ? (
              <div className="mt-8 border-t border-line pt-6">
                {external ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-bold text-white transition hover:bg-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
                  >
                    Read more
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <Link
                    href={link}
                    className="group inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-bold text-white transition hover:bg-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
                  >
                    Read more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ) : null}
          </Reveal>

          <p className="mt-8">
            <Link href="/news" className="group inline-flex items-center gap-2 font-bold text-royal hover:underline">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              All news &amp; updates
            </Link>
          </p>
        </div>
      </article>
    </>
  );
}

export default function NewsStoryPage({ params }: PageProps<"/news/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh] animate-pulse bg-surface" />}>
      <Story params={params} />
    </Suspense>
  );
}
