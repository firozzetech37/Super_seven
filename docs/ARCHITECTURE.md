# SSCFI Website — Architecture (v1, 28 Oct 2026)
Source: SSCFI_Website_Concept_v2.pdf (10 pages) + SSCFI-website-audit.md (old site).
Project location: /Users/vaasu/Desktop/sscfi-web

## 1. Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript, Server Components, Server Actions, Turbopack) |
| Styling | Tailwind CSS v4, shadcn/ui (Radix), Lucide icons, design tokens for the 5 brand colours |
| Motion | Motion (Framer Motion) for ground/fielder animation; Embla carousel (shadcn Carousel) for mobile lineup |
| Fonts | next/font: Lora (display), Lato (body), Noto Sans Bengali (rule book) |
| Forms | React Hook Form + Zod (shared client/server schemas), Cloudflare Turnstile |
| Database | PostgreSQL on Neon |
| CMS/Admin | Payload CMS 3 mounted inside the same Next.js app at /admin (collections, roles, drafts, uploads, auth) |
| Files | Vercel Blob storage adapter (photos, press clippings, PDFs, registration certificates) |
| Email | Resend (transactional + newsletter) |
| Maps | d3-geo + custom SVG components for India/state/district boundaries from GeoJSON (geoBoundaries / datameet, simplified with mapshaper, split per state); react-leaflet + OpenStreetMap tiles for ground locations |
| Search | Postgres full-text (players, teams, news, people) + static page index; single header search box → /search |
| SEO | Metadata API, sitemap.ts, robots.ts, next/og images, JSON-LD (SportsOrganization, SportsEvent), redirects from old *.html URLs |
| Quality | ESLint, Prettier, Vitest + Testing Library, Playwright e2e, Husky + lint-staged, GitHub Actions, Vercel preview deploys |
| Hosting | Vercel (site + admin + API), Neon (DB), Vercel Blob (files), Resend (email) |

## 2. Routes
| Door | Route(s) |
|---|---|
| Home (centre logo) | / |
| 1 Teams | /teams, /teams/state/[slug], /teams/district/[slug], /teams/officials |
| 2 Fixtures & Results | /fixtures (filters: tournament, city, season), /fixtures/[tournament] (fixtures + results + league table) |
| 3 Rules | /rules (EN/BN toggle), /rules/glossary |
| 4 New Registration | /register, /register/player, /register/team, /register/district, /register/done |
| 5 Careers | /careers, /careers/[slug] |
| 6 Locations | /locations, /locations/[state], /locations/[state]/[district], /locations/[state]/[district]/[locality] |
| 7 Contact | /contact (leadership, enquiry form, corporate booking) |
| Bat → Photo Gallery | /gallery, /gallery/[album] (photos, press clippings by year, videos) |
| Ball → News & Updates | /news, /news/[slug] (news, newsletters, announcements) |
| Below ground → About | /about, /about/advisory-committee, /about/office-bearers, /about/committee, /about/core-members |
| Directory | /players (public: name, ID, state, category only; search + state filter) |
| Governance | /governance/constitution, /governance/documents |
| Legal | /privacy, /terms, /disclaimer |
| Search | /search?q= |
| Admin | /admin (Payload) |

Home composition (desktop): Header (logo, title, search, FB/IG/LinkedIn/YT) → NEXT MATCHES ticker (next 5 fixtures) → Ground hero (SVG oval, 7 numbered fielders, bat left, ball right, centre logo, gold "Register your District Association") → 4 cards (Leadership, Committee & Core, Find us on the map, Scroll) → Featured story → Leadership (President, Secretary, COO) → Advisory / Committee / Core rows → About → 4-column footer.
Mobile: header → ticker → bat + ball buttons → swipeable 7 player cards → same sections stacked.

## 3. Data model (Payload collections → Postgres tables)
- users: email, role (admin | editor | state_admin), state
- media: uploads (Blob), alt, kind (photo | press | document | certificate)
- people: name, designation, group (leadership | advisory | committee | core | office_bearer | official), officialType (umpire | coach | scorer), state, photo, email, phone, linkedin, order, isPublic
- states: code (WB), name, slug, geoFile
- districts: state, name, slug, censusCode, status (not_reached | in_discussion | onboarded), association
- localities: district, name, slug, lat, lng, status, association, ground, contactPerson, nextFixture
- associations: name, regNo, state, district, contactName, designation, phone, email, address, teamsCount, playersCount, certificate (media), status (pending | approved | rejected)
- teams: name, type (state | district | club), state, district, locality, captain, viceCaptain, coachContact, previousTournaments, squad (players[]), status
- players: playerId (00001-WB), name, guardianName, dob, gender, email, mobile, address, pincode, city, state, category (junior | senior | women | corporate), battingStyle, bowlingStyle, club, team, status, guardianConsent
- tournaments: name, slug, city, state, season, startDate, endDate, format, documents[]
- fixtures: tournament, stage (league | quarter | semi | third | final | friendly), group, teamA, teamB, date, time, venue, status (scheduled | live | completed | walkover | abandoned)
- results: fixture, scoreA, wicketsA, oversA, scoreB, wicketsB, oversB, winner, margin, isTie, isWalkover, manOfMatch, performers[]
- news: title, slug, type (news | newsletter | announcement), body (rich text), cover, attachment, publishedAt, status
- albums: title, slug, type (photos | press | videos), event/tournament, date, year, items[] (media | youtubeUrl, caption)
- documents: title, category (constitution | rules | forms | results | minutes), file, language (en | bn)
- jobs: title, roleType (umpire | scorer | coach | coordinator), location, description, howToApply, isOpen
- enquiries: name, mobile, email, message, type (general | corporate_booking), status
- subscribers: email, status (pending | confirmed | unsubscribed), token

Rules:
- Registration forms create players/teams/associations with status=pending. Admin approves in /admin → status=approved, player ID from per-state counter (transaction), Resend email, district status recoloured.
- Public player directory exposes only name, playerId, state, category (field-level access in Payload).
- Map colours read districts.status; same data as the internal District Tracker (tracker can import/export CSV or use the same DB).
- Ticker = fixtures where date >= today, order by date, limit 5.
- Legacy 2014 content imported by scripts/migrate-legacy.ts as archive (tournament "NCL S7 Amroha 2014", galleries, press clippings, office bearers).
- Old URLs redirected: /teams.html→/teams, /results-amroha.html→/fixtures/ncl-s7-amroha-2014, /media.html→/gallery?type=press, /pictures.html→/gallery, /office-bearer.html→/about/office-bearers, /contact.html→/contact, PDFs→/governance/documents.

## 4. Folder structure
```
sscfi-web/
├─ src/
│  ├─ app/
│  │  ├─ (site)/            public pages, shared layout (Header, Ticker, Footer)
│  │  ├─ (payload)/admin/   Payload admin UI
│  │  ├─ api/               Payload REST/GraphQL, og images, webhooks
│  │  ├─ sitemap.ts  robots.ts  manifest.ts  layout.tsx
│  ├─ components/
│  │  ├─ ui/        shadcn
│  │  ├─ ground/    CricketGround, Fielder, Bat, Ball, CentreLogo, MobileLineup
│  │  ├─ layout/    Header, Ticker, Footer, SearchBox, SocialLinks
│  │  ├─ map/       IndiaMap, StateMap, DistrictMap, LocalityCard, Legend, Breadcrumb
│  │  ├─ fixtures/  FixtureCard, ResultRow, LeagueTable, TournamentFilter
│  │  ├─ people/    PersonCard, LeadershipGrid, CommitteeRow
│  │  ├─ forms/     PlayerForm, TeamForm, DistrictForm, EnquiryForm, NewsletterForm
│  │  └─ gallery/   AlbumGrid, Lightbox, VideoEmbed
│  ├─ collections/  Payload collection configs (one file each)
│  ├─ lib/          payload client, geo loaders, player-id, email templates, zod schemas, utils
│  ├─ content/      rules/en.mdx, rules/bn.mdx, glossary, about, legal/*.mdx
│  ├─ data/geo/     india-states.json, states/<code>-districts.json, districts/<code>-<slug>.json
│  └─ styles/       globals.css (tokens: --royal-blue, --deep-navy, --gold, --ground-green, --ball-red)
├─ payload.config.ts
├─ scripts/         migrate-legacy.ts, geo-simplify.ts, seed.ts
├─ e2e/             Playwright
└─ docs/            ARCHITECTURE.md, AUDIT.md, CONTENT-INVENTORY.md
```

## 5. Build order
- Phase 0 Foundation: scaffold, tokens, fonts, Header/Ticker/Footer, ground hero (desktop SVG + mobile lineup), home cards, responsive shell, deploy preview.
- Phase 1 Static content: About + people, Rules (EN/BN), Teams 2014, Fixtures/Results 2014 (from PDFs), Gallery (photos, press by year), News, Careers, Governance, Legal, Contact + Newsletter (Resend + Turnstile), SEO, redirects.
- Phase 2 Database + admin: Payload + Neon + Blob, collections, migrate static content into DB, 3 registration forms, approval workflow, player IDs, emails, public player directory, search.
- Phase 3 Map: GeoJSON pipeline, India → State → District → Locality views, status colours from DB, locality cards, ground street view.
- Phase 4 Launch: Playwright e2e, Lighthouse/a11y pass, analytics, DNS cutover, old-URL redirects live.

## 6. Open decisions (defaults assumed)
1. Hosting: Vercel + Neon + Vercel Blob (free tiers to start).
2. Admin auth: Payload built-in. Clerk can replace it if preferred.
3. Email domain: @sscfi.org (sscfi.in no longer resolves). Needs DNS access for Resend.
4. Legacy 2014 content imported as an archive.
5. Content gaps from PDF p.8/p.10: Secretary name/photo/phone, committee/core/advisory lists, constitution, real district statuses.
