# Procgen Agent Manifest
Contains the procedural generation engine for modular houses.

## Files
- `index.js`: Main facade entry point (`generateHouse`). Orchestrates grid filtering, rule application, and 3D geometry creation.
- `edges.js`: Boundary and edge representation (`h` and `v` matrices), direction constants, and exterior edge finders.
- `rules.js`: Rule solver implementing orientation-based front grouping, terrace tube identification, entrance door placement, and bathroom distribution.
- `geometry.js`: Converts layout and edge tags into 3D box primitives with per-face material mappings in metric coordinates. Accurately handles corner junctions (preventing overlapping walls and Z-fighting) and formats tube terraces with exterior finish throughout.
- `independentSet.js`: Maximum Independent Set solver (König's theorem) for enforcing non-adjacent bathroom module separation.
- `random.js`: Seeded PRNG (`mulberry32`, `hashString`) guaranteeing deterministic results per layout.
- `procgen.test.mjs`: Test suite covering rule edge cases, geometric bounds, and invariance.
