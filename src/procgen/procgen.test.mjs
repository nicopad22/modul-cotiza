// Run: node src/procgen/procgen.test.mjs   (no dependencies)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generateHouse } from './index.js';
import { getEdge, DIRS, DIR_KEYS, OPPOSITE, parseKey, key } from './edges.js';
import { isIndependent } from './independentSet.js';
import { mulberry32 } from './random.js';

const cfg = JSON.parse(readFileSync(new URL('../config/house_gen.json', import.meta.url)));
const G = (rows) => rows.map(r => [...r].map(ch => ch === 'X'));
const gen = (rows, opts = {}) => generateHouse({ grid: G(rows), bathrooms: 1, ...opts }, cfg);
const E = (h, r, c, d) => getEdge(h.edges, r, c, d);

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('✓', name); };

test('1x1: terraza N, puerta S, baño comparte cara con puerta', () => {
    const h = gen(['X']);
    assert.equal(E(h, 0, 0, 'N'), 't');
    assert.equal(E(h, 0, 0, 'S'), 'pc');
    assert.equal(E(h, 0, 0, 'E'), 'w');
    assert.equal(h.maxBathrooms, 1);
});

test('1x3 fila: tramo completo t, puerta centrada, máx 2 baños en extremos', () => {
    const h = gen(['XXX'], { bathrooms: 3 });
    for (let c = 0; c < 3; c++) assert.equal(E(h, 0, c, 'N'), 't');
    assert.ok(E(h, 0, 1, 'S').includes('p'));
    assert.equal(h.maxBathrooms, 2);
    assert.deepEqual(h.bathroomCells, ['0,0', '0,2']);
    assert.equal(E(h, 0, 0, 'S'), 'c');
    assert.equal(E(h, 0, 2, 'S'), 'c');
    assert.equal(h.counts.terrace_modules, 3);
    assert.equal(h.counts.terrace_area_m2, 9.9);
});

test('orientación cambia frente', () => {
    const h = gen(['XXX'], { orientation: 'E', bathrooms: 0 });
    assert.equal(E(h, 0, 2, 'E'), 't');
    assert.ok(E(h, 0, 0, 'W').includes('p'));
    assert.equal(E(h, 0, 0, 'N'), 'w');
});

test('L: tramo principal t, secundario v', () => {
    const h = gen(['X.', 'XX']);
    assert.equal(E(h, 0, 0, 'N'), 't');
    assert.equal(E(h, 1, 1, 'N'), 'v');
    assert.equal(h.counts.terrace_modules, 1);
    assert.equal(h.counts.ventanales, 2);
});

test('frente principal = tramo más largo', () => {
    const h = gen(['X...', 'XXXX']);
    assert.equal(E(h, 0, 0, 'N'), 'v');
    for (let c = 1; c < 4; c++) assert.equal(E(h, 1, c, 'N'), 't');
});

test('estructuras desconectadas se ignoran', () => {
    const h = gen(['XX...', '....X'], { masterAnchor: '0,0' });
    assert.equal(h.cells.size, 2);
    assert.equal(E(h, 1, 4, 'N'), null);
    assert.ok(h.primitives.every(p => p.pos[0] < 2 * cfg.module.size + 0.01));
});

test('determinismo por semilla', () => {
    const a = gen(['XXX', 'XXX', 'XXX'], { bathrooms: 3 });
    const b = gen(['XXX', 'XXX', 'XXX'], { bathrooms: 3 });
    assert.deepEqual(a.bathroomCells, b.bathroomCells);
    assert.deepEqual(a.edges, b.edges);
});

test('grosor muro según panel', () => {
    assert.equal(gen(['X'], { wallPanelType: 'mgo_sip_152' }).wallThickness, 0.152);
    assert.equal(gen(['X'], { wallPanelType: 'mgo_sip_122' }).wallThickness, 0.122);
});

// ── Property tests on random connected shapes ─────────────────────────
function bruteMIS(cells) {
    const arr = [...cells];
    let best = 0;
    for (let m = 0; m < 1 << arr.length; m++) {
        const pick = arr.filter((_, i) => m & (1 << i));
        if (pick.length > best && isIndependent(pick)) best = pick.length;
    }
    return best;
}

test('propiedades en 300 formas aleatorias', () => {
    const rand = mulberry32(42);
    for (let iter = 0; iter < 300; iter++) {
        const rows = 4, cols = 4;
        const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
        let r = 1, c = 1; grid[r][c] = true;
        const steps = 1 + Math.floor(rand() * 11);
        for (let s = 0; s < steps; s++) {
            const d = DIRS[DIR_KEYS[Math.floor(rand() * 4)]];
            r = Math.min(rows - 1, Math.max(0, r + d.dr));
            c = Math.min(cols - 1, Math.max(0, c + d.dc));
            grid[r][c] = true;
        }
        const orientation = DIR_KEYS[iter % 4];
        const bathrooms = 1 + Math.floor(rand() * 5);
        const h = generateHouse({ grid, orientation, bathrooms, moduleHeight: 2 + rand() * 2, wallPanelType: 'mgo_sip_122' }, cfg);
        const back = OPPOSITE[orientation];
        let doors = 0, cs = 0;
        const eligible = [];
        for (const k of h.cells) {
            const [rr, cc] = parseKey(k);
            const ext = d => !h.cells.has(key(rr + DIRS[d].dr, cc + DIRS[d].dc));
            for (const d of DIR_KEYS) {
                const v = E(h, rr, cc, d);
                if (!ext(d)) { assert.equal(v, null); continue; }
                if (d === orientation) assert.ok(v === 't' || v === 'v', `front ${v}`);
                if (v.includes('p')) { doors++; assert.equal(d, back); }
                if (v.includes('c')) {
                    cs++;
                    assert.notEqual(d, orientation);
                    if (ext(orientation)) assert.equal(d, back);
                }
            }
            const can = ext(orientation) ? ext(back) : DIR_KEYS.some(d => d !== orientation && ext(d));
            if (can) eligible.push(k);
        }
        assert.equal(doors, 1);
        assert.equal(h.maxBathrooms, bruteMIS(eligible));
        assert.equal(cs, Math.min(bathrooms, h.maxBathrooms));
        assert.ok(isIndependent(h.bathroomCells));
        for (const p of h.primitives) {
            assert.ok(p.size.every(s => s > 0 && Number.isFinite(s)), `bad size ${p.id}`);
            assert.ok(p.pos.every(Number.isFinite), `bad pos ${p.id}`);
        }
        assert.equal(new Set(h.primitives.map(p => p.id)).size, h.primitives.length, 'ids únicos');
    }
});

console.log(`\n${n} tests OK`);
