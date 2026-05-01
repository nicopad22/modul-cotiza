# System Architecture

## Overview
Modul-cotiza is a web-based, real-time configurator for modular homes. It allows users to place modules on a 2D grid, visualizes them in 3D, and computes a dynamic cost estimate by querying a backend API.

## Frontend (React / Vite)
- **State Management:** `App.jsx` acts as the single source of truth for the configurator's state (grid layout, module height, environment, panel type, etc.).
- **Components:** 
  - `GridEditor.jsx`: A 2D canvas where the user toggles the presence of modules on a grid. Uses `gridStructures.js` to ensure the modules form a valid, continuous structure.
  - `Sidebar.jsx`: The control panel. It renders options, inputs, and the real-time `SummaryCard` using data fetched from the API.
  - `Scene.jsx` & `Experience.jsx`: React Three Fiber components that translate the 2D grid into a 3D visual representation.

## Backend (FastAPI / Vercel Serverless)
- **`api/index.py`**: The entry point. Exposes endpoints `/api/estimate`, `/api/quote`, and `/api/uf`.
- **`api/modul_cad/`**: The core pricing and geometry engine.
  - `estimator.py`: Computes geometric values (area, perimeter, module count) and calculates a detailed price breakdown based on fixed configurations and live prices.
  - `pricing.py`: Handles fetching dynamic external data (e.g., UF value from SII, live material prices) and merges them with `api/config/pricing.json`.

## Data Flow
1. User modifies a setting in the `Sidebar` or places a block in the `GridEditor`.
2. The state updates in `App.jsx`, triggering a re-render of the `Scene` for visual feedback.
3. A debounced effect in `App.jsx` issues a POST request to `/api/estimate` containing the current project configuration.
4. The FastAPI backend processes the request via `build_quote()`, integrating live prices.
5. The JSON response (geometry, totals in CLP and UF) is returned to the frontend.
6. The `Sidebar` displays the updated cost dynamically.
