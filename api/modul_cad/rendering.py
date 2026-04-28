from __future__ import annotations

from io import BytesIO
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


def render_plan(project: dict[str, Any], config: dict[str, Any], output_path: str | Path) -> Path:
    """Render plan to a file path (backward-compatible for CLI usage)."""
    buf = render_plan_bytes(project, config)
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(buf)
    return path


def render_plan_bytes(project: dict[str, Any], config: dict[str, Any]) -> bytes:
    """Render plan and return raw PNG bytes (for serverless / in-memory usage)."""
    grid = project["grid"]
    defaults = config["defaults"]
    cell = defaults["plan_cell_pixels"]
    padding = 80
    rows = len(grid)
    cols = len(grid[0])

    image = Image.new(
        "RGB",
        (cols * cell + padding * 2, rows * cell + padding * 2 + 120),
        color=(248, 246, 240),
    )
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()

    draw.text((padding, 24), f"Modul CAD Plan - {project['project_name']}", fill=(32, 32, 32), font=font)
    draw.text((padding, 44), f"Location: {project['location']}", fill=(70, 70, 70), font=font)

    for y, row in enumerate(grid):
        for x, cell_value in enumerate(row):
            x0 = padding + x * cell
            y0 = padding + y * cell + 30
            x1 = x0 + cell
            y1 = y0 + cell

            occupied = cell_value.upper() == "X"
            fill = (212, 228, 217) if occupied else (237, 233, 225)
            outline = (35, 52, 39) if occupied else (140, 140, 140)
            draw.rectangle([x0, y0, x1, y1], fill=fill, outline=outline, width=3 if occupied else 1)

            if occupied:
                draw.text((x0 + 12, y0 + 12), "MODUL X", fill=(35, 52, 39), font=font)
                draw.text((x0 + 12, y0 + 30), "3.30 x 3.30m", fill=(35, 52, 39), font=font)

    total_width = cols * cell
    total_height = rows * cell
    draw.line((padding, rows * cell + padding + 55, padding + total_width, rows * cell + padding + 55), fill=(20, 20, 20), width=2)
    draw.line((padding + total_width + 25, padding + 30, padding + total_width + 25, padding + 30 + total_height), fill=(20, 20, 20), width=2)
    draw.text((padding + total_width / 2 - 25, rows * cell + padding + 62), f"{cols * defaults['module_size_m']:.2f} m", fill=(20, 20, 20), font=font)
    draw.text((padding + total_width + 32, padding + 30 + total_height / 2), f"{rows * defaults['module_size_m']:.2f} m", fill=(20, 20, 20), font=font)

    buf = BytesIO()
    image.save(buf, format="PNG")
    return buf.getvalue()
