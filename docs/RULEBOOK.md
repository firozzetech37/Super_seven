# Multilingual rulebook

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
