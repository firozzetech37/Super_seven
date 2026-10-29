import type { NavItem } from "@/lib/site";

/** A menu item is active on its own page and on any of its children's pages (hash ignored). */
export function isNavActive(item: NavItem, pathname: string) {
  if (item.href === "/") return pathname === "/";
  const bases = [item.href, ...(item.children?.map((c) => c.href.split("#")[0]) ?? [])].filter((b) => b !== "/");
  return bases.some((b) => pathname === b || pathname.startsWith(`${b}/`));
}
