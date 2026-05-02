const ORTHO = [[-1, 0], [1, 0], [0, -1], [0, 1]];

/**
 * BFS flood-fill: returns an array of connected components.
 * Each component is a Set of "r,c" strings.
 */
export function findComponents(grid) {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const components = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c] || visited[r][c]) continue;
            const comp = new Set();
            const queue = [[r, c]];
            visited[r][c] = true;
            while (queue.length) {
                const [cr, cc] = queue.shift();
                comp.add(`${cr},${cc}`);
                for (const [dr, dc] of ORTHO) {
                    const nr = cr + dr, nc = cc + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] && !visited[nr][nc]) {
                        visited[nr][nc] = true;
                        queue.push([nr, nc]);
                    }
                }
            }
            components.push(comp);
        }
    }
    return components;
}

/**
 * Full grid analysis. Returns:
 *   masterCells   – Set of cell keys in the master structure
 *   disconnected  – Array of Sets, one per disconnected component
 *   cellStructure – Map<key, 'master'|'disconnected'> for O(1) render lookup
 *   validCells    – Empty cells legally adjacent to any filled cell
 *
 * masterAnchor – a "r,c" string identifying any cell in the master structure.
 *   If the anchor cell no longer exists (was erased), falls back to the first
 *   component found (top-left scan order), so there is always a master as long
 *   as any filled cells remain.
 */
export function analyzeGrid(grid, masterAnchor) {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;

    const components = findComponents(grid);

    // Prefer component containing the anchor; fallback to first found
    let masterIdx = masterAnchor
        ? components.findIndex(c => c.has(masterAnchor))
        : -1;
    if (masterIdx === -1) masterIdx = 0; // fallback: first component or empty

    const masterCells = masterIdx >= 0 && masterIdx < components.length ? components[masterIdx] : new Set();
    const disconnected = components.filter((_, i) => i !== masterIdx);

    const cellStructure = new Map();
    for (const k of masterCells) cellStructure.set(k, 'master');
    for (const comp of disconnected) for (const k of comp) cellStructure.set(k, 'disconnected');

    // Valid placement: empty cells adjacent to any filled cell; all if grid is empty
    const validCells = new Set();
    if (components.length === 0) {
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                validCells.add(`${r},${c}`);
    } else {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c]) continue;
                for (const [dr, dc] of ORTHO) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc]) {
                        validCells.add(`${r},${c}`);
                        break;
                    }
                }
            }
        }
    }

    return { masterCells, disconnected, cellStructure, validCells };
}
