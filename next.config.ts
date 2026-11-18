import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    // Photos uploaded in /admin/media live in the public "media" bucket of the Supabase project.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/media/**" }],
  },
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
      { source: "/single.html", destination: "/", permanent: true },
      // The 2014 PDFs now live in public/documents/2014 under the same file names.
      { source: "/images/:file(.+\\.pdf)", destination: "/documents/2014/:file", permanent: true },
      // Old gallery files: photos and press scans moved with their folders.
      { source: "/img/picture/:file", destination: "/legacy/pictures/:file", permanent: true },
      { source: "/img/media/:year(\\d{4})/:file", destination: "/legacy/press/:year/:file", permanent: true },
    ];
  },
};

export default nextConfig;
