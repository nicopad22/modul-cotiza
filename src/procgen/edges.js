/**
 * Edge matrix — the "matriz de adyacencia" of the house.
 *
 * Every module boundary is an edge:
 *   h[rows+1][cols]  horizontal edges  (top of cell r,c = h[r][c], bottom = h[r+1][c])
 *   v[rows][cols+1]  vertical edges    (left of cell r,c = v[r][c], right = v[r][c+1])
 *
 * Edge values:
 *   null  → no wall (interior between two modules, or no module at all)
 *   'w'   → plain exterior wall
 *   't'   → terraza + ventanal (main front)
 *   'v'   → ventanal only (secondary front segments)
 *   'c'   → ventana chica (baño)
 *   'p'   → puerta de entrada
 *   'pc'  → puerta + ventana chica on the same face
 */

/** Directions in planta (grid) space. N = top of the grid (row − 1). */
export const DIRS = {
    N: { dr: -1, dc: 0 },
    S: { dr: 1, dc: 0 },
    E: { dr: 0, dc: 1 },
    W: { dr: 0, dc: -1 },
};
export const DIR_KEYS = ['N', 'E', 'S', 'W'];
export const OPPOSITE = { N: 'S', S: 'N', E: 'W', W: 'E' };

export function createEdges(rows, cols) {
    return {
        rows,
        cols,
        h: Array.from({ length: rows + 1 }, () => Array(cols).fill(null)),
        v: Array.from({ length: rows }, () => Array(cols + 1).fill(null)),
    };
}

/** Returns [matrixName, i, j] of the edge on side `dir` of cell (r, c). */
function edgeIndex(r, c, dir) {
    switch (dir) {
        case 'N': return ['h', r, c];
        case 'S': return ['h', r + 1, c];
        case 'W': return ['v', r, c];
        case 'E': return ['v', r, c + 1];
        default: throw new Error(`Bad dir ${dir}`);
    }
}

export function getEdge(edges, r, c, dir) {
    const [m, i, j] = edgeIndex(r, c, dir);
    return edges[m][i][j];
}

export function setEdge(edges, r, c, dir, value) {
    const [m, i, j] = edgeIndex(r, c, dir);
    edges[m][i][j] = value;
}

/** Adds a letter to an edge string, keeping canonical order ('p' before 'c'). */
export function addToEdge(edges, r, c, dir, letter) {
    const cur = getEdge(edges, r, c, dir);
    const base = cur === 'w' || cur == null ? '' : cur;
    if (base.includes(letter)) return;
    const order = ['t', 'v', 'p', 'c'];
    const next = [...base, letter].sort((a, b) => order.indexOf(a) - order.indexOf(b)).join('');
    setEdge(edges, r, c, dir, next);
}

/** Cell key helpers. */
export const key = (r, c) => `${r},${c}`;
export const parseKey = (k) => k.split(',').map(Number);

/**
 * Lists exterior edges of a set of cells: { r, c, dir } where the neighbour
 * in `dir` is not part of the set.
 */
export function exteriorEdges(cells) {
    const out = [];
    for (const k of cells) {
        const [r, c] = parseKey(k);
        for (const dir of DIR_KEYS) {
            const { dr, dc } = DIRS[dir];
            if (!cells.has(key(r + dr, c + dc))) out.push({ r, c, dir });
        }
    }
    return out;
}

/** Plain-object dump of all non-null edges, useful for debugging / API. */
export function listEdges(edges, cells) {
    const out = [];
    for (const k of cells) {
        const [r, c] = parseKey(k);
        for (const dir of DIR_KEYS) {
            const v = getEdge(edges, r, c, dir);
            const { dr, dc } = DIRS[dir];
            // Each interior edge would be listed twice; exterior only once.
            if (v != null && !cells.has(key(r + dr, c + dc))) out.push({ r, c, dir, value: v });
        }
    }
    return out;
}
