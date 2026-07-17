#!/usr/bin/env python3
"""Render the campaign DOCX into complete, source-ordered Markdown.

The output is intentionally mechanical: every non-empty paragraph and every
table cell from the DOCX body is represented once, in source order. This gives
the field-manual renderer a complete textual corpus while retaining semantic
headings, native lists, emphasis, callouts, and tables.
"""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path

from docx import Document
from docx.oxml.ns import qn
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


def inline_markdown(paragraph: Paragraph) -> str:
    pieces: list[str] = []
    for run in paragraph.runs:
        text = run.text.replace("\n", " ")
        if not text:
            continue
        text = text.replace("\\", "\\\\")
        if run.bold and run.italic:
            text = f"***{text}***"
        elif run.bold:
            text = f"**{text}**"
        elif run.italic:
            text = f"*{text}*"
        pieces.append(text)
    rendered = "".join(pieces).strip()
    return rendered or paragraph.text.strip()


def numbering_formats(doc: Document) -> dict[int, str]:
    numbering = doc.part.numbering_part.element
    abstract_formats: dict[int, str] = {}
    for abstract in numbering.findall(qn("w:abstractNum")):
        abstract_id = int(abstract.get(qn("w:abstractNumId")))
        level = abstract.find(qn("w:lvl"))
        fmt = level.find(qn("w:numFmt")) if level is not None else None
        abstract_formats[abstract_id] = fmt.get(qn("w:val")) if fmt is not None else "bullet"

    formats: dict[int, str] = {}
    for num in numbering.findall(qn("w:num")):
        num_id = int(num.get(qn("w:numId")))
        abstract = num.find(qn("w:abstractNumId"))
        if abstract is not None:
            formats[num_id] = abstract_formats.get(int(abstract.get(qn("w:val"))), "bullet")
    return formats


def list_prefix(paragraph: Paragraph, formats: dict[int, str]) -> str | None:
    p_pr = paragraph._p.pPr
    num_pr = p_pr.numPr if p_pr is not None else None
    if num_pr is None or num_pr.numId is None:
        return None
    fmt = formats.get(int(num_pr.numId.val), "bullet")
    return "1. " if fmt == "decimal" else "- "


def escape_cell(text: str) -> str:
    return " ".join(text.split()).replace("|", "\\|")


def render_table(table: Table) -> list[str]:
    width = max((len(row.cells) for row in table.rows), default=0)
    if width <= 1:
        lines: list[str] = []
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    text = inline_markdown(paragraph)
                    if text:
                        lines.append(f"> {text}")
        return lines

    rows: list[list[str]] = []
    for row in table.rows:
        values = [escape_cell(cell.text) for cell in row.cells]
        values += [""] * (width - len(values))
        rows.append(values)
    if not rows:
        return []

    rendered = ["| " + " | ".join(rows[0]) + " |"]
    rendered.append("| " + " | ".join(["---"] * width) + " |")
    rendered.extend("| " + " | ".join(row) + " |" for row in rows[1:])
    return rendered


def render_document(source: Path) -> tuple[str, dict[str, int]]:
    doc = Document(source)
    formats = numbering_formats(doc)
    lines: list[str] = [
        "# Complete campaign proposal",
        "",
        "> **Source fidelity note:** The content below is a source-ordered textual edition of the approved DOCX. Every non-empty body paragraph and every table cell is represented once. Presentation-only pagination is intentionally omitted.",
        "",
        f"> **Original DOCX SHA-256:** `{hashlib.sha256(source.read_bytes()).hexdigest()}`",
        "",
    ]
    counts = {"paragraphs": 0, "tables": 0, "table_cells": 0, "words": 0}

    heading_map = {
        "Title": "# ",
        "Heading 1": "## ",
        "Heading 2": "### ",
        "Heading 3": "#### ",
        "Heading 4": "##### ",
    }

    for child in doc.element.body.iterchildren():
        if isinstance(child, CT_P):
            paragraph = Paragraph(child, doc)
            text = inline_markdown(paragraph)
            if not text:
                continue
            counts["paragraphs"] += 1
            counts["words"] += len(paragraph.text.split())
            style = paragraph.style.name if paragraph.style else "Normal"
            prefix = heading_map.get(style)
            if prefix:
                lines.extend([f"{prefix}{text}", ""])
                continue
            prefix = list_prefix(paragraph, formats)
            if prefix:
                lines.append(f"{prefix}{text}")
            else:
                lines.extend([text, ""])
        elif isinstance(child, CT_Tbl):
            table = Table(child, doc)
            counts["tables"] += 1
            counts["table_cells"] += sum(len(row.cells) for row in table.rows)
            counts["words"] += sum(len(cell.text.split()) for row in table.rows for cell in row.cells)
            lines.extend(render_table(table))
            lines.append("")

    return "\n".join(lines).rstrip() + "\n", counts


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    markdown, counts = render_document(args.source)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(markdown, encoding="utf-8")
    print({"source": str(args.source), "output": str(args.output), **counts})


if __name__ == "__main__":
    main()
