# Src Agent Manifest
This folder contains the root React front-end code for the Modul CAD configurator.

## Files
- `App.jsx`: The main React component representing the configurator layout.
  - Maintains state for the 2D grid, 3D environment type, user selections (walls, kitchen, etc.), and the current price estimate.
  - Orchestrates a debounced API call to `POST /api/estimate` whenever the grid or configuration changes.
  - Renders the split-screen layout containing either the 3D Canvas (`Experience`) or the 2D `GridEditor`, alongside the `Sidebar`.

- `main.jsx`: React entrypoint that mounts `App` to the DOM.

- `index.css`: Global CSS definitions, Tailwind CSS directives, and default styling variables.
