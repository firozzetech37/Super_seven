/* Plain values shared by the content admin pages and their server actions ("use server" files can only export functions). */

/** Office-bearer rows offered on each state unit form; empty rows are ignored. */
export const OFFICIAL_ROWS = 4;

export const peopleSections = [
  { value: "leadership", label: "Leadership", where: "About, Contact and the home page" },
  { value: "office_bearer", label: "Office bearers", where: "About → Office Bearers" },
  { value: "advisory", label: "Advisory Committee", where: "About → Advisory Committee" },
  { value: "committee", label: "Committee Members", where: "About → Committee" },
  { value: "core", label: "Core Members", where: "About → Core Members" },
] as const;

export type PeopleSection = (typeof peopleSections)[number]["value"];

export const newsKinds = [
  { value: "news", label: "News" },
  { value: "announcement", label: "Announcement" },
  { value: "newsletter", label: "Newsletter" },
] as const;

export const documentCategoryOptions = [
  { value: "rules", label: "Rules" },
  { value: "forms", label: "Forms" },
  { value: "officials", label: "Officials" },
  { value: "fixtures", label: "Fixtures" },
  { value: "results", label: "Results" },
] as const;

/** PDFs up to 50 MB (the Supabase free plan's limit per file). */
export const MAX_PDF_BYTES = 50 * 1024 * 1024;
