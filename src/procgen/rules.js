/**
 * Layout rules: master cells + orientation + bathrooms → edge matrix.
 *
 * Order:
 *  1. Every exterior edge = 'w'.
 *  2. Edges facing `orientation`: longest contiguous colinear run = 't'
 *     (terraza + ventanal), rest = 'v' (ventanal only).
 *  3. Door 'p': edge facing opposite to orientation, most centred module.
 *  4. Bathrooms 'c': one per bathroom, in mutually non-adjacent modules
 *     (diagonals allowed). Modules with ventanal only get the window on the
 *     face opposite the ventanal. Never facing `orientation`. May share face
 *     with the door ('pc').
 */
import {
    DIRS, OPPOSITE, createEdges, getEdge, setEdge, addToEdge,
    exteriorEdges, key, parseKey,
} from './edges.js';
import { hashString, mulberry32, shuffle } from './random.js';
import { maxIndependentSet, pickIndependent } from './independentSet.js';

/** For a direction: which coordinate runs along the face, and which is the line. */
function axisOf(dir) {
    return dir === 'N' || dir === 'S'
        ? { along: 'c', line: 'r' }
        : { along: 'r', line: 'c' };
}

/** Larger = further toward `dir`. */
function forwardness(cell, dir) {
    const { dr, dc } = DIRS[dir];
    return cell.r * dr + cell.c * dc;
}

/** Groups same-direction exterior edges into contiguous colinear runs. */
export function findRuns(edgeList, dir) {
    const { along, line } = axisOf(dir);
    const byLine = new Map();
    for (const e of edgeList) {
        if (e.dir !== dir) continue;
        if (!byLine.has(e[line])) byLine.set(e[line], []);
        byLine.get(e[line]).push(e);
    }
    const runs = [];
    for (const list of byLine.values()) {
        list.sort((a, b) => a[along] - b[along]);
        let cur = [list[0]];
        for (let i = 1; i < list.length; i++) {
            if (list[i][along] === list[i - 1][along] + 1) cur.push(list[i]);
            else { runs.push(cur); cur = [list[i]]; }
        }
        runs.push(cur);
    }
    return runs.map(edgesInRun => ({
        dir,
        edges: edgesInRun,
        start: edgesInRun[0][along],
        end: edgesInRun[edgesInRun.length - 1][along],
        length: edgesInRun.length,
        line: edgesInRun[0][line],
    }));
}

function centroidAlong(cells, dir) {
    const { along } = axisOf(dir);
    let s = 0;
    for (const k of cells) {
        const [r, c] = parseKey(k);
        s += along === 'c' ? c : r;
    }
    return s / cells.size;
}

/** Picks main front run: longest → most centred → most forward → lowest start. */
export function pickMainRun(runs, cells, dir) {
    const centroid = centroidAlong(cells, dir);
    const { dr, dc } = DIRS[dir];
    const fwd = run => run.line * (dr + dc);
    return [...runs].sort((a, b) =>
        (b.length - a.length)
        || (Math.abs((a.start + a.end) / 2 - centroid) - Math.abs((b.start + b.end) / 2 - centroid))
        || (fwd(b) - fwd(a))
        || (a.start - b.start)
    )[0] ?? null;
}

/** Most centred back-facing edge (opposite orientation). */
export function pickDoor(extEdges, cells, orientation) {
    const back = OPPOSITE[orientation];
    const { along } = axisOf(back);
    const centroid = centroidAlong(cells, back);
    const candidates = extEdges.filter(e => e.dir === back);
    if (!candidates.length) return null;
    return candidates.sort((a, b) =>
        (Math.abs(a[along] - centroid) - Math.abs(b[along] - centroid))
        || (forwardness(b, back) - forwardness(a, back))
        || (a[along] - b[along])
    )[0];
}

/** Faces of a module where a ventana chica may go. */
function bathroomCandidateDirs(edges, cells, r, c, orientation) {
    const ext = dir => !cells.has(key(r + DIRS[dir].dr, c + DIRS[dir].dc));
    const back = OPPOSITE[orientation];
    const hasGlazing = ext(orientation); // every front-facing exterior edge is t/v
    const dirs = hasGlazing ? [back] : ['N', 'E', 'S', 'W'];
    return dirs.filter(d => d !== orientation && ext(d)
        && ['w', 'p'].includes(getEdge(edges, r, c, d)));
}

/**
 * @param {Set<string>} cells  master cells ("r,c")
 * @param {object} opts { rows, cols, orientation: 'N'|'S'|'E'|'W', bathrooms, seed, attempts }
 */
export function applyRules(cells, { rows, cols, orientation = 'N', bathrooms = 1, seed = 0, attempts = 64 }) {
    const edges = createEdges(rows, cols);
    const result = {
        edges, orientation, mainRun: null, secondaryRuns: [], door: null,
        bathroomCells: [], bathroomWindows: [], maxBathrooms: 0,
    };
    if (!cells.size) return result;

    // 1. exterior walls
    const ext = exteriorEdges(cells);
    for (const e of ext) setEdge(edges, e.r, e.c, e.dir, 'w');

    // 2. front: terraza + ventanales
    const runs = findRuns(ext, orientation);
    const main = pickMainRun(runs, cells, orientation);
    for (const run of runs) {
        const val = run === main ? 't' : 'v';
        for (const e of run.edges) setEdge(edges, e.r, e.c, e.dir, val);
    }
    result.mainRun = main;
    result.secondaryRuns = runs.filter(r => r !== main);

    // 3. door
    const door = pickDoor(ext, cells, orientation);
    if (door) setEdge(edges, door.r, door.c, door.dir, 'p');
    result.door = door;

    // 4. bathrooms
    const rand = mulberry32(seed);
    const eligible = [...cells].filter(k => {
        const [r, c] = parseKey(k);
        return bathroomCandidateDirs(edges, cells, r, c, orientation).length > 0;
    }).sort();
    result.maxBathrooms = maxIndependentSet(eligible).length;
    const k = Math.max(0, Math.min(bathrooms, result.maxBathrooms));
    const chosen = pickIndependent(eligible, k, rand, attempts, shuffle).sort();
    for (const ck of chosen) {
        const [r, c] = parseKey(ck);
        const dirs = bathroomCandidateDirs(edges, cells, r, c, orientation);
        const dir = dirs[Math.floor(rand() * dirs.length)];
        addToEdge(edges, r, c, dir, 'c');
        result.bathroomWindows.push({ r, c, dir });
    }
    result.bathroomCells = chosen;
    return result;
}

/** Stable seed derived from the (master) grid only. */
export function seedFromCells(cells) {
    return hashString([...cells].sort().join('|'));
}
