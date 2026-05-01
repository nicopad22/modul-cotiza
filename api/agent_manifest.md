# API Agent Manifest
This folder contains the main FastAPI serverless backend entrypoint for Modul CAD, a Vercel-deployed application.

## Files
- `index.py`: The FastAPI application entrypoint.
  - Defines the REST API endpoints:
    - `POST /api/estimate`: Returns a real-time price estimate and geometry calculations based on user configuration and grid layout. Uses in-memory caching for live prices.
    - `GET /api/uf`: A lightweight proxy returning the current Chilean UF (Unidad de Fomento) value.
    - `POST /api/quote`: Generates a PDF quote with a rendered 2D plan and returns it as a streaming download.
  - Internal functions:
    - `_get_config()`: Loads static pricing configurations.
    - `_get_live_prices()`: Fetches and caches scraped live material prices.
    - `_get_uf_value()`: Fetches the UF value with a conservative fallback.
