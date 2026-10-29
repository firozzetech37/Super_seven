# Map data

`src/data/geo/` holds the boundaries behind the Locations map: `india-states.json` (36 states and union
territories, dissolved from district polygons) and `districts/<state-slug>.json` (737 districts, post-2017
names such as Kalimpong and Jhargram). `manifest.json` records the source commit and counts.

Rebuild from source:

```bash
node scripts/geo/build-geo.mjs
```

The script downloads from github.com/udit-001/india-maps-data (pinned commit `2884453`), simplifies with
mapshaper (6% for states, 10% for districts) and writes the files above. Total size is about 600 KB; only
projected SVG paths reach the browser.

**Before launch:** that repository states no licence and says its data was curated from public sources.
Confirm the terms, and compare the outline against Survey of India maps as required for maps of India.
Alternatives with explicit licences are datameet/maps (CC BY 2.5 IN, Census 2011 districts) and
geoBoundaries (CC BY 4.0); both need re-mapping of district names.

Statuses come from the `districts` table (see `supabase/migrations/`). Until any district has a status other
than `not_reached`, the site shows the concept's sample colours and labels them "Sample data".
