import {
  Building2,
  Contact,
  FileBadge,
  Flag,
  Home,
  Medal,
  ShieldHalf,
  UserRound,
  UsersRound,
  Whistle,
  type LucideIcon,
} from "lucide-react";

/** Section ids, legends and icons for each registration form, shared by the form and its progress tracker. */
export type FormSection = { id: string; title: string; icon: LucideIcon };

export const playerSections = [
  { id: "about-you", title: "About you", icon: UserRound },
  { id: "contact", title: "Contact", icon: Contact },
  { id: "address", title: "Address", icon: Home },
  { id: "cricket", title: "Cricket", icon: Medal },
] satisfies FormSection[];

export const teamSections = [
  { id: "team", title: "Team", icon: Flag },
  { id: "captaincy", title: "Captaincy", icon: ShieldHalf },
  { id: "squad", title: "Squad", icon: UsersRound },
  { id: "coach", title: "Coach or manager", icon: Whistle },
] satisfies FormSection[];

export const districtSections = [
  { id: "association", title: "Association", icon: Building2 },
  { id: "contact-person", title: "Contact person", icon: Contact },
  { id: "teams-and-players", title: "Teams and players today", icon: UsersRound },
  { id: "certificate", title: "Registration certificate", icon: FileBadge },
] satisfies FormSection[];

export const sectionsByForm: Record<string, FormSection[]> = {
  "/register/player": playerSections,
  "/register/team": teamSections,
  "/register/district": districtSections,
};

/** Id of the <form> element on every registration page, read by FormProgress. */
export const registerFormId = "registration-form";
