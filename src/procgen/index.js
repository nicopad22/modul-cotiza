/**
 * Procedural house generator — single entry point.
 * Call whenever shape, structure or materials change (user or agent).
 *
 *   grid → master structure (disconnected ignored) → rules (edge matrix) → geometry
 */
import { analyzeGrid } from '../utils/gridStructures.js';
import { applyRules, seedFromCells } from './rules.js';
import { buildGeometry } from './geometry.js';
import { listEdges } from './edges.js';

/**
 * @param {object} input
 * @param {boolean[][]} input.grid
 * @param {string|null} [input.masterAnchor]  "r,c" of a master cell (optional)
 * @param {'N'|'S'|'E'|'W'} [input.orientation] side of the planta terraces/ventanales face
 * @param {number} [input.bathrooms]
 * @param {number} [input.moduleHeight]       interior wall height (m)
 * @param {string} [input.wallPanelType]
 * @param {object} cfg                         house_gen.json
 */
export function generateHouse(input, cfg) {
    const { grid, masterAnchor = null, orientation = 'N', bathrooms = 1, moduleHeight = 2.5, wallPanelType } = input;
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const { masterCells } = analyzeGrid(grid, masterAnchor);
    const seed = seedFromCells(masterCells);

    const layout = applyRules(masterCells, {
        rows, cols, orientation, bathrooms, seed,
        attempts: cfg.bathrooms?.placement_attempts ?? 64,
    });
    const geometry = buildGeometry(layout, masterCells, cfg, { moduleHeight, wallPanelType });

    return {
        cells: masterCells,
        seed,
        edges: layout.edges,
        edgeList: listEdges(layout.edges, masterCells),
        orientation,
        mainRun: layout.mainRun,
        door: layout.door,
        bathroomCells: layout.bathroomCells,
        maxBathrooms: layout.maxBathrooms,
        ...geometry,
    };
}
