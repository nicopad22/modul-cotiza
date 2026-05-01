# Components Agent Manifest
This folder contains the React UI components for the Modul CAD front-end.

## Files
- `Experience.jsx`: Renders the 3D environment using `@react-three/drei`. Handles `OrbitControls` and background environment toggling based on user selection.
- `GridEditor.jsx`: A 2D interactive canvas for drawing the floor plan.
  - Allows users to place and erase modules on a virtual grid.
  - Highlights invalid or disconnected structures by leveraging utilities from `gridStructures.js`.
- `Scene.jsx`: Translates the 2D grid into a 3D representation.
  - Maps filled grid cells into 3D `MovingBox` meshes.
  - Computes the center of mass to position the camera pivot at the origin.
- `Sidebar.jsx`: The side navigation and configuration panel.
  - Contains toggles for view mode (3D/2D), environment settings, and material quality selections (walls, kitchen, bathroom).
  - Displays dynamic summary statistics, including square footage, module count, and real-time UF pricing fetched from the backend.
