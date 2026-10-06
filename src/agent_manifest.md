# Src Agent Manifest
This folder contains the root React front-end code for the Modul CAD configurator.

## Files
- `App.jsx`: The main React component representing the configurator layout.
  - Maintains state for the 2D grid, front orientation, 3D environment type, user selections (walls, kitchen, etc.), and the current price estimate.
  - Generates the procedural 3D house model in real time via `src/procgen` on any shape, structure, or material change.
  - Excludes disconnected modules from calculations and API calls.
  - Orchestrates a debounced API call to `POST /api/estimate` whenever the grid or configuration changes.
  - Renders the split-screen layout with persistently mounted 3D Canvas (`Experience`) and 2D `GridEditor`, toggling visibility via CSS and pausing the WebGL render loop (`frameloop="never"`) in 2D mode for 0ms view switching.
  - Displays `SummaryCard` only in 3D view mode.

- `main.jsx`: React entrypoint that mounts `App` to the DOM.

- `index.css`: Global CSS definitions, Tailwind CSS directives, and default styling variables.
