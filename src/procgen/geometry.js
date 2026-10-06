/**
 * Geometry builder: layout (edge matrix) + config → flat list of box primitives.
 *
 * World space in meters. Grid col → +x, grid row → +z, y up.
 * Planta 'N' (top of grid) = −z.
 *
 * Primitive: { id, pos: [x,y,z], size: [sx,sy,sz], mat }
 *   mat = material key (string) or array of 6 keys [px, nx, py, ny, pz, nz]
 *   (BoxGeometry face-group order). Keys map to `cfg.colors`.
 */
import { DIRS, DIR_KEYS, getEdge, key, parseKey } from './edges.js';

const N_VEC = { N: [0, 0, -1], S: [0, 0, 1], E: [1, 0, 0], W: [-1, 0, 0] };
// "right" as seen from outside looking at the face
const R_VEC = { N: [-1, 0, 0], S: [1, 0, 0], E: [0, 0, -1], W: [0, 0, 1] };
const LEFT_DIR = { N: 'E', S: 'W', E: 'S', W: 'N' };
const RIGHT_DIR = { N: 'W', S: 'E', E: 'N', W: 'S' };

const faceIndex = (v) => {
    if (v[0] === 1) return 0;
    if (v[0] === -1) return 1;
    if (v[1] === 1) return 2;
    if (v[1] === -1) return 3;
    if (v[2] === 1) return 4;
    return 5;
};
const neg = (v) => v.map(x => -x);

/** Local frame on a face: origin at outer boundary, u → right, v → up, w → inward. */
function makeFrame(dir, originXZ, y0) {
    return { dir, n: N_VEC[dir], right: R_VEC[dir], origin: [originXZ[0], y0, originXZ[1]] };
}

function cellFrame(r, c, dir, S, y0) {
    const cx = (c + 0.5) * S, cz = (r + 0.5) * S;
    const n = N_VEC[dir], rt = R_VEC[dir];
    return makeFrame(dir, [cx + (n[0] - rt[0]) * S / 2, cz + (n[2] - rt[2]) * S / 2], y0);
}

/** Resolves a faces spec {out,in,top,bottom,left,right,all} to a material (string or 6-array). */
function resolveFaces(frame, faces) {
    if (typeof faces === 'string') return faces;
    const all = faces.all ?? 'exterior';
    const arr = Array(6).fill(all);
    const set = (vec, m) => { if (m) arr[faceIndex(vec)] = m; };
    set([0, 1, 0], faces.top);
    set([0, -1, 0], faces.bottom);
    set(frame.n, faces.out);
    set(neg(frame.n), faces.in);
    set(frame.right, faces.right);
    set(neg(frame.right), faces.left);
    return arr.every(m => m === arr[0]) ? arr[0] : arr;
}

/** Axis-aligned box from local ranges u, v, w (w = inward depth; negative = outside). */
function localBox(frame, id, [u0, u1], [v0, v1], [w0, w1], faces) {
    const { origin: o, right: rt, n } = frame;
    const p = (u, v, w) => [
        o[0] + u * rt[0] - w * n[0],
        o[1] + v,
        o[2] + u * rt[2] - w * n[2],
    ];
    const a = p(u0, v0, w0), b = p(u1, v1, w1);
    return {
        id,
        pos: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2],
        size: [Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2])],
        mat: resolveFaces(frame, faces),
    };
}

const WALL_FACES = { all: 'interior_wall', out: 'exterior' };

/** Computes openings (door / small window) on a solid face, in local u/v. */
function faceOpenings(value, S, H, T, cfg) {
    const ops = [];
    const minU = T + 0.05, maxU = S - T - 0.05;
    const place = (offset, w) => {
        let u0 = offset * S - w / 2;
        u0 = Math.min(Math.max(u0, minU), maxU - w);
        return [u0, u0 + w];
    };
    if (value.includes('p')) {
        const d = cfg.door;
        const [u0, u1] = place(d.offset, d.width);
        ops.push({ type: 'door', u0, u1, v0: 0, v1: Math.min(d.height, H - d.min_top_gap) });
    }
    if (value.includes('c')) {
        const sw = cfg.small_window;
        const h = sw.height;
        const v0 = Math.max(0.2, Math.min(sw.sill_height, H - sw.min_top_gap - h));
        const offsets = value.includes('p') ? [sw.offset_with_door, 1 - sw.offset_with_door] : [sw.offset];
        for (const off of offsets) {
            const [u0, u1] = place(off, sw.width);
            const clash = ops.some(o => u0 < o.u1 + 0.1 && u1 > o.u0 - 0.1);
            if (!clash) { ops.push({ type: 'window', u0, u1, v0, v1: v0 + h }); break; }
        }
    }
    return ops.sort((a, b) => a.u0 - b.u0);
}

function getWallExtent(edges, r, c, dir, S, T) {
    let uStart = 0, uEnd = S;
    let isLeftExterior = false;
    let isRightExterior = false;

    const leftDir = LEFT_DIR[dir];
    const rightDir = RIGHT_DIR[dir];
    const leftEdge = getEdge(edges, r, c, leftDir);
    const rightEdge = getEdge(edges, r, c, rightDir);

    const isHorizontal = (dir === 'N' || dir === 'S');

    if (isHorizontal) {
        // Horizontal solid walls run full length at outside corners
        if (leftEdge != null) isLeftExterior = true;
        if (rightEdge != null) isRightExterior = true;
    } else {
        // Vertical solid walls (E, W) butt into horizontal solid walls
        const leftIsSolid = leftEdge != null && leftEdge !== 't' && leftEdge !== 'v';
        const rightIsSolid = rightEdge != null && rightEdge !== 't' && rightEdge !== 'v';

        if (leftIsSolid) {
            uStart = T;
        } else if (leftEdge != null) {
            isLeftExterior = true;
        }

        if (rightIsSolid) {
            uEnd = S - T;
        } else if (rightEdge != null) {
            isRightExterior = true;
        }
    }

    return { uStart, uEnd, isLeftExterior, isRightExterior };
}

function buildSolidWall(prims, frame, id, uStart, uEnd, H, T, ops, wallFaces) {
    let cursor = uStart, i = 0;
    for (const op of ops) {
        if (op.u0 > cursor) prims.push(localBox(frame, `${id}-col${i++}`, [cursor, op.u0], [0, H], [0, T], wallFaces));
        if (op.v0 > 0) prims.push(localBox(frame, `${id}-below${i++}`, [op.u0, op.u1], [0, op.v0], [0, T], wallFaces));
        if (op.v1 < H) prims.push(localBox(frame, `${id}-above${i++}`, [op.u0, op.u1], [op.v1, H], [0, T], wallFaces));
        cursor = Math.max(cursor, op.u1);
    }
    if (cursor < uEnd) prims.push(localBox(frame, `${id}-col${i++}`, [cursor, uEnd], [0, H], [0, T], wallFaces));
}

/** Frame (marco) + glass or door leaf inside an opening. */
function buildOpeningFill(prims, frame, id, op, T, cfg) {
    const { u0, u1, v0, v1 } = op;
    const fw = op.type === 'door' ? cfg.door.frame_width
        : op.type === 'window' ? cfg.small_window.frame_width
            : cfg.ventanal.frame_width;
    const W = [0, T];
    prims.push(localBox(frame, `${id}-fl`, [u0, u0 + fw], [v0, v1], W, 'frame'));
    prims.push(localBox(frame, `${id}-fr`, [u1 - fw, u1], [v0, v1], W, 'frame'));
    prims.push(localBox(frame, `${id}-ft`, [u0 + fw, u1 - fw], [v1 - fw, v1], W, 'frame'));
    if (op.type === 'door') {
        const lt = cfg.door.leaf_thickness;
        prims.push(localBox(frame, `${id}-leaf`, [u0 + fw, u1 - fw], [v0, v1 - fw], [T / 2 - lt / 2, T / 2 + lt / 2], 'door'));
        return;
    }
    prims.push(localBox(frame, `${id}-fb`, [u0 + fw, u1 - fw], [v0, v0 + fw], W, 'frame'));
    const gt = cfg.ventanal.glass_thickness;
    prims.push(localBox(frame, `${id}-glass`, [u0 + fw, u1 - fw], [v0 + fw, v1 - fw], [T / 2 - gt / 2, T / 2 + gt / 2], 'glass'));
}

/**
 * @param {object} layout  output of applyRules (+ cells Set)
 * @param {object} cfg     house_gen.json
 * @param {object} opts    { moduleHeight, wallPanelType }
 */
export function buildGeometry(layout, cells, cfg, { moduleHeight = 2.5, wallPanelType } = {}) {
    const prims = [];
    const { edges } = layout;
    const S = cfg.module.size;
    const H = moduleHeight;
    const P = cfg.module.plinth_height;
    const F = cfg.module.floor_thickness;
    const R = cfg.module.roof_thickness;
    const T = cfg.walls.thickness_by_panel[wallPanelType] ?? cfg.walls.default_thickness;
    const counts = { modules: cells.size, ventanales: 0, terrace_modules: 0, small_windows: 0, doors: 0, terrace_area_m2: 0 };

    for (const k of cells) {
        const [r, c] = parseKey(k);
        const x0 = c * S, z0 = r * S;
        const box = (id, y0, y1, inset, mat) => prims.push({
            id,
            pos: [x0 + S / 2, (y0 + y1) / 2, z0 + S / 2],
            size: [S - 2 * inset, y1 - y0, S - 2 * inset],
            mat,
        });
        // [px, nx, py, ny, pz, nz]
        box(`floor-${k}`, P - F, P, 0, ['exterior', 'exterior', 'interior_floor', 'exterior', 'exterior', 'exterior']);
        box(`roof-${k}`, P + H, P + H + R, 0, ['exterior', 'exterior', 'roof_top', 'interior_wall', 'exterior', 'exterior']);
        if (P - F > 0) box(`plinth-${k}`, 0, P - F, cfg.module.plinth_inset, 'plinth');

        for (const dir of DIR_KEYS) {
            const value = getEdge(edges, r, c, dir);
            const { dr, dc } = DIRS[dir];
            if (value == null || cells.has(key(r + dr, c + dc))) continue;
            const frame = cellFrame(r, c, dir, S, P);
            const id = `wall-${k}-${dir}`;

            if (value === 't' || value === 'v') {
                counts.ventanales++;
                if (value === 't') counts.terrace_modules++;
                const u0 = getEdge(edges, r, c, LEFT_DIR[dir]) != null ? T : 0;
                const u1 = getEdge(edges, r, c, RIGHT_DIR[dir]) != null ? S - T : S;
                buildOpeningFill(prims, frame, id, { type: 'ventanal', u0, u1, v0: 0, v1: H }, T, cfg);
                continue;
            }
            const { uStart, uEnd, isLeftExterior, isRightExterior } = getWallExtent(edges, r, c, dir, S, T);
            const wallFaces = {
                all: 'interior_wall',
                out: 'exterior',
                left: isLeftExterior ? 'exterior' : 'interior_wall',
                right: isRightExterior ? 'exterior' : 'interior_wall',
            };
            const ops = faceOpenings(value, S, H, T, cfg);
            buildSolidWall(prims, frame, id, uStart, uEnd, H, T, ops, wallFaces);
            ops.forEach((op, i) => {
                if (op.type === 'door') counts.doors++;
                else counts.small_windows++;
                buildOpeningFill(prims, frame, `${id}-op${i}`, op, T, cfg);
            });
        }
    }

    // Terraza "tubo": floor, roof and side walls extruded outward along main run (all exterior material)
    const run = layout.mainRun;
    if (run) {
        const tc = cfg.terrace;
        const D = tc.depth, Tt = tc.wall_thickness;
        const rt = R_VEC[run.dir];
        const leftmost = [...run.edges].sort((a, b) =>
            ((a.c + 0.5) * rt[0] + (a.r + 0.5) * rt[2]) - ((b.c + 0.5) * rt[0] + (b.r + 0.5) * rt[2]))[0];
        const frame = cellFrame(leftmost.r, leftmost.c, run.dir, S, P);
        const L = run.length * S;
        const W = [-D, 0];
        prims.push(localBox(frame, 'terrace-floor', [0, L], [-tc.floor_thickness, 0], W, 'exterior'));
        prims.push(localBox(frame, 'terrace-roof', [0, L], [H, H + tc.roof_thickness], W, 'exterior'));
        prims.push(localBox(frame, 'terrace-wall-l', [0, Tt], [0, H], W, 'exterior'));
        prims.push(localBox(frame, 'terrace-wall-r', [L - Tt, L], [0, H], W, 'exterior'));
        counts.terrace_area_m2 = +(L * D).toFixed(2);
    }

    // Bounds (xz) for centring
    const bounds = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity, maxY: 0 };
    for (const p of prims) {
        bounds.minX = Math.min(bounds.minX, p.pos[0] - p.size[0] / 2);
        bounds.maxX = Math.max(bounds.maxX, p.pos[0] + p.size[0] / 2);
        bounds.minZ = Math.min(bounds.minZ, p.pos[2] - p.size[2] / 2);
        bounds.maxZ = Math.max(bounds.maxZ, p.pos[2] + p.size[2] / 2);
        bounds.maxY = Math.max(bounds.maxY, p.pos[1] + p.size[1] / 2);
    }
    if (!prims.length) Object.assign(bounds, { minX: 0, maxX: 0, minZ: 0, maxZ: 0 });
    bounds.center = [(bounds.minX + bounds.maxX) / 2, 0, (bounds.minZ + bounds.maxZ) / 2];

    return { primitives: prims, counts, bounds, wallThickness: T };
}
