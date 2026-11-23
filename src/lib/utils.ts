export { cn } from "cn"

/** First and last initials, ignoring titles: "Mr. M. N. Abbasi" → "MA", "Firozze Kamaal Abbasi" → "FA". */
export function initialsOf(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((w) => !/^(mr|mrs|ms|dr|shri|smt)\.?$/i.test(w));
  if (!words.length) return "";
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}
