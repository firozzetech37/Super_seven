import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, EyeOff, Fingerprint, RotateCcw, Search, ShieldCheck, SlidersHorizontal, Users } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { PageHeader } from "@/components/layout/page-header";
import { RowsSkeleton } from "@/components/layout/page-skeleton";
import { SectionHeading } from "@/components/layout/section-heading";
import { stateCodes } from "@/lib/forms";
import { searchPlayers } from "@/lib/queries/players";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Player Directory",
  description: "Registered players by state. Shows name, player ID, state and category only.",
};

const categories = [
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "women", label: "Women" },
  { value: "corporate", label: "Corporate" },
];
const categoryLabel = Object.fromEntries(categories.map((c) => [c.value, c.label]));
const stateName = Object.fromEntries(Object.entries(stateCodes).map(([name, code]) => [code, name]));
const categoryTone: Record<string, string> = {
  junior: "bg-ground/10 text-ground-deep ring-ground/20",
  senior: "bg-royal/10 text-royal ring-royal/20",
  women: "bg-ball/10 text-ball ring-ball/20",
  corporate: "bg-gold/15 text-gold-deep ring-gold/30",
};

/** First and last initials for the row avatar. */
function initialsOf(name: string) {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

const promises = [
  {
    icon: Fingerprint,
    title: "One ID per player",
    text: "A five-digit serial and the state code, like 00001-WB. Issued after SSCFI approves the registration.",
  },
  {
    icon: ShieldCheck,
    title: "What the directory shows",
    text: "Name, player ID, state and category (junior, senior, women, corporate). Enough to verify a player on match day.",
  },
  {
    icon: EyeOff,
    title: "What it never shows",
    text: "Date of birth, guardian's name, phone, email or address. Children's details stay with the federation.",
  },
];

export default function PlayersPage(props: PageProps<"/players">) {
  return (
    <>
      <PageHeader
        eyebrow="Teams"
        title="Player Directory"
        description="Every approved player, searchable by name or ID. The directory shows name, ID, state and category only."
        crumbs={[{ label: "Teams", href: "/teams" }, { label: "Players" }]}
        aside={
          <Link
            href="/register/player"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)] transition hover:bg-gold-deep"
          >
            Register as a player
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        }
      />

      <section className="relative isolate overflow-hidden bg-white py-14 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-40 size-[520px] rounded-full bg-royal/[0.06] blur-3xl" />
          <div className="absolute -left-40 bottom-0 size-[420px] rounded-full bg-gold/[0.08] blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* searchParams is runtime data under Cache Components, so the directory resolves inside Suspense. */}
          <Suspense
            fallback={
              <>
                <DirectoryForm q="" state="" category="" pending />
                <div className="mt-6">
                  <RowsSkeleton />
                </div>
              </>
            }
          >
            <Directory searchParams={props.searchParams} />
          </Suspense>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-stadium py-16 text-white lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_70%_at_25%_50%,#000,transparent)]" />
          <div className="absolute -left-40 top-1/3 size-[560px] rounded-full bg-royal/40 blur-[120px]" />
          <GroundWatermark className="parallax-slow absolute -right-60 -top-16 w-[900px] text-white/[0.05]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.7)_20%,rgba(217,174,86,0.7)_80%,transparent)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            tone="dark"
            eyebrow="How it works"
            title={
              <>
                Public, searchable and <span className="text-gold">careful with children&apos;s data</span>
              </>
            }
          />
          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal from="scale" className="mx-auto w-full max-w-sm">
              <IdCardExample />
            </Reveal>
            <Reveal stagger={120} as="ul" className="space-y-4">
              {promises.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="group flex gap-5 rounded-3xl bg-white/[0.05] p-5 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:translate-x-1 hover:bg-white/[0.09] hover:ring-gold/40 sm:p-6"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/15 transition duration-300 group-hover:-rotate-6 group-hover:bg-gold group-hover:text-navy">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white">{title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{text}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/** Illustration of the ID format described in the copy. Clearly labelled as an example, not a real player. */
function IdCardExample() {
  return (
    <figure className="relative">
      <span aria-hidden="true" className="absolute inset-6 -z-10 rounded-[2rem] bg-gold/30 blur-3xl" />
      <div className="relative motion-safe:animate-float-slow">
        <div className="relative -rotate-3 overflow-hidden rounded-[1.75rem] bg-[linear-gradient(150deg,#f6dfa2,#d9ae56_45%,#c99b43)] p-[1.5px] shadow-[0_40px_80px_rgba(4,15,42,0.55)] transition-transform duration-500 hover:rotate-0">
          <div className="relative overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-[linear-gradient(150deg,#1c4fa0,#0f2e63_60%,#0b2550)] p-6">
            <GroundWatermark className="absolute -bottom-16 -right-20 w-80 text-white/[0.08]" />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent motion-safe:animate-sweep"
            />
            <div className="relative flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold">SSCFI · Player ID</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 ring-1 ring-white/20">Example</span>
            </div>
            <div className="relative mt-8 flex items-center gap-4">
              <span aria-hidden="true" className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Users className="size-7 text-white/50" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">Player ID</p>
                <p className="font-mono text-3xl font-bold tracking-wider text-white">00001-WB</p>
              </div>
            </div>
            <dl className="relative mt-7 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 text-sm">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">Serial</dt>
                <dd className="mt-0.5 font-bold text-white">Five digits</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">State code</dt>
                <dd className="mt-0.5 font-bold text-white">WB · {stateName.WB ?? "West Bengal"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <figcaption className="mt-8 text-center text-sm text-white/60">The ID format, shown with the example from the rules. Not a real player.</figcaption>
    </figure>
  );
}

async function Directory({ searchParams }: Pick<PageProps<"/players">, "searchParams">) {
  const sp = await searchParams;
  const pick = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : "");
  const q = pick(sp.q);
  const state = pick(sp.state);
  const category = pick(sp.category);
  const { players, configured } = await searchPlayers({ q, state, category });
  const filtered = Boolean(q || state || category);

  return (
    <>
      <DirectoryForm q={q} state={state} category={category} />
      <div className="mt-6">
        {!configured ? (
          <EmptyState title="Directory not connected" text="The player database is not configured on this deployment." />
        ) : players.length === 0 ? (
          <EmptyState
            title={filtered ? "No players match" : "No approved players yet"}
            text={
              filtered
                ? "Try a shorter name, a different state or clear the filters."
                : "Players appear here as soon as SSCFI approves their registration and issues a Player ID."
            }
            action={filtered ? "clear" : "register"}
          />
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
            <div className="relative flex items-center justify-between gap-3 overflow-hidden bg-stadium px-5 py-4 text-white">
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
              <p className="flex items-center gap-3 font-bold" aria-live="polite">
                <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-gold ring-1 ring-white/15">
                  <Users className="size-4" aria-hidden="true" />
                </span>
                {players.length} player{players.length === 1 ? "" : "s"}
                {players.length === 200 ? " (first 200)" : ""}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">{filtered ? "Matching players" : "Approved players"}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-[15px]">
                <caption className="sr-only">Approved players</caption>
                <thead className="bg-surface text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">Player ID</th>
                    <th scope="col" className="px-5 py-3">Name</th>
                    <th scope="col" className="px-5 py-3">State</th>
                    <th scope="col" className="px-5 py-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-navy">
                  {players.map((p) => (
                    <tr key={p.player_id} className="group transition-colors hover:bg-surface">
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="rounded-lg bg-navy px-2.5 py-1 font-mono text-sm font-bold tracking-wide text-gold">{p.player_id}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-3 font-bold">
                          <span
                            aria-hidden="true"
                            className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(150deg,#1c4fa0,#0f2e63)] text-xs font-bold text-gold ring-2 ring-white transition-transform duration-300 group-hover:scale-110"
                          >
                            {initialsOf(p.name)}
                          </span>
                          {p.name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">{stateName[p.state_code] ?? p.state_code}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${categoryTone[p.category] ?? "bg-royal/10 text-royal ring-royal/20"}`}>
                          {categoryLabel[p.category] ?? p.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DirectoryForm({ q, state, category, pending = false }: { q: string; state: string; category: string; pending?: boolean }) {
  const field =
    "h-12 w-full rounded-full bg-surface text-[15px] text-navy ring-1 ring-line outline-none transition placeholder:text-slate-400 hover:ring-royal/40 focus:bg-white focus:ring-2 focus:ring-royal";
  return (
    <form
      method="get"
      role="search"
      aria-label="Player directory"
      className="card-premium relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-[0_24px_60px_rgba(15,46,99,0.1)] ring-1 ring-line sm:p-7"
      aria-busy={pending || undefined}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-royal">
          <span aria-hidden="true" className="h-px w-8 bg-gold-deep" />
          Search the directory
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <ShieldCheck className="size-4 text-ground" aria-hidden="true" />
          Name, ID, state and category only
        </p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search by name or player ID</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-royal" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name or player ID (e.g. 00001-WB)"
            className={`${field} pl-12 pr-4`}
          />
        </label>
        <div className="grid grid-cols-2 gap-3 md:flex">
          <label className="sr-only" htmlFor="directory-state">
            State
          </label>
          <select id="directory-state" name="state" defaultValue={state} className={`${field} px-5 md:w-56`}>
            <option value="">All states</option>
            {Object.entries(stateCodes).map(([name, code]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="directory-category">
            Category
          </label>
          <select id="directory-category" name="category" defaultValue={category} className={`${field} px-5 md:w-48`}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy px-7 font-bold text-white shadow-[0_10px_24px_rgba(15,46,99,0.25)] transition hover:bg-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
        >
          <Search className="size-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
          Search
        </button>
      </div>
      {q || state || category ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-bold text-slate-500">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters:
          </span>
          {[q && `“${q}”`, state && (stateName[state] ?? state), category && (categoryLabel[category] ?? category)]
            .filter(Boolean)
            .map((f) => (
              <span key={String(f)} className="rounded-full bg-royal/10 px-3 py-1 font-bold text-royal">
                {f}
              </span>
            ))}
          <Link href="/players" className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-bold text-slate-500 underline-offset-4 hover:text-navy hover:underline">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Clear
          </Link>
        </div>
      ) : null}
    </form>
  );
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: "clear" | "register" }) {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-surface px-6 py-12 text-center ring-1 ring-line motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,46,99,0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(55%_70%_at_50%_40%,#000,transparent)]" />
        <GroundWatermark className="absolute left-1/2 top-1/2 w-[640px] -translate-x-1/2 -translate-y-1/2 text-navy/[0.04]" />
      </div>
      <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-royal text-white shadow-[0_12px_28px_rgba(28,79,160,0.35)]">
        <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-royal/40 motion-safe:animate-ping [animation-duration:2.4s]" />
        <Users className="relative size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-heading text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-600">{text}</p>
      {action === "clear" ? (
        <Link
          href="/players"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-navy ring-1 ring-line transition hover:ring-royal"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear the filters
        </Link>
      ) : action === "register" ? (
        <Link
          href="/register/player"
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(15,46,99,0.18)] transition hover:bg-gold-deep"
        >
          Register as a player
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
