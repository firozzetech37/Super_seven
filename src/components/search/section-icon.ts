import {
  BookOpen,
  Briefcase,
  CalendarDays,
  FileText,
  Images,
  Info,
  Landmark,
  Mail,
  MapPinned,
  Newspaper,
  Scale,
  Trophy,
  UserPlus,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const rules: [RegExp, LucideIcon][] = [
  [/amroha|final|result|trophy/i, Trophy],
  [/rule/i, BookOpen],
  [/fixture|match|schedule/i, CalendarDays],
  [/regist|join|sign/i, UserPlus],
  [/bearer|people|person|member|advis|leader/i, UserRound],
  [/team|player|official/i, UsersRound],
  [/gallery|photo|media|video/i, Images],
  [/news|press|update/i, Newspaper],
  [/career|job|role/i, Briefcase],
  [/location|map|district|state/i, MapPinned],
  [/contact|email|office/i, Mail],
  [/governance|constitution|document/i, Landmark],
  [/legal|privacy|terms|disclaimer/i, Scale],
  [/about|story|history|founded/i, Info],
];

/** Picks an icon for a search section or popular search by name; falls back to a page icon. */
export function iconFor(label: string): LucideIcon {
  return rules.find(([re]) => re.test(label))?.[1] ?? FileText;
}

export function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
