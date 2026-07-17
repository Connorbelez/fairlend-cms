#!/usr/bin/env python3
from pathlib import Path

from playwright.sync_api import sync_playwright


URL = "http://127.0.0.1:8765/"
OUTPUT = Path("artifacts/backyards-for-canadians-visual-report/qa")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless=True,
        )
        for label, width, height, scheme in [
            ("desktop-light", 1440, 1000, "light"),
            ("desktop-dark", 1440, 1000, "dark"),
            ("mobile-light", 390, 844, "light"),
            ("mobile-dark", 390, 844, "dark"),
        ]:
            context = browser.new_context(
                viewport={"width": width, "height": height},
                color_scheme=scheme,
                device_scale_factor=1,
            )
            page = context.new_page()
            errors: list[str] = []
            page.on(
                "console",
                lambda message: errors.append(f"console:{message.type}:{message.text}")
                if message.type == "error"
                else None,
            )
            page.on("pageerror", lambda error: errors.append(f"page:{error}"))
            page.goto(URL, wait_until="networkidle", timeout=60_000)
            page.evaluate("document.fonts && document.fonts.ready")
            page.wait_for_timeout(2_500)
            metrics = page.evaluate(
                """() => ({
                    title: document.title,
                    headings: document.querySelectorAll('h1,h2,h3,h4').length,
                    tables: document.querySelectorAll('table').length,
                    mermaidSvgs: document.querySelectorAll('.mermaid svg').length,
                    navLinks: document.querySelectorAll('nav a').length,
                    hasAllConcepts: [
                      'Homes for neighbours, not tourists',
                      'Canada needs hosts',
                      'Backyards for Canadians',
                      'Build wealth. Build housing.',
                      'One backyard. One more Toronto home.'
                    ].every(text => document.body.innerText.includes(text)),
                    hasFullCopyLibrary: document.body.innerText.includes('Complete original copy library'),
                    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
                    scrollWidth: document.documentElement.scrollWidth,
                    clientWidth: document.documentElement.clientWidth,
                    textChars: document.body.innerText.length
                })"""
            )
            page.screenshot(path=str(OUTPUT / f"{label}-hero.png"), full_page=False)
            target = page.get_by_text("Concept 3 — Backyards for Canadians", exact=False).first
            if target.count():
                target.scroll_into_view_if_needed()
                page.wait_for_timeout(250)
                page.screenshot(path=str(OUTPUT / f"{label}-concept.png"), full_page=False)
            results.append({"label": label, "metrics": metrics, "errors": errors})
            context.close()
        browser.close()

    for result in results:
        print(result)
    failed = any(
        result["errors"]
        or result["metrics"]["horizontalOverflow"]
        or not result["metrics"]["hasAllConcepts"]
        or not result["metrics"]["hasFullCopyLibrary"]
        or result["metrics"]["mermaidSvgs"] < 1
        for result in results
    )
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
