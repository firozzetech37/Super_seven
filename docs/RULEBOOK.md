# Rulebook

The site carries two books: the official **English Pocket Rulebook** (the original, language 01 and the default on
`/rules/rulebook`) and the **multilingual rulebook** (sixteen translations of it, languages 02–17).

## English Pocket Rulebook

`public/documents/sscfi-rulebook-english.pdf` is SSCFI's English Pocket Rulebook (83 pages: preface, Rules 1–40,
glossary from page 76; page 83 is a blank back cover). It is built from the file SSCFI supplied by
`python3 -I scripts/rulebook/build-english.py "<source.pdf>"`, which

- sets each page's visible area (CropBox) to the drawn pocket-page frame, because the source puts a small landscape page
  in the middle of an A4 sheet; nothing on the page is changed or removed, and the MediaBox is kept;
- finds the page of every rule from its "RULE n :" heading and writes `src/data/rulebook-english.json` with the official
  headings (title case);
- renders `public/documents/rulebook/english.webp` (Rule 1) as the phone preview.

Points for the Technical Committee's next edition (the website shows the text as supplied):

- Several cross-references use an older numbering: Rule 16.6 cites "rule 22 (No Ball), 23 (Wide Ball) 39.1 (Fielding
  the Ball)" (now 21, 22 and 38.1); Rule 5.12 cites "Rule 19.5 (Correctness of Result)" (now 18.5); Rule 12's note says
  "the above rule 13"; Rule 24.3 cites 33/37/36 for Hit Wicket/Stumped/Run Out (now 32/36/35); Rules 21 and 22 cite
  31, 32, 33, 35, 37 for dismissals numbered 30, 31, 32, 34, 36.
- The preface is signed "Chairman, Technical Committee ISSCO", the federation's older name.
- The rain-rule target table (page 30) is a low-resolution scan; its figures are hard to read.
- Rule 5 has two items numbered 12; printed page number 37 appears twice; typos such as "dipper" (deprive),
  "intentially", "Karry Packers".

## Multilingual rulebook

`public/documents/sscfi-multilingual-rulebook.pdf` is the SSCFI Multilingual Super Seven Cricket Rulebook (173 pages,
16 languages, 40 rules each, translated from the English Pocket Rulebook; submitted for Technical Committee review).

`src/data/rulebook.json` holds, for every language, its start and end page and the native title and page of each of
the 40 rules. It was generated from the PDF's own bookmarks (pypdf, `reader.outline`), so page numbers match the
file exactly. `public/documents/rulebook/*.webp` are 720 px renders of each language's first page (pymupdf), used as
previews on phones and in the page fan.

One heading is missing in the PDF: Marathi rule 22 (Wide ball) has no bookmark because its heading was set as a
continuation paragraph on page 52. The JSON carries it as `inferred: true` on page 52 with the English title, and the
site says "Heading missing in the PDF" next to it. Worth fixing in the next edition.

To update after a new edition: replace the PDF, rerun the extraction (bookmarks → JSON, first pages → webp), and
check `rulebookReviewRecordPage` in `src/lib/data/rulebook.ts`.
