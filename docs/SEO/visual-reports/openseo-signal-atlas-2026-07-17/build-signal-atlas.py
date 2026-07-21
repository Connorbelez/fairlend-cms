#!/usr/bin/env python3
"""Normalize both governed keyword research waves for the visual signal atlas."""

from __future__ import annotations

import csv
import json
from pathlib import Path


TRIAL = Path(
    "/Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/"
    "trial-2026-07-16/deliverables/keyword-universe.csv"
)
EXPANSION = Path(
    "/Users/connor/Dev/fairlend-cms/docs/SEO/research/openseo/"
    "expansion-2026-07-17/deliverables/keyword-universe.csv"
)

TRIAL_SYSTEMS = {
    "five-plus-unit-multiplex-mli-select": (
        "5+ multiplex / MLI Select financing",
        "Program guide + five-plus decision path + takeout-readiness system",
        "P1",
    ),
    "drawflow-builder-financing": (
        "Construction draws / DrawFlow",
        "Draw mechanics + cash-flow toolkit + financing qualification",
        "P1",
    ),
    "garden-laneway-suite-financing": (
        "Garden & laneway suite financing",
        "Feasibility education + financing destination",
        "P1",
    ),
    "b2b-partner-referral": (
        "Professional partner referrals",
        "Partner readiness guide + governed referral pathway",
        "P2",
    ),
}


def rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def number(value: str | None) -> float | int | None:
    if value in (None, ""):
        return None
    parsed = float(value)
    return int(parsed) if parsed.is_integer() else parsed


def trial_item(row: dict[str, str]) -> dict[str, object]:
    system, page_type, priority = TRIAL_SYSTEMS[row["workstream"]]
    funnel = "buying-signal" if row["funnelHeadline"] == "buying-signal" else "awareness-research"
    return {
        "keyword": row["query"],
        "wave": "trial",
        "status": row["relevanceDisposition"],
        "priority": priority,
        "funnel": funnel,
        "clusterId": row["clusterId"],
        "cluster": system,
        "geography": row["geography"],
        "volume": number(row["monthlySearches"]),
        "kd": number(row["difficulty"]),
        "cpc": number(row["cpc"]),
        "score": max(number(row["leadCaptureScore"]) or 0, number(row["authorityBuildScore"]) or 0),
        "metricsStatus": row["dataStatus"],
        "validation": "first-trial provider observation",
        "pageType": page_type,
    }


def expansion_item(row: dict[str, str]) -> dict[str, object]:
    return {
        "keyword": row["keyword"],
        "wave": "expansion",
        "status": "include",
        "priority": row["priority"],
        "funnel": row["funnelStage"],
        "clusterId": row["clusterId"],
        "cluster": row["clusterName"],
        "geography": "query-local / Canada metrics" if any(
            place in row["keyword"].lower()
            for place in ("toronto", "ontario", "mississauga", "gta")
        ) else "Canada",
        "volume": number(row["searchVolume"]),
        "kd": number(row["keywordDifficulty"]),
        "cpc": number(row["cpc"]),
        "score": number(row["opportunityScore"]) or 0,
        "metricsStatus": row["metricsStatus"],
        "validation": row["serpValidation"],
        "pageType": row["proposedPageType"],
    }


combined: dict[str, dict[str, object]] = {}
for source_row in rows(TRIAL):
    item = trial_item(source_row)
    combined[str(item["keyword"]).strip().lower()] = item

for source_row in rows(EXPANSION):
    item = expansion_item(source_row)
    key = str(item["keyword"]).strip().lower()
    previous = combined.get(key)
    if previous:
        item["wave"] = "both"
        item["status"] = "include"
        item["trialCluster"] = previous["cluster"]
        for metric in ("volume", "kd", "cpc"):
            if item[metric] is None and previous[metric] is not None:
                item[metric] = previous[metric]
                item["metricsStatus"] = f"{item['metricsStatus']} + trial metric fallback"
    combined[key] = item

output = sorted(combined.values(), key=lambda item: str(item["keyword"]).lower())
assert len(output) == 163
assert sum(item["wave"] in {"expansion", "both"} for item in output) == 130
assert sum(item["wave"] == "expansion" for item in output) == 117

print(json.dumps(output, separators=(",", ":"), ensure_ascii=False))
