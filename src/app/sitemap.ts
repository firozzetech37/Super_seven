import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/teams", priority: 0.8, changeFrequency: "monthly" },
  { path: "/fixtures", priority: 0.9, changeFrequency: "weekly" },
  { path: "/rules", priority: 0.7, changeFrequency: "yearly" },
  { path: "/rules/rulebook", priority: 0.7, changeFrequency: "yearly" },
  { path: "/register", priority: 0.9, changeFrequency: "monthly" },
  { path: "/register/player", priority: 0.8, changeFrequency: "monthly" },
  { path: "/register/team", priority: 0.8, changeFrequency: "monthly" },
  { path: "/register/district", priority: 0.8, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.6, changeFrequency: "monthly" },
  { path: "/locations", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/news", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/about/advisory-committee", priority: 0.5, changeFrequency: "yearly" },
  { path: "/about/office-bearers", priority: 0.6, changeFrequency: "yearly" },
  { path: "/about/committee", priority: 0.5, changeFrequency: "yearly" },
  { path: "/about/core-members", priority: 0.5, changeFrequency: "yearly" },
  { path: "/players", priority: 0.6, changeFrequency: "weekly" },
  { path: "/governance/constitution", priority: 0.4, changeFrequency: "yearly" },
  { path: "/governance/documents", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: `${site.url}${r.path}`, priority: r.priority, changeFrequency: r.changeFrequency }));
}
