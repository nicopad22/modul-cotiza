"""Modul CAD API — FastAPI serverless backend for Vercel."""

from __future__ import annotations

import time
from datetime import date
from io import BytesIO
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from .modul_cad.estimator import build_quote, compute_geometry
from .modul_cad.pricing import LivePrice, fetch_live_prices, fetch_uf_value, load_pricing_config

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="Modul CAD API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Config ─────────────────────────────────────────────────────────────────────
CONFIG_PATH = Path(__file__).resolve().parent / "config" / "pricing.json"
_config: dict[str, Any] | None = None

UF_FALLBACK = 40053.72  # Conservative fallback


def _get_config() -> dict[str, Any]:
    global _config
    if _config is None:
        _config = load_pricing_config(CONFIG_PATH)
    return _config


# ── Simple in-memory cache for live prices (warm-start reuse) ──────────────────
_price_cache: dict[str, Any] = {"prices": None, "ts": 0}
CACHE_TTL = 3600  # 1 hour


def _get_live_prices() -> dict[str, LivePrice]:
    now = time.time()
    if _price_cache["prices"] is not None and (now - _price_cache["ts"]) < CACHE_TTL:
        return _price_cache["prices"]
    config = _get_config()
    prices = fetch_live_prices(config)
    _price_cache["prices"] = prices
    _price_cache["ts"] = now
    return prices


def _get_uf_value() -> tuple[float, str]:
    """Returns (uf_value, source_label)."""
    try:
        value = fetch_uf_value(date.today())
        return value, "SII"
    except Exception:
        return UF_FALLBACK, "fallback"


# ── Pydantic models ───────────────────────────────────────────────────────────
class EstimateRequest(BaseModel):
    grid: list[str] = Field(..., description="Grid rows, e.g. ['XX.', 'XXX']")
    wall_panel_type: str = "mgo_sip_122"
    kitchen_type: str = "standard"
    bathroom_type: str = "standard"
    bedrooms: int = 2
    bathrooms: int = 1
    floor_system_type: str = "standard"
    roof_system_type: str = "standard"
    wall_height_m: float = 2.5


class ClientInfo(BaseModel):
    name: str = "Cliente"
    email: str = ""
    phone: str = ""


class QuoteRequest(BaseModel):
    grid: list[str]
    wall_panel_type: str = "mgo_sip_122"
    kitchen_type: str = "standard"
    bathroom_type: str = "standard"
    bedrooms: int = 2
    bathrooms: int = 1
    floor_system_type: str = "standard"
    roof_system_type: str = "standard"
    wall_height_m: float = 2.5
    project_name: str = "Mi Modul"
    location: str = "Santiago, RM"
    client: ClientInfo = ClientInfo()


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.post("/api/estimate")
def estimate(body: EstimateRequest):
    """Real-time price estimate for the sidebar configurator."""
    config = _get_config()
    live_prices = _get_live_prices()
    uf_value, uf_source = _get_uf_value()

    # Build a project dict compatible with the existing estimator
    project = {
        "grid": body.grid,
        "wall_panel_type": body.wall_panel_type,
        "kitchen_type": body.kitchen_type,
        "bathroom_type": body.bathroom_type,
        "bedrooms": body.bedrooms,
        "bathrooms": body.bathrooms,
        "floor_system_type": body.floor_system_type,
        "roof_system_type": body.roof_system_type,
        "wall_height_m": body.wall_height_m,
    }

    try:
        quote = build_quote(project, config, live_prices)
    except (ValueError, KeyError) as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    geometry = quote["geometry"]
    totals = quote["totals"]
    final_uf = round(totals["final_total"] / uf_value, 2)
    price_per_m2_uf = round(totals["price_per_m2"] / uf_value, 2)

    return {
        "geometry": {
            "module_count": geometry.module_count,
            "gross_area_m2": geometry.gross_area_m2,
            "perimeter_m": geometry.perimeter_m,
            "wall_area_m2": geometry.wall_area_m2,
            "floor_area_m2": geometry.floor_area_m2,
            "roof_area_m2": geometry.roof_area_m2,
            "estimated_partition_length_m": geometry.estimated_partition_length_m,
            "estimated_partition_area_m2": geometry.estimated_partition_area_m2,
        },
        "totals": {
            "materials_subtotal": totals["materials_subtotal"],
            "manufacturing_cost": totals["manufacturing_cost"],
            "installation_cost": totals["installation_cost"],
            "foundation_cost": totals["foundation_cost"],
            "transport_cost": totals["transport_cost"],
            "engineering_cost": totals["engineering_cost"],
            "site_setup_cost": totals["site_setup_cost"],
            "contingency": totals["contingency"],
            "overhead": totals["overhead"],
            "profit": totals["profit"],
            "final_total": totals["final_total"],
            "price_per_m2": totals["price_per_m2"],
            "final_total_uf": final_uf,
            "price_per_m2_uf": price_per_m2_uf,
            "uf_value_used": uf_value,
            "uf_source": uf_source,
        },
        "live_prices_status": {
            key: {"fallback_used": lp.fallback_used}
            for key, lp in live_prices.items()
        },
    }


@app.get("/api/uf")
def get_uf():
    """Lightweight proxy for current UF value."""
    uf_value, source = _get_uf_value()
    return {
        "date": date.today().isoformat(),
        "value": uf_value,
        "source": source,
    }


@app.post("/api/quote")
def generate_quote(body: QuoteRequest):
    """Generate a PDF quote and return as streaming download."""
    config = _get_config()
    live_prices = _get_live_prices()

    project = {
        "project_name": body.project_name,
        "quote_id": f"MOD-WEB-{date.today().strftime('%Y%m%d')}",
        "client": {"name": body.client.name, "email": body.client.email, "phone": body.client.phone},
        "location": body.location,
        "currency": "CLP",
        "grid": body.grid,
        "wall_panel_type": body.wall_panel_type,
        "kitchen_type": body.kitchen_type,
        "bathroom_type": body.bathroom_type,
        "bedrooms": body.bedrooms,
        "bathrooms": body.bathrooms,
        "floor_system_type": body.floor_system_type,
        "roof_system_type": body.roof_system_type,
        "wall_height_m": body.wall_height_m,
    }

    try:
        quote = build_quote(project, config, live_prices)
    except (ValueError, KeyError) as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # Import exporters only when needed (heavy deps)
    from .modul_cad.exporters import export_pdf_bytes
    from .modul_cad.rendering import render_plan_bytes

    plan_png = render_plan_bytes(project, config)
    pdf_bytes = export_pdf_bytes(quote, plan_png, config["company"])

    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=cotizacion-modul-{date.today().isoformat()}.pdf"},
    )
