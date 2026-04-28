from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup


PRICE_RE = re.compile(r"\$\s*([\d\.]+)")


@dataclass
class LivePrice:
    key: str
    label: str
    price: int
    unit: str
    source_url: str
    fetched_at: str
    fallback_used: bool


def load_pricing_config(config_path: str | Path) -> dict[str, Any]:
    with Path(config_path).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _extract_live_price_from_html(html: str, match_text: str, label: str) -> int | None:
    index = html.find(match_text)
    if index == -1:
        index = html.find(label)
    if index == -1:
        return None

    window = html[max(0, index - 1500):index + 1500]
    matches = PRICE_RE.findall(window)
    if not matches:
        return None

    return int(matches[-1].replace(".", ""))


def fetch_live_prices(config: dict[str, Any], timeout: int = 12) -> dict[str, LivePrice]:
    results: dict[str, LivePrice] = {}
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36"
        )
    }

    for key, source in config["live_sources"].items():
        price = source["fallback_price"]
        fallback_used = True
        try:
            response = requests.get(source["url"], headers=headers, timeout=timeout)
            response.raise_for_status()
            extracted = _extract_live_price_from_html(
                response.text,
                source["match_text"],
                source["label"],
            )
            if extracted:
                price = extracted
                fallback_used = False
        except requests.RequestException:
            fallback_used = True

        results[key] = LivePrice(
            key=key,
            label=source["label"],
            price=price,
            unit=source["unit"],
            source_url=source["url"],
            fetched_at=datetime.now().isoformat(timespec="seconds"),
            fallback_used=fallback_used,
        )

    return results


def fetch_uf_value(target_date: date, timeout: int = 12) -> float:
    url = f"https://www.sii.cl/valores_y_fechas/uf/uf{target_date.year}.htm"
    response = requests.get(url, timeout=timeout)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    month_names = [
        "",
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ]
    month_id = f"mes_{month_names[target_date.month]}"
    month_container = soup.find("div", id=month_id)
    if month_container is None:
        raise ValueError(f"UF table for month {target_date.month} not found in SII source.")

    day_label = str(target_date.day)
    cells = month_container.find_all(["th", "td"])
    for idx, cell in enumerate(cells[:-1]):
        if cell.name == "th" and cell.get_text(strip=True) == day_label:
            value_text = cells[idx + 1].get_text(strip=True)
            if not value_text:
                break
            normalized = value_text.replace(".", "").replace(",", ".")
            return float(normalized)

    raise ValueError(f"UF value for {target_date.isoformat()} not found in SII source.")
