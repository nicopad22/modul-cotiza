# Utils Agent Manifest
This folder contains utility scripts and algorithms for the front-end application.

## Files
- `gridStructures.js`: Algorithms for analyzing the 2D grid of modules.
  - `findComponents(grid)`: Performs a Breadth-First Search (BFS) flood-fill to identify connected components (groups of touching modules) on the grid.
  - `analyzeGrid(grid, masterAnchor)`: Analyzes the grid to distinguish the main "master" structure from any orphaned or disconnected modules. Also identifies valid empty cells where new modules can be legally attached.
