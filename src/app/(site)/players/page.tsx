import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, EyeOff, Fingerprint, Search, ShieldCheck, Users } from "lucide-react";
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

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
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

        <div className="mt-14">
          <SectionHeading eyebrow="How it works" title="Public, searchable and careful with children's data" />
        </div>
        <Reveal stagger as="ul" className="mt-8 grid gap-5 md:grid-cols-3">
          {promises.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl bg-surface p-6 ring-1 ring-line">
              <span className="grid size-11 place-items-center rounded-xl bg-royal/10 text-royal">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-xl font-bold text-navy">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </Reveal>
      </section>
    </>
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
          />
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
            <div className="flex items-center justify-between gap-3 bg-navy px-5 py-3 text-white">
              <p className="flex items-center gap-2 font-bold">
                <Users className="size-4 text-gold" aria-hidden="true" />
                {players.length} player{players.length === 1 ? "" : "s"}
                {players.length === 200 ? " (first 200)" : ""}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Approved players</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[15px]">
                <caption className="sr-only">Approved players</caption>
                <thead className="bg-surface text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Player ID</th>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">State</th>
                    <th className="px-5 py-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-navy">
                  {players.map((p) => (
                    <tr key={p.player_id}>
                      <td className="whitespace-nowrap px-5 py-3 font-mono font-bold">{p.player_id}</td>
                      <td className="px-5 py-3 font-bold">{p.name}</td>
                      <td className="px-5 py-3">{stateName[p.state_code] ?? p.state_code}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-royal/10 px-2.5 py-1 text-xs font-bold text-royal">{categoryLabel[p.category] ?? p.category}</span>
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
  return (
    <form method="get" className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8" aria-busy={pending || undefined}>
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search by name or player ID</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name or player ID (e.g. 00001-WB)"
            className="h-12 w-full rounded-full bg-surface pl-12 pr-4 text-[15px] text-navy ring-1 ring-line outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-royal"
          />
        </label>
        <label className="sr-only" htmlFor="directory-state">
          State
        </label>
        <select
          id="directory-state"
          name="state"
          defaultValue={state}
          className="h-12 rounded-full bg-surface px-5 text-[15px] text-navy ring-1 ring-line outline-none focus:bg-white focus:ring-2 focus:ring-royal md:w-56"
        >
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
        <select
          id="directory-category"
          name="category"
          defaultValue={category}
          className="h-12 rounded-full bg-surface px-5 text-[15px] text-navy ring-1 ring-line outline-none focus:bg-white focus:ring-2 focus:ring-royal md:w-52"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button type="submit" className="h-12 rounded-full bg-navy px-6 font-bold text-white transition hover:bg-royal">
          Search
        </button>
      </div>
    </form>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-surface p-8 text-center ring-1 ring-line">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal">
        <Users className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-heading text-2xl font-bold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-600">{text}</p>
    </div>
  );
}
