import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // Old sscfi.org URLs (2014 static site) keep working.
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/teams.html", destination: "/teams", permanent: true },
      { source: "/advisorycommittee.html", destination: "/about/advisory-committee", permanent: true },
      { source: "/fixture-hyderabad.html", destination: "/fixtures", permanent: true },
      { source: "/results-amroha.html", destination: "/fixtures", permanent: true },
      { source: "/results-hyderabad.html", destination: "/fixtures", permanent: true },
      { source: "/media.html", destination: "/gallery", permanent: true },
      { source: "/pictures.html", destination: "/gallery", permanent: true },
      { source: "/office-bearer.html", destination: "/about/office-bearers", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
