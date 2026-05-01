# Modul CAD Agent Manifest
This folder contains the core business logic, pricing engines, web scrapers, and exporters for the backend.

## Files
- `estimator.py`: Calculates geometry and builds the Bill of Materials (BOM) and quote totals.
  - `parse_grid(grid_rows)`: Validates and parses the string grid into a boolean 2D array.
  - `compute_geometry(project, config)`: Computes module count, areas (gross, wall, floor, roof), perimeter, and partition estimates.
  - `build_quote(project, config, live_prices)`: Constructs a detailed quote containing geometry, BOM, labor, transport, and profit margins.

- `exporters.py`: Handles exporting the finalized quote to different formats.
  - `export_excel(...)`: Generates an `.xlsx` file using openpyxl with formatted tables and commercial summaries.
  - `export_pdf(...)`: Saves a quote as a PDF file using ReportLab.
  - `export_pdf_bytes(...)`: Generates a PDF in-memory and returns raw bytes for serverless streaming.
  - `_draw_pdf_content(...)`: Shared drawing logic for ReportLab canvas.

- `pricing.py`: Fetches real-time economic indicators and material prices.
  - `load_pricing_config(config_path)`: Loads `pricing.json`.
  - `fetch_live_prices(config)`: Scrapes live prices from configured web sources (e.g. Sodimac) using requests and BeautifulSoup.
  - `fetch_uf_value(target_date)`: Scrapes the current UF value from the SII.cl website.

- `rendering.py`: Generates visual 2D floor plans of the modules.
  - `render_plan(...)`: Renders a 2D top-down plan of the grid to a PNG file using PIL.
  - `render_plan_bytes(...)`: Renders the plan and returns raw PNG bytes for in-memory use (used in PDF generation).
