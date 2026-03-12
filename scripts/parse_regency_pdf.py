#!/usr/bin/env python3
"""
Parse Regency Lucknow PDF: extract tests (name, category RD1/RD2/RD3/RD4, MRP),
apply discounts (RD1=25%, RD2=15%, RD3=10%, RD4=5%), output tests.json and
generate Shivanya_Regency_Price_List.pdf with Name, MRP, Special Price.
Usage:
  python parse_regency_pdf.py <path_to_regency_pdf>
  python parse_regency_pdf.py --txt <path_to_extracted_text.txt>
Requires: pypdf, reportlab (pip install pypdf reportlab)
"""

import re
import sys
import json
from pathlib import Path

# Discounts: RD1=25%, RD2=15%, RD3=10%, RD4=5%
DISCOUNT = {"RD1": 0.25, "RD2": 0.15, "RD3": 0.10, "RD4": 0.05}
DEPT_PATTERN = re.compile(
    r"\b(BIOCHEMISTRY|HEMATOLOGY|MICROBIOLOG|CLINICAL\s*PATHOLOGY|MOLECULAR|HISTOPATHOL|CYTOLOGY|Flowcytometry)\b",
    re.I,
)
RECORD_START = re.compile(r"^\d+\s+[\d/]+\s+(RD[1234])\s+", re.I)
# MRP: number at end of line after time (Same day, Next day, X days, X Hrs, etc.)
MRP_PATTERN = re.compile(r"(?:Same day|Next day|\d+\s*(?:days?|hours?|Hrs?|DAYS?|HOURS?)|4:00 PM)\s+(\d{2,6})\s*$", re.M)


def extract_text_from_pdf(pdf_path: str) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        return "\n".join(p.extract_text() or "" for p in reader.pages)
    except Exception as e:
        print(f"PDF read failed: {e}", file=sys.stderr)
        return ""


def parse_records(text: str):
    lines = text.split("\n")
    records = []
    i = 0
    while i < len(lines):
        line = lines[i]
        m = RECORD_START.search(line)
        if not m:
            i += 1
            continue
        cat = m.group(1).upper()
        rest = line[m.end() :]
        name_lines = [rest]
        j = i + 1
        while j < len(lines) and not RECORD_START.match(lines[j]) and "-- " not in lines[j]:
            name_lines.append(lines[j])
            j += 1
        block = " ".join(name_lines)
        # Test name: from start until department
        dept_match = DEPT_PATTERN.search(block)
        if dept_match:
            name = block[: dept_match.start()].strip()
        else:
            name = block.strip()
        name = re.sub(r"\s+", " ", name).strip()
        # MRP: last number in block that looks like price (after time phrase)
        numbers = MRP_PATTERN.findall(block)
        if not numbers:
            numbers = re.findall(r"\b(\d{2,6})\s*$", block)
        if not numbers:
            # last number anywhere in block (avoid codes like 1404 at start)
            all_nums = re.findall(r"\b(\d{3,6})\b", block)
            if all_nums:
                numbers = [all_nums[-1]]
        mrp = int(numbers[-1]) if numbers else 0
        if name and mrp > 0:
            discount = DISCOUNT.get(cat, 0)
            special = round(mrp * (1 - discount))
            records.append({"name": name, "category": cat, "mrp": mrp, "specialPrice": special})
        i = j
    return records


def generate_pdf(records: list, out_path: str):
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import mm
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
    except ImportError:
        print("reportlab not installed. Run: pip install reportlab", file=sys.stderr)
        return
    doc = SimpleDocTemplate(out_path, pagesize=A4, rightMargin=15 * mm, leftMargin=15 * mm, topMargin=15 * mm, bottomMargin=15 * mm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(name="Title", parent=styles["Heading1"], fontSize=14, spaceAfter=6)
    elements = []
    elements.append(Paragraph("Shivanya Lifecare Collection Center", title_style))
    elements.append(Paragraph("Regency Diagnostics – Test Price List (MRP & Special Price)", styles["Heading2"]))
    elements.append(Spacer(1, 6))
    # Table: S.No, Test Name, Category, MRP (₹), Special Price (₹)
    data = [["S.No", "Test Name", "Category", "MRP (₹)", "Special Price (₹)"]]
    for idx, r in enumerate(records, 1):
        data.append([str(idx), r["name"][:80] + ("..." if len(r["name"]) > 80 else ""), r["category"], str(r["mrp"]), str(r["specialPrice"])])
    t = Table(data, colWidths=[25, 220, 45, 55, 75])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0d5f7a")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("FONTSIZE", (0, 1), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 3),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    elements.append(t)
    doc.build(elements)
    print(f"PDF written: {out_path}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse_regency_pdf.py <path_to_regency_pdf>")
        print("   or: python parse_regency_pdf.py --txt <path_to_extracted_text.txt>")
        sys.exit(1)
    if sys.argv[1] == "--txt":
        if len(sys.argv) < 3:
            print("Provide path to .txt file after --txt")
            sys.exit(1)
        with open(sys.argv[2], "r", encoding="utf-8", errors="replace") as f:
            text = f.read()
    else:
        pdf_path = sys.argv[1]
        text = extract_text_from_pdf(pdf_path)
        if not text.strip():
            print("No text extracted from PDF. Install pypdf and try again.")
            sys.exit(1)
    records = parse_records(text)
    print(f"Parsed {len(records)} tests.")
    out_dir = Path(__file__).resolve().parent.parent
    json_path = out_dir / "tests.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print(f"JSON written: {json_path}")
    pdf_path = out_dir / "assets" / "Shivanya_Regency_Price_List.pdf"
    generate_pdf(records, str(pdf_path))
    print("Done.")


if __name__ == "__main__":
    main()
