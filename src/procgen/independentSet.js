/**
 * Maximum independent set on a set of grid cells, where two cells conflict
 * if they are orthogonally adjacent (diagonals do NOT conflict).
 *
 * Grid graphs are bipartite (colour = (r+c) % 2), so by König's theorem:
 *   |MIS| = |V| − |maximum matching|
 * and an actual MIS is the complement of the minimum vertex cover.
 */
import { DIRS, DIR_KEYS, key, parseKey } from './edges.js';

function neighbours(k, cellSet) {
    const [r, c] = parseKey(k);
    const out = [];
    for (const d of DIR_KEYS) {
        const nk = key(r + DIRS[d].dr, c + DIRS[d].dc);
        if (cellSet.has(nk)) out.push(nk);
    }
    return out;
}

/** Returns an Array of cell keys forming a maximum independent set. */
export function maxIndependentSet(cells) {
    const cellSet = new Set(cells);
    const left = [...cellSet].filter(k => {
        const [r, c] = parseKey(k);
        return (r + c) % 2 === 0;
    });
    const right = [...cellSet].filter(k => !left.includes(k));

    // Kuhn's augmenting-path matching
    const matchL = new Map(); // left → right
    const matchR = new Map(); // right → left
    const tryAugment = (u, seen) => {
        for (const w of neighbours(u, cellSet)) {
            if (seen.has(w)) continue;
            seen.add(w);
            if (!matchR.has(w) || tryAugment(matchR.get(w), seen)) {
                matchL.set(u, w);
                matchR.set(w, u);
                return true;
            }
        }
        return false;
    };
    for (const u of left) tryAugment(u, new Set());

    // König: alternating BFS from unmatched left vertices
    const visL = new Set();
    const visR = new Set();
    const queue = left.filter(u => !matchL.has(u));
    queue.forEach(u => visL.add(u));
    while (queue.length) {
        const u = queue.shift();
        for (const w of neighbours(u, cellSet)) {
            if (visR.has(w) || matchL.get(u) === w) continue;
            visR.add(w);
            const m = matchR.get(w);
            if (m && !visL.has(m)) {
                visL.add(m);
                queue.push(m);
            }
        }
    }
    // Min vertex cover = (L \ visL) ∪ (R ∩ visR) → MIS = (L ∩ visL) ∪ (R \ visR)
    return [...left.filter(u => visL.has(u)), ...right.filter(w => !visR.has(w))];
}

/** True if no two cells in `cells` are orthogonally adjacent. */
export function isIndependent(cells) {
    const s = new Set(cells);
    return [...s].every(k => neighbours(k, s).length === 0);
}

/**
 * Picks `k` mutually non-adjacent cells, randomly (seeded).
 * Tries random greedy orders first; falls back to a random subset of a MIS.
 */
export function pickIndependent(cells, k, rand, attempts = 64, shuffleFn) {
    if (k <= 0) return [];
    for (let i = 0; i < attempts; i++) {
        const order = shuffleFn(cells, rand);
        const chosen = new Set();
        for (const cell of order) {
            if (neighbours(cell, chosen).length === 0) chosen.add(cell);
            if (chosen.size === k) return [...chosen];
        }
    }
    return shuffleFn(maxIndependentSet(cells), rand).slice(0, k);
}
