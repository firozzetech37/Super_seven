"""Prepare the English Pocket Rulebook for the website.

Usage:  python3 -I scripts/rulebook/build-english.py "/path/to/rule book pocket size.pdf"

Writes
  public/documents/sscfi-rulebook-english.pdf  the PDF with each page's visible area set to the drawn pocket-page frame
                                               (the A4 sheets are mostly white margin; text and drawings are untouched)
  src/data/rulebook-english.json               page of every rule (found from the "RULE n :" headings) and the glossary
  public/documents/rulebook/english.webp       720 px preview of the first rules page, for phones

Needs PyMuPDF (fitz) and Pillow.
"""

import io
import json
import re
import sys
from pathlib import Path

import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]

# The official headings of the Pocket Rulebook, in title case (rule 9 has two parts: (A) the field, (B) the pitch).
TITLES = {
    1: "The Teams", 2: "Substitutes", 3: "Runner", 4: "Fielder Leaving the Field", 5: "The Umpires", 6: "The Scorers",
    7: "The Ball", 8: "The Bat", 9: "The Field of Play and the Pitch", 10: "The Wicket",
    11: "The Bowling, Popping and Return Creases", 12: "Rolling, Sweeping and Re-marking of Creases", 13: "Innings",
    14: "Covering the Pitch", 15: "Start of Match", 16: "Scoring", 17: "Boundaries", 18: "The Result", 19: "The Over",
    20: "Dead Ball", 21: "No Ball", 22: "Wide Ball", 23: "Bye and Leg-Bye", 24: "Appeals", 25: "The Wicket is Down",
    26: "Batsman Out of His Ground", 27: "Bowled", 28: "Timed Out", 29: "Caught", 30: "Handled the Ball",
    31: "Hit the Ball Twice", 32: "Hit Wicket", 33: "Leg Before Wicket", 34: "Obstructing the Field", 35: "Run Out",
    36: "Stumped", 37: "The Wicket-Keeper", 38: "The Fielder", 39: "Unfair Play", 40: "Protest",
}


def frame(page: fitz.Page) -> fitz.Rect | None:
    """The largest drawn rectangle on the page: the border of the pocket-size page."""
    rects = [d["rect"] for d in page.get_drawings() if d["rect"].width > 150 and d["rect"].height > 150]
    return max(rects, key=lambda r: r.width * r.height) if rects else None


def main(source: str) -> None:
    doc = fitz.open(source)
    rule_pages: dict[int, int] = {}
    glossary_page = None
    last_text_page = 0
    for i, page in enumerate(doc):
        text = page.get_text()
        if text.strip():
            last_text_page = i + 1
        for m in re.finditer(r"RULE\s*(?:No\.)?\s*(\d{1,2})\s*:", text):
            rule_pages.setdefault(int(m.group(1)), i + 1)
        if glossary_page is None and "GLOSSARY" in text:
            glossary_page = i + 1
        box = frame(page)
        if box:
            page.set_cropbox((box + (-4, -4, 4, 4)) & page.mediabox)

    missing = [n for n in TITLES if n not in rule_pages]
    if missing:
        sys.exit(f"Rule headings not found for: {missing}")

    out_pdf = ROOT / "public/documents/sscfi-rulebook-english.pdf"
    doc.save(out_pdf, garbage=3, deflate=True)

    data = {
        "source": "English Pocket Rulebook of Super Seven Cricket (Technical Committee); the original the multilingual edition was translated from",
        "pages": doc.page_count,
        "page": 1,
        "endPage": last_text_page,
        "glossaryPage": glossary_page,
        "rules": [{"n": n, "title": TITLES[n], "page": rule_pages[n]} for n in sorted(TITLES)],
    }
    (ROOT / "src/data/rulebook-english.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")

    first_rules_page = doc[rule_pages[1] - 1]
    zoom = 720 / first_rules_page.rect.width
    pix = first_rules_page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    thumb = ROOT / "public/documents/rulebook/english.webp"
    img.save(thumb, "WEBP", quality=82)

    print(f"pdf: {out_pdf.relative_to(ROOT)} ({out_pdf.stat().st_size // 1024} KB, {doc.page_count} pages)")
    print(f"json: rules 1-40, glossary p.{glossary_page}, text ends p.{last_text_page}")
    print(f"thumb: {thumb.relative_to(ROOT)} {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    main(sys.argv[1])
