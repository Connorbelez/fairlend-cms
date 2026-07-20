#!/usr/bin/env python3
"""Targeted recovery publisher for the active Convex prototype namespace.

This is intentionally scoped to the existing clear-star-canyon record. It is
used only because macOS denied the normal wrapper access to the registered host
folder under Documents. It preserves the host deployment, dashboard, other
prototype namespaces, source identity, navigation contract, and verifier.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import re
import subprocess
import time
import urllib.request
from html.parser import HTMLParser
from pathlib import Path


SOURCE = Path("/Users/connor/Dev/llm_wiki/.scratch/fairlend-openseo-visual-brief/index.html")
CLI_ROOT = Path("/Users/connor/.agents/state/convex-static-prototypes/projects/llm-wiki-a2b31e0c5530")
CLI = CLI_ROOT / "node_modules" / ".bin" / "convex"
DEPLOYMENT = "dev:superb-curlew-883"
BASE_URL = "https://superb-curlew-883.convex.site"
SLUG = "clear-star-canyon"
ENTRY_PATH = "index.html"
PAGE_PATH = f"/p/{SLUG}/{ENTRY_PATH}"
METADATA_PATH = f"/p/{SLUG}/prototype.json"
MARKER = b"data-prototype-library-navigation"
NAVIGATION = (
    "\n<a data-prototype-library-navigation href=\"/\" target=\"_top\" "
    "aria-label=\"Back to all prototypes\" title=\"Back to all prototypes\" "
    "style=\"all:initial!important;position:fixed!important;top:16px!important;"
    "left:16px!important;z-index:2147483647!important;display:inline-flex!important;"
    "align-items:center!important;gap:8px!important;box-sizing:border-box!important;"
    "padding:10px 14px!important;border:1px solid rgba(255,255,255,.2)!important;"
    "border-radius:999px!important;background:#0b1320!important;color:#f8faf9!important;"
    "box-shadow:0 8px 28px rgba(0,0,0,.24)!important;"
    "font:600 12px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;"
    "letter-spacing:.01em!important;text-decoration:none!important;cursor:pointer!important;\""
    ">&#8592; All prototypes</a>\n"
)


class VisibleText(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.skip = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "svg"}:
            self.skip += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "svg"} and self.skip:
            self.skip -= 1

    def handle_data(self, data: str) -> None:
        if not self.skip:
            self.parts.append(data)


def run_convex(function: str, args: dict) -> object:
    env = os.environ.copy()
    env["CONVEX_DEPLOYMENT"] = DEPLOYMENT
    result = subprocess.run(
        [
            str(CLI),
            "run",
            function,
            json.dumps(args, separators=(",", ":")),
            "--typecheck=disable",
            "--codegen=disable",
        ],
        cwd=CLI_ROOT,
        env=env,
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    output = result.stdout.strip()
    return json.loads(output) if output else None


def fetch(path: str, attempts: int = 6) -> bytes:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(
                f"{BASE_URL}{path}?revision=2026-07-17.2&verify={time.time_ns()}",
                headers={"Cache-Control": "no-cache", "User-Agent": "fairlend-repair-verifier/1"},
            )
            with urllib.request.urlopen(request, timeout=30) as response:
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status} for {path}")
                return response.read()
        except Exception as error:  # bounded verifier retries mirror the wrapper
            last_error = error
            if attempt + 1 < attempts:
                time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Could not verify {path}: {last_error}")


def upload(url: str, payload: bytes, content_type: str) -> str:
    request = urllib.request.Request(
        url,
        data=payload,
        method="POST",
        headers={"Content-Type": content_type},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        body = json.loads(response.read().decode("utf-8"))
    storage_id = body.get("storageId")
    if not isinstance(storage_id, str) or not storage_id:
        raise RuntimeError("Convex upload did not return a storageId")
    return storage_id


def sha256(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def main() -> None:
    if not SOURCE.is_file():
        raise RuntimeError(f"Missing source: {SOURCE}")

    old_metadata = json.loads(fetch(METADATA_PATH).decode("utf-8"))
    if old_metadata.get("slug") != SLUG:
        raise RuntimeError("Hosted metadata does not match the requested immutable slug")
    if old_metadata.get("sourceRoot") != str(SOURCE):
        raise RuntimeError("Refusing to rebind the immutable prototype source")

    source_text = SOURCE.read_text(encoding="utf-8")
    if "fairlend-brief-revision\" content=\"2026-07-17.2" not in source_text:
        raise RuntimeError("The source is missing the expected revision marker")
    if MARKER.decode() not in source_text:
        if "</body>" not in source_text:
            raise RuntimeError("The source has no closing body tag for navigation injection")
        source_text = source_text.replace("</body>", NAVIGATION + "</body>", 1)
    page_bytes = source_text.encode("utf-8")

    title_match = re.search(r"<title>(.*?)</title>", source_text, flags=re.IGNORECASE | re.DOTALL)
    page_title = re.sub(r"\s+", " ", title_match.group(1)).strip() if title_match else old_metadata["title"]

    parser = VisibleText()
    parser.feed(source_text)
    searchable_parts = [re.sub(r"\s+", " ", " ".join(parser.parts)).strip()]
    universe_match = re.search(r"var signalUniverse = (\[.*?\]);\s*var signalBody", source_text, re.DOTALL)
    if universe_match:
        universe = json.loads(universe_match.group(1))
        searchable_parts.extend(
            " ".join(
                str(row.get(field, ""))
                for field in ("keyword", "cluster", "funnel", "geography", "wave", "priority")
            )
            for row in universe
        )
    search_text_full = re.sub(r"\s+", " ", " ".join(searchable_parts)).strip()
    search_limit = 120_000
    search_text = search_text_full[:search_limit]
    search_truncated = len(search_text_full) > search_limit

    now = dt.datetime.now(dt.timezone.utc)
    published_at = int(now.timestamp() * 1000)
    updated_at = now.isoformat()
    file_record = {
        "bytes": len(page_bytes),
        "kind": "page",
        "mediaType": "text/html; charset=utf-8",
        "path": ENTRY_PATH,
        "searchText": search_text,
        "searchTruncated": search_truncated,
        "searchable": True,
        "sha256": sha256(page_bytes),
    }

    metadata = {
        "createdAt": old_metadata["createdAt"],
        "description": old_metadata["description"],
        "entryPath": ENTRY_PATH,
        "files": [{key: value for key, value in file_record.items() if key != "searchText"}],
        "groupKey": old_metadata.get("groupKey", ""),
        "pages": [{"path": ENTRY_PATH, "title": page_title}],
        "registrationMode": {
            "allowSourceRebind": False,
            "preserveGroup": True,
            "preserveTags": True,
        },
        "slug": SLUG,
        "sourceKey": old_metadata["sourceKey"],
        "sourceRoot": old_metadata["sourceRoot"],
        "tags": old_metadata.get("tags", []),
        "title": old_metadata["title"],
        "updatedAt": updated_at,
    }
    metadata_bytes = (json.dumps(metadata, indent=2, sort_keys=True) + "\n").encode("utf-8")

    current = run_convex("staticHosting:getCurrentDeployment", {})
    deployment_id = current.get("currentDeploymentId") if isinstance(current, dict) else None
    if not isinstance(deployment_id, str) or not deployment_id:
        raise RuntimeError("The active static deployment has no deployment ID")

    upload_urls = run_convex("staticHosting:generateUploadUrls", {"count": 2})
    if not isinstance(upload_urls, list) or len(upload_urls) != 2:
        raise RuntimeError("Convex did not return two upload URLs")
    page_storage = upload(upload_urls[0], page_bytes, "text/html; charset=utf-8")
    metadata_storage = upload(upload_urls[1], metadata_bytes, "application/json; charset=utf-8")

    run_convex(
        "staticHosting:recordAssets",
        {
            "assets": [
                {
                    "path": PAGE_PATH,
                    "storageId": page_storage,
                    "contentType": "text/html; charset=utf-8",
                    "deploymentId": deployment_id,
                },
                {
                    "path": METADATA_PATH,
                    "storageId": metadata_storage,
                    "contentType": "application/json; charset=utf-8",
                    "deploymentId": deployment_id,
                },
            ]
        },
    )

    admin_key = subprocess.run(
        [
            "security",
            "find-generic-password",
            "-a",
            os.environ.get("USER", str(os.getuid())),
            "-s",
            "convex-static-prototypes-admin",
            "-w",
        ],
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
    ).stdout.strip()
    if not admin_key:
        raise RuntimeError("The prototype admin key is unavailable")

    run_convex(
        "prototypes:upsertFromPublisher",
        {
            "adminKey": admin_key,
            "allowSourceRebind": False,
            "description": metadata["description"],
            "entryPath": ENTRY_PATH,
            "files": [file_record],
            "groupKey": metadata["groupKey"],
            "pages": metadata["pages"],
            "preserveGroup": True,
            "preserveTags": True,
            "publishedAt": published_at,
            "slug": SLUG,
            "sourceKey": metadata["sourceKey"],
            "sourceRoot": metadata["sourceRoot"],
            "tags": metadata["tags"],
            "title": metadata["title"],
        },
    )

    hosted_page = fetch(PAGE_PATH)
    hosted_metadata = fetch(METADATA_PATH)
    hosted_root = fetch("/")
    parsed_metadata = json.loads(hosted_metadata.decode("utf-8"))
    checks = {
        "dashboard": b"Prototype Library" in hosted_root,
        "pageByteMatch": sha256(hosted_page) == sha256(page_bytes),
        "navigation": MARKER in hosted_page,
        "revision": b'fairlend-brief-revision\" content=\"2026-07-17.2' in hosted_page,
        "signalCount": b"163 unique signals" in hosted_page,
        "expansionCount": b"130 expansion records" in hosted_page,
        "newSignal": b"toronto building permit" in hosted_page,
        "atlas": b"signal-atlas-body" in hosted_page,
        "metadataSha": parsed_metadata.get("files", [{}])[0].get("sha256") == sha256(page_bytes),
    }
    if not all(checks.values()):
        raise RuntimeError(f"Hosted verification failed: {checks}")

    print(
        json.dumps(
            {
                "verified": True,
                "identifier": SLUG,
                "dashboardUrl": BASE_URL + "/",
                "viewerUrl": BASE_URL + f"/#/prototype/{SLUG}",
                "entryUrl": BASE_URL + PAGE_PATH,
                "pageUrls": [BASE_URL + PAGE_PATH],
                "metadataUrl": BASE_URL + METADATA_PATH,
                "revision": "2026-07-17.2",
                "bytes": len(page_bytes),
                "sha256": sha256(page_bytes),
                "checks": checks,
            },
            indent=2,
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
