# sscfi.org — Current Website Audit
Audited 28 Oct 2026 using headless Chrome (DOM dumps + full-page screenshots) and PDF text extraction.
Raw material: `dom/*.html` (page source), `shots/*.png` (screenshots), `pdfs/` + `pdfpages/` (all 8 PDFs, rendered + text).

---

## 1. Overview

| Item | Finding |
|---|---|
| Organisation | Super Seven Cricket Federation of India (SSCFI). Founded 2003 by Mr. M. N. Abbasi. Registered society no. 521/2003-04 (Societies Registration Act 1860). |
| Regd. office | T-II-9, Staff Colony, Judges Court Compound, Near Natraj Hotel, Bulandshahr (U.P.) 203001 |
| Site type | Static HTML (9 pages) + 8 PDFs. No CMS, no database. |
| Built | 2014 by Mothers InfoSystems Pvt. Ltd. on the ThemeForest template **"Nova" by ansimuz** (template credits still in the HTML, logo alt text is still "Nova"). |
| Last content update | One media image dated 27-08-2016. Everything else is June–Sept 2014. Footer says © 2014. |
| Server | Apache. Returns HTTP 406 to non-browser user agents (curl/bots). |
| Front-end stack | jQuery 1.5.1, jQuery UI 1.8.13, Nivo Slider, Superfish dropdown menu, Fancybox 1.3.4, prettyPhoto, Quicksand (filter), jquery.tweet, poshytip tooltips, jquery.cycle, scrollTo, DD_belatedPNG + html5shim (IE8 hacks). Google Font "Ubuntu" for headings, Arial for body. |
| Back-end | Two PHP mail scripts: `sendemail.php` (contact form) and `newssend.php` (newsletter). Both respond (blank body on GET), so PHP is enabled on the host. |
| Layout | Fixed **966px** wrapper, centred, dark (#363636) card on a stadium photo background (`img/one.jpg`). No viewport meta, **no media queries → not mobile responsive** (mobile screenshot shows the page cut off at ~390px). |
| Colours | Header/wrapper #363636, nav bar #0099FF (links black, active = dark pill with white text), content links #37b2d1, headline/footer links #FFD800, page bg #f1f1f1, footer text #bbbaba. |
| SEO / analytics | No meta description/keywords, no Open Graph, no analytics, no sitemap (robots.txt points to 3 sitemap URLs that all 404). Google has nothing indexed for the domain. |
| Related domains | PDFs and all e-mail addresses use **sscfi.in** — that domain no longer resolves (DNS NXDOMAIN). Partner link abbasicricketacademy.in also does not resolve. |

---

## 2. Page inventory (sitemap)

| # | URL | Page title | Status | What's on it |
|---|---|---|---|---|
| 1 | `/index.html` | Home \| SSCFI | Live | Twitter widget (broken), 6-slide Nivo slider, 2 umpire cards, 4 match cards (25 June 2014), hidden tab block with template leftovers |
| 2 | `/teams.html` | Teams \| SSCFI | Live | NCL S7 2014 (Amroha) programme: 24 team names, format, schedule |
| 3 | `/advisorycommittee.html` | — | **404** | Linked from the Teams dropdown and Quick Links, page doesn't exist |
| 4 | `/fixture-hyderabad.html` | FIXTURE \| SSCFI | Placeholder | "Comming Soon...." |
| 5 | `/results-amroha.html` | Results \| SSCFI | Live | 1 photo + 4 PDF links (league, QF, SF, final results) |
| 6 | `/results-hyderabad.html` | Results \| SSCFI | Placeholder | "Comming Soon...." |
| 7 | `/media.html` | Media \| SSCFI | Live | Press-clipping gallery: 44 thumbnails (20 duplicated), year filter buttons (non-functional) |
| 8 | `/pictures.html` | Pictures \| SSCFI | Live | Photo gallery: 43 thumbnails (36 unique), Fancybox lightbox, no captions |
| 9 | `/office-bearer.html` | Contact \| SSCFI (wrong title) | Live | Table of 9 office bearers with photos, 3 with full contact details |
| 10 | `/contact.html` | Contact \| SSCFI | Live | Enquiry form (PHP mail) + 2 contact persons |

PDFs (all live, all 2014):

| File | Pages | Content |
|---|---|---|
| `images/SSCFI-Team.pdf` | 5 | "SSCFI State Officials": 9 state associations with president/secretary names + photos |
| `images/FIXTURE.pdf` | 2 | NCL S7 2014 fixture: 8 groups (A–H) of 3 teams, knockout tree |
| `images/HIGHLIGHTS-RULES-SUPER-SEVEN-CRICKET.pdf` | 1 | Rules of Super Seven cricket |
| `images/Registration-Form-SSCFI.pdf` | 2 | Registration-cum-entry form for state teams (12 players + manager + coach) |
| `images/NCL-S7-League-Matches-Results.pdf` | 3 | League results 22–24 June 2014 (24 matches incl. walkovers) |
| `images/NCL-S7-Result-Quarter-Final.pdf` | 1 | 4 QF results with top scorers + man of the match |
| `images/NCL-S7-Result-Sami-Final.pdf` | 1 | 2 SF results |
| `images/NCL-S7-Result-Final.pdf` | 1 | Final: UP Host beat Mumbai 111 vs 52, MoM Jitendra |

---

## 3. Global elements (same on every page)

**Header**: logo (round "7 / INDIA" badge) + "SUPER SEVEN CRICKET FEDERATION OF INDIA" wordmark, linked to home. Top-right social icons: Facebook (facebook.com/pages/SSCFI/1422244844712722), Twitter (@super7cricket), YouTube (channel UCyNNnTrBD7oGIBA94QYCkiQ — live, named "Super Seven Cricket Federation of India").

**Main navigation** (blue bar, Superfish hover dropdowns):
- HOME → index.html
- TEAMS → teams.html
  - Advisory Committee → advisorycommittee.html (404) *(only in the home-page menu)*
  - SSCFI State Officials → SSCFI-Team.pdf
- FIXTURE (no page)
  - NCL S7 – Amroha → FIXTURE.pdf
  - NCL S7 – Hyderabad → fixture-hyderabad.html (coming soon)
- RESULTS (no page)
  - NCL S7 – Amroha → results-amroha.html
  - NCL S7 – Hyderabad → results-hyderabad.html (coming soon)
- MEDIA → media.html
- PICTURES → pictures.html
- RULES → HIGHLIGHTS-RULES-SUPER-SEVEN-CRICKET.pdf
- ABOUT (no page)
  - Office Bearer → office-bearer.html
  - Contact Us → contact.html
  - Registration Form → Registration-Form-SSCFI.pdf
- NEWS LETTERS → not a page: clicking it fades in a blue popup box ("Submit your E-Mail" + email field + Submit, posts to newssend.php). It auto-hides after 10 seconds.
- Search box (right of nav) → `action="#"`, does nothing.

**Footer** (dark, 3 columns):
1. *About Us* — one paragraph (founded 2003 by M.N. Abbasi, promote cricket for men & women from grassroots, "Super Seven presents cricket as never experienced before… Golden Opportunity for every cricketer").
2. *Quick Links* — Home, Teams, (Advisory Committee on home only), Fixture Amroha, Fixture Hyderabad, Results Amroha, Results Hyderabad, Media, Pictures, Rules, Office Bearer, Contact Us.
3. *News* — a `<marquee>` scrolling upward with the same item 3 times: "Hyderabad National Cricket League Super 7 (Under 23), starting on September 24th to 28th.." (links to #). Renders blank in headless capture.
- Abbasi Cricket Academy logo → abbasicricketacademy.in (dead domain).
- "© 2014 SSCFI All Rights Reserved." + "Website Designed by Mothers InfoSystems Pvt. Ltd." + back-to-top button.

---

## 4. Page-by-page details

### Home (`index.html`)
1. **Twitter block** — `jquery.tweet.js` calling the dead Twitter v1 API with the template's default handle `ansimuz`, plus a "Tweets by @super7cricket" embed. Renders as a bare link; effectively broken.
2. **Slider** — Nivo slider, 6 images `images/slide1.jpg … slide6.jpg` (event photos: officials seated, team line-ups, award ceremonies). Each slide links to `#`, no captions, auto-rotates.
3. **Umpires** — 2 cards: Anil Kumar (Umpire, Uttarakhand) and Kuldeep Nagar (Umpire, "Utter Pradesh"). Names link to `#`.
4. **Match cards** — 4 cards with photo + title + "Match Details": Semi Final Match-1 (6 PM), Semi Final Match-2 (7 PM), Third Place Match (8 PM), Final Match (9 PM); all "25th June 2014, ACG, Amroha, UP". Links go to `#`.
5. **Hidden template block** — a tab set ("Picture Gallery / Videos / Information / Tab four / Last tab") containing two YouTube embeds (`watch?v=6Wii5Uk06GY`, `embed/PBvO4R8qe2s`), "Lorem ipsum dolor" headings and filler text, and a leftover link to `single.html` (not on the server). Appears to be hidden/non-visible in the rendered page.
6. Footer as above.

### Teams (`teams.html`)
- Sub-heading links: "SSCFI State Officials" (PDF).
- "Programme Schedule of the National Cricket League Super 7 (NCL S7) 2014 in Amroha, Uttar Pradesh".
- Table of 24 team names: Uttar Pradesh, Saurashtra, Chhatisgarh, Madhya Pradesh, Punjab, Haryana, Abbasi Cricket Academy, Islamic Culture Centre, Uttrakhand, Chandigarh, Pudducherry, Mumbai Asso., NCR (Red), Uttar Pradesh (Host), West Bengal, Karnataka, Rajasthan Asso., Gujarat, Delhi, NCR (Blue), Andhra Pradesh, Tamilnadu, Maharashtra, Rajasthan Academy.
- Format: 8 groups by draw, 1 team per group to quarter-final.
- Schedule: Venue ACG Amroha, 22–25 June; 7–11 AM 4 matches, 6–10 PM 5 matches; League 24, QF (blank), SF 2, 3rd place 1, Final 1, total 32.
- "21st June 2014 Night a friendly match b/w Secretary 11 and President 11".

### Fixture Hyderabad / Results Hyderabad
- Heading + "Comming Soon...." only.

### Results Amroha (`results-amroha.html`)
- "Know Your Results…." / "ABBASI NATIONAL CRICKET LEAGUE SUPER 7 Amroha,(UP) – June 2014 RESULTS".
- Winner photo (Final-Match.jpg) + 4 PDF links. Link hrefs use Windows backslashes (`images\NCL-S7-…pdf`); browsers normalise `\` to `/`, so they work in Chrome/Firefox/Safari but are technically wrong.

### Media (`media.html`)
- Heading "Media | Super 7 Cricket".
- Year filter pills: All, 2003, 2004, 2005, 2006, 2008, 2009, 2014 — all `href="#"`, Quicksand filter never wired up, so clicking does nothing.
- 44 press-clipping thumbnails (newspaper cuttings, mostly Hindi press) from `img/media in/<year>/`, full images in `img/media/<year>/`, opened in Fancybox. Years: 2003 (6), 2004 (3), 2005 (3), 2006 (3), 2008 (3), 2009 (2) — these 20 appear **twice**; 2014 (21, captioned 21–27 June); 2016 (1); 2 untitled. Alt text "Pic" on everything.

### Pictures (`pictures.html`)
- Heading "Gallery | Super 7 Cricket".
- 43 thumbnails (`img/picture in/`) → full images (`img/picture/picture*.jpg|png`), Fancybox `rel="group1"` gallery, every title "SSCFI". 36 unique images; picture26–32 are duplicated. No albums, no captions.

### Office Bearer (`office-bearer.html`)
- Title tag wrongly says "Contact | SSCFI"; heading "Contact Us :".
- 3-column table (Designation / Name & Contact / Picture), 9 rows:

| Designation | Name | Contact |
|---|---|---|
| President | Mr. M. N. Abbasi | F-30, Green Park Main, New Delhi 110016 · +91-9810033346 · president@sscfi.in |
| Senior Vice President | Mr. Feroz Abbasi | Abbasi Cricket Ground (ACG), Amroha (U.P.) 244221 · +91-9810245768 · sr.vicepresident@sscfi.in |
| Secretary General | Mr. Shri Kant Sharma | T-II-9, Staff Colony, Judges Court Compound, Near Natraj Hotel, Bulandshahr (U.P.) · +91-9319916335, +91-879101359 (digit missing; PDF says 8791013599) · secretary@sscfi.in, isscosk@gmail.com |
| Chairman, Organizing Committee | Mr. Aslam Farooqui | — |
| Chairman, Technical Committee | Mr. Umesh Kumar Goel | — |
| Deputy Chairman, Technical Committee | Mr. Nepal Singh | — |
| Public Relation Officer | Mr. Satyapal Singh | — |
| Scorer | Mr. Pawan Kumar | — |
| Senior Umpire | Mr. Rajesh Sharma | — |

Photos: `img/Photos 1.jpg … Photos 9.jpg`.

### Contact (`contact.html`)
- Heading "Contact Us :", sub-heading "Enquiry".
- Form `#contactForm` → `POST sendemail.php` (multipart). Fields: `name` (text, required), `mobile` (text, required), `email` (email, required), `msg` (textarea, required). Button "Send Message". HTML5 `required` only, no captcha, no JS validation, no success page seen.
- Right column: Mr. Feroz Abbasi (Sr. Vice President; B.Com (Hons) SRCC Delhi University, Leadership Programme IIM-A; +91.9810245768; sr.vicepresident@sscfi.in, abbasicricket@gmail.com) and Mr. Shrikant Sharma (Secretary General; +91.9319916335; secretary@sscfi.in, isscosk@gmail.com).
- No postal address, no map.

---

## 5. PDF content (data to migrate into real pages)

**Rules (Super Seven cricket)** — 7 players a side; 7 overs each side (6 players except keeper bowl 1 over each, 7th over by any of those 6); 6 balls/over; pitch 5 ft wide either side of centre line; ball 155–165 g, 22–23 cm; match time 2 hours; no-ball = 2 runs, after 3 in an over every further no-ball = 4; wide = same; bouncers not allowed (no-ball 2 runs, after 1 bouncer/over each further = 4 runs); category men & women; team colour as per state.

**State Officials** — 9 state units: Punjab (Pres. Jasvinder Singh Gill, Hony Gen Sec Prem Singh), Andhra Pradesh (Pres. Jagan Mohan Metla), Chhattisgarh (Sec. Mohan Kumar), Delhi (Pres. Shyam Sunder, Gen Sec Mrs Rekha Sharma), Mumbai (Pres. Madan Singh Parmar, Sec. Ramdas Chitre), Bengal (Pres. Asim Kr. Niyogi, Hony Gen Sec Kishan C. Dikpati), Maharashtra (Sec. Dr Suraj Yeotikar), Uttarakhand (Sec. Dr Nagendra Sharma), Gujarat (Pres. Dipak Mayani). With photos.

**Fixture NCL S7 2014** — Groups A–H (3 teams each) as listed on the Teams page; QF1 A v B, QF2 C v D, QF3 E v F, QF4 G v H; SF1 QF1 v QF3, SF2 QF2 v QF4; 3rd place; final. Signed Umesh Kumar Goel, Chairman Tech. Committee. Letterhead: website www.sscfi.in, mobile 9319916335 / 8791013599.

**Results NCL S7 2014** — 24 league matches 22–24 June (8 walkovers, 1 tie Gujarat v Karnataka 88–88); QF: Saurashtra bt UP 88–86, Mumbai bt Uttarakhand 74/3–70, UP Host bt NCR Red 116–84/5, NCR Blue bt Delhi 107–99; SF: UP Host bt Saurashtra 123–88, Mumbai bt NCR Blue 72–71; **Final: UP Host bt Mumbai 111–52, Man of the Match Jitendra**.

**Registration-cum-Entry Form** — letterhead (secretarial office, fax +91-5732-234502, mobiles, emails, www.sscfi.in; President / Sr VP / Secretary General addresses); fields: State/Unit Association, Section (Men/Women/Boys/Girls), Category (Sr/Youth/Jr/Sub-Jr), Championship name, date, venue; 12 players + Manager + Coach (Name, Father's Name, DOB); signatures of Manager, Coach, Captain; declaration by Secretary with seal.

---

## 6. Problems found (don't carry these over)

1. Not responsive (fixed 966px, no viewport meta, no media queries). Unusable on phones.
2. Dead/placeholder links: Fixture, Results, About parents → `#`; all slider, umpire, match-card and news links → `#`; search box does nothing; year filter on Media does nothing.
3. `advisorycommittee.html` is a 404 from the nav and footer.
4. Two "Coming Soon" pages (Fixture Hyderabad, Results Hyderabad) since 2014.
5. Twitter widget calls the retired Twitter v1 API with the template author's handle; renders nothing.
6. Template leftovers: hidden "Lorem ipsum" tab block, `single.html` link, ThemeForest credit links, logo alt "Nova", "Tab four / Last tab".
7. Duplicate content: 20 media images listed twice, 7 pictures listed twice, news item repeated 3× inside a `<marquee>`.
8. Wrong titles: office-bearer page titled "Contact"; headings alternate "SSCFI" / "Super 7 Cricket".
9. Typos: "Comming Soon", "grass routes", "Utter Pradesh", "22th", "Sami-Final", "Chhatisgarh", "Uttrakhand", "Pudducherry", "Asso.".
10. Windows backslash paths in hrefs/srcs (`images\…`, `img\match\…`); folder names with spaces (`img/media in/`, `img/picture in/`, `img/Photos 1.jpg`).
11. Mixed content: http:// Google Fonts, html5shim from a dead googlecode URL, YouTube embed via `watch?v=` (won't embed).
12. Contact form has no spam protection and no confirmation UX; newsletter popup auto-closes in 10 s with no feedback.
13. All data is 2014; copyright 2014; e-mail domain sscfi.in and partner domain abbasicricketacademy.in no longer resolve.
14. Accessibility: social icons have no text, image alts are "Pic"/"Post"/"An image".
15. No SEO meta, no sitemap (robots.txt points to 404s), no analytics, no favicon check.
16. Legacy libraries (jQuery 1.5.1 from 2011, Fancybox 1.3.4) with known vulnerabilities.

---

## 7. What the new site needs to cover (functional map from the old site)

Content types the old site carries, which the new one must model properly instead of as PDFs/static HTML:
- **Tournaments / events** (NCL S7 Amroha 2014, NCL S7 Hyderabad U-23) → each with teams, groups, fixtures, results, gallery.
- **Teams** (24 participating teams; 9+ state associations with officials).
- **Fixtures** (match no., group/stage, team A v team B, date, time, venue).
- **Results** (scores, wickets, winner, walkover/tie, top scorers, man of the match).
- **Officials**: federation office bearers (9), state officials (9 units), umpires (2 shown).
- **Media / press clippings** by year; **photo gallery** by event.
- **Rules** page (currently PDF).
- **Registration** (currently a paper PDF form → candidate for an online form).
- **News / announcements** (currently a marquee).
- **Newsletter signup** and **contact/enquiry form** (currently PHP mail).
- **Social links** (FB, Twitter/X, YouTube) and partner logo (Abbasi Cricket Academy).
- **About** (history since 2003, founder M. N. Abbasi, registration details).
