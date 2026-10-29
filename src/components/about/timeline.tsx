import { site } from "@/lib/site";

const milestones = [
  {
    year: String(site.foundedYear),
    title: "Federation founded",
    text: `Initiated by ${site.foundedBy} and registered as a society (no. 521/2003-04) to take seven-a-side cricket to the grassroots.`,
  },
  {
    year: "2014",
    title: "NCL Super 7, Amroha",
    text: "24 teams from across India at Abbasi Cricket Ground, 22 to 25 June. Uttar Pradesh (Host) beat Mumbai in the final.",
  },
  {
    year: "2014",
    title: "NCL Super 7 Under-23, Hyderabad",
    text: "The under-23 league announced for 24 to 28 September.",
  },
  {
    year: "Today",
    title: "District by district",
    text: "District associations register online, players get an ID, and the map shows where Super Seven is played.",
  },
];

export function Timeline() {
  return (
    <ol className="relative space-y-8 border-l-2 border-gold/60 pl-8">
      {milestones.map((m, i) => (
        <li key={`${m.year}-${i}`} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[2.45rem] top-1 grid size-5 place-items-center rounded-full bg-white ring-2 ring-gold"
          >
            <span className="size-2 rounded-full bg-gold" />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">{m.year}</p>
          <h3 className="mt-1 font-heading text-xl font-bold text-navy">{m.title}</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{m.text}</p>
        </li>
      ))}
    </ol>
  );
}
