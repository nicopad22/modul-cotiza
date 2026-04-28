from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import date
from typing import Any


@dataclass
class Geometry:
    module_count: int
    gross_area_m2: float
    perimeter_m: float
    wall_area_m2: float
    floor_area_m2: float
    roof_area_m2: float
    estimated_partition_length_m: float
    estimated_partition_area_m2: float


def parse_grid(grid_rows: list[str]) -> list[list[bool]]:
    if not grid_rows:
        raise ValueError("Grid cannot be empty.")

    width = len(grid_rows[0])
    parsed: list[list[bool]] = []
    for row in grid_rows:
        if len(row) != width:
            raise ValueError("All grid rows must have the same width.")
        parsed.append([cell.upper() == "X" for cell in row])

    if not any(any(row) for row in parsed):
        raise ValueError("Grid must contain at least one occupied module.")

    return parsed


def compute_geometry(project: dict[str, Any], config: dict[str, Any]) -> Geometry:
    defaults = config["defaults"]
    grid = parse_grid(project["grid"])
    module_size = defaults["module_size_m"]
    wall_height = defaults["wall_height_m"]
    module_area = module_size * module_size

    module_count = sum(1 for row in grid for occupied in row if occupied)
    perimeter_edges = 0
    adjacency_pairs = 0

    height = len(grid)
    width = len(grid[0])
    for y in range(height):
        for x in range(width):
            if not grid[y][x]:
                continue

            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx = x + dx
                ny = y + dy
                if 0 <= nx < width and 0 <= ny < height and grid[ny][nx]:
                    if dx == 1 or dy == 1:
                        adjacency_pairs += 1
                else:
                    perimeter_edges += 1

    gross_area_m2 = module_count * module_area
    perimeter_m = perimeter_edges * module_size
    wall_area_m2 = perimeter_m * wall_height
    floor_area_m2 = gross_area_m2 * defaults["floor_waste_factor"]
    roof_area_m2 = gross_area_m2 * defaults["roof_area_factor"]

    partition_factor = defaults["interior_partition_factor"]
    estimated_partition_length_m = max(
        module_size,
        ((adjacency_pairs * module_size) + ((project["bedrooms"] + project["bathrooms"]) * module_size))
        * partition_factor,
    )
    estimated_partition_area_m2 = estimated_partition_length_m * wall_height

    return Geometry(
        module_count=module_count,
        gross_area_m2=round(gross_area_m2, 2),
        perimeter_m=round(perimeter_m, 2),
        wall_area_m2=round(wall_area_m2, 2),
        floor_area_m2=round(floor_area_m2, 2),
        roof_area_m2=round(roof_area_m2, 2),
        estimated_partition_length_m=round(estimated_partition_length_m, 2),
        estimated_partition_area_m2=round(estimated_partition_area_m2, 2),
    )


def _quantity_from_length(length_m: float, stock_length_m: float = 6.0, waste_pct: float = 0.1) -> int:
    return max(1, math.ceil((length_m * (1 + waste_pct)) / stock_length_m))


def _currency(value: float) -> int:
    return int(round(value))


def build_quote(
    project: dict[str, Any],
    config: dict[str, Any],
    live_prices: dict[str, Any],
) -> dict[str, Any]:
    geometry = compute_geometry(project, config)
    defaults = config["defaults"]
    catalog = config["static_catalog"]

    wall_panel = catalog["wall_panels"][project["wall_panel_type"]]
    floor_system = catalog["floor_systems"][project["floor_system_type"]]
    roof_system = catalog["roof_systems"][project["roof_system_type"]]
    kitchen = catalog["kitchens"][project["kitchen_type"]]
    bathroom = catalog["bathrooms"][project["bathroom_type"]]
    openings = catalog["openings"]
    misc = catalog["misc"]

    frame_length_m = (geometry.perimeter_m * 2.2) + (geometry.estimated_partition_length_m * 0.85)
    bracing_length_m = geometry.perimeter_m * 1.35

    steel_frame_qty = _quantity_from_length(frame_length_m)
    steel_bracing_qty = _quantity_from_length(bracing_length_m)

    bedroom_count = max(1, project["bedrooms"])
    bathroom_count = max(1, project["bathrooms"])
    exterior_doors_qty = 1
    interior_doors_qty = bedroom_count + bathroom_count
    windows_qty = max(2, geometry.module_count + bedroom_count)

    bom = [
        {
            "category": "Structure",
            "item": live_prices["steel_frame_main"].label,
            "unit": "6 m stick",
            "quantity": steel_frame_qty,
            "unit_price": live_prices["steel_frame_main"].price,
            "source": live_prices["steel_frame_main"].source_url,
        },
        {
            "category": "Structure",
            "item": live_prices["steel_bracing"].label,
            "unit": "6 m stick",
            "quantity": steel_bracing_qty,
            "unit_price": live_prices["steel_bracing"].price,
            "source": live_prices["steel_bracing"].source_url,
        },
        {
            "category": "Envelope",
            "item": wall_panel["label"],
            "unit": "m2",
            "quantity": geometry.wall_area_m2 + geometry.estimated_partition_area_m2,
            "unit_price": wall_panel["price_per_m2"],
            "source": "config/pricing.json",
        },
        {
            "category": "Envelope",
            "item": floor_system["label"],
            "unit": "m2",
            "quantity": geometry.floor_area_m2,
            "unit_price": floor_system["price_per_m2"],
            "source": "config/pricing.json",
        },
        {
            "category": "Envelope",
            "item": roof_system["label"],
            "unit": "m2",
            "quantity": geometry.roof_area_m2,
            "unit_price": roof_system["price_per_m2"],
            "source": "config/pricing.json",
        },
        {
            "category": "Fit-out",
            "item": kitchen["label"],
            "unit": "set",
            "quantity": 1,
            "unit_price": kitchen["price"],
            "source": "config/pricing.json",
        },
        {
            "category": "Fit-out",
            "item": bathroom["label"],
            "unit": "set",
            "quantity": bathroom_count,
            "unit_price": bathroom["price"],
            "source": "config/pricing.json",
        },
        {
            "category": "Openings",
            "item": openings["exterior_door"]["label"],
            "unit": "unit",
            "quantity": exterior_doors_qty,
            "unit_price": openings["exterior_door"]["price"],
            "source": "config/pricing.json",
        },
        {
            "category": "Openings",
            "item": openings["interior_door"]["label"],
            "unit": "unit",
            "quantity": interior_doors_qty,
            "unit_price": openings["interior_door"]["price"],
            "source": "config/pricing.json",
        },
        {
            "category": "Openings",
            "item": openings["window_standard"]["label"],
            "unit": "unit",
            "quantity": windows_qty,
            "unit_price": openings["window_standard"]["price"],
            "source": "config/pricing.json",
        },
    ]

    materials_subtotal = 0
    for line in bom:
        line["quantity"] = round(float(line["quantity"]), 2)
        line["line_total"] = _currency(line["quantity"] * line["unit_price"])
        materials_subtotal += line["line_total"]

    fasteners_total = _currency(materials_subtotal * misc["fasteners_pct_of_materials"])
    electrical_total = _currency(geometry.gross_area_m2 * misc["electrical_pct_of_area_cost"])
    plumbing_total = _currency(geometry.gross_area_m2 * misc["plumbing_pct_of_area_cost"])

    extras = [
        ("Consumibles y fijaciones", fasteners_total),
        ("Instalacion electrica estimada", electrical_total),
        ("Instalacion sanitaria estimada", plumbing_total),
    ]

    for label, total in extras:
        bom.append(
            {
                "category": "Systems",
                "item": label,
                "unit": "allowance",
                "quantity": 1,
                "unit_price": total,
                "line_total": total,
                "source": "config/pricing.json",
            }
        )
        materials_subtotal += total

    manufacturing_cost = _currency(geometry.gross_area_m2 * defaults["manufacturing_labor_per_m2"])
    installation_cost = _currency(geometry.gross_area_m2 * defaults["installation_labor_per_m2"])
    foundation_cost = _currency(geometry.module_count * defaults["foundation_cost_per_module"])
    transport_cost = _currency(geometry.module_count * defaults["transport_cost_per_module"])
    engineering_cost = _currency(defaults["engineering_cost_flat"])
    site_setup_cost = _currency(defaults["site_setup_cost_flat"])

    base_cost = (
        materials_subtotal
        + manufacturing_cost
        + installation_cost
        + foundation_cost
        + transport_cost
        + engineering_cost
        + site_setup_cost
    )
    contingency = _currency(base_cost * defaults["contingency_pct"])
    overhead = _currency((base_cost + contingency) * defaults["overhead_markup_pct"])
    profit = _currency((base_cost + contingency + overhead) * defaults["profit_markup_pct"])
    final_total = base_cost + contingency + overhead + profit

    return {
        "generated_on": date.today().isoformat(),
        "project": project,
        "geometry": geometry,
        "bom": bom,
        "live_prices": {
            key: {
                "label": value.label,
                "price": value.price,
                "source_url": value.source_url,
                "fetched_at": value.fetched_at,
                "fallback_used": value.fallback_used,
            }
            for key, value in live_prices.items()
        },
        "totals": {
            "materials_subtotal": materials_subtotal,
            "manufacturing_cost": manufacturing_cost,
            "installation_cost": installation_cost,
            "foundation_cost": foundation_cost,
            "transport_cost": transport_cost,
            "engineering_cost": engineering_cost,
            "site_setup_cost": site_setup_cost,
            "contingency": contingency,
            "overhead": overhead,
            "profit": profit,
            "final_total": final_total,
            "price_per_m2": _currency(final_total / geometry.gross_area_m2),
        },
        "assumptions": [
            f"Module size: {config['defaults']['module_size_m']}m x {config['defaults']['module_size_m']}m",
            f"Wall height: {config['defaults']['wall_height_m']}m",
            "Interior partitioning estimated from occupied modules and declared bedroom/bathroom count.",
            "Kitchen and bathroom packages are treated as fixed configurable bundles.",
            "Steel profile prices come from live Sodimac pages when available, otherwise fallback snapshot values are used.",
        ],
    }
