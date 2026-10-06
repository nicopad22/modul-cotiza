# Components Agent Manifest
This folder contains the React UI components for the Modul CAD front-end.

## Files
- `Experience.jsx`: Renders the 3D environment using `@react-three/drei`. Handles `OrbitControls` in metric coordinates and background environment toggling.
- `GridEditor.jsx`: A 2D interactive canvas for drawing the floor plan.
  - Allows users to place and erase modules on a virtual grid.
  - Highlights invalid or disconnected structures by leveraging utilities from `gridStructures.js`.
  - Displays the active front orientation badge.
- `Scene.jsx`: Translates procedurally generated box primitives into Three.js meshes with appropriate materials (wood exterior, white frames, tinted glass, plinths).
- `Sidebar.jsx`: The side navigation and configuration panel.
  - Contains toggles for view mode (3D/2D), environment settings, front orientation, and material quality selections.
  - Enforces bathroom steppers dynamically bounded by layout capacity.
  - Displays dynamic summary statistics, including square footage, module count, and real-time UF pricing fetched from the backend.
