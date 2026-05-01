import { useState, useRef, useCallback, useMemo } from 'react';
import { analyzeGrid } from '../utils/gridStructures';
import DisconnectedWarning from './ui/DisconnectedWarning';
import LegendItem from './ui/LegendItem';

const ORTHO_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#c4b5fd'];
const cellColor = (row, col, cols) => ORTHO_COLORS[(row * cols + col) % ORTHO_COLORS.length];

const CSS = `
@keyframes warnPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.35), 0 8px 32px rgba(239,68,68,0.15); }
  50%      { box-shadow: 0 0 0 5px rgba(239,68,68,0), 0 8px 40px rgba(239,68,68,0.28); }
}
@keyframes slideUp {
  from { transform: translateY(24px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}`;

export default function GridEditor({ grid, setGrid, masterAnchor, setMasterAnchor }) {
    const dragAction = useRef(null);
    const [hoveredCell, setHoveredCell] = useState(null);

    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;

    const { disconnected, cellStructure, masterCells, validCells } = useMemo(
        () => analyzeGrid(grid, masterAnchor),
        [grid, masterAnchor]
    );

    // No cell is unerasable — but we do transfer the master anchor before erasing it
    // so the master structure identity is preserved across the erase.

    const toggleCell = useCallback((row, col, action) => {
        setGrid(prev => {
            const next = prev.map(r => [...r]);
            if (action === 'place') next[row][col] = true;
            else next[row][col] = false;
            return next;
        });
    }, [setGrid]);

    const canInteract = (row, col) => {
        const filled = grid[row][col];
        return filled ? true : validCells.has(`${row},${col}`);
    };

    const doErase = useCallback((row, col) => {
        const key = `${row},${col}`;
        // Transfer anchor before removing it so master structure stays identified
        if (key === masterAnchor) {
            const newAnchor = [...masterCells].find(k => k !== key) ?? null;
            setMasterAnchor(newAnchor);
        }
        setGrid(prev => {
            const next = prev.map(r => [...r]);
            next[row][col] = false;
            return next;
        });
    }, [masterAnchor, masterCells, setMasterAnchor, setGrid]);

    const handleMouseDown = (row, col, e) => {
        e.preventDefault();
        if (!canInteract(row, col)) return;
        if (grid[row][col]) {
            dragAction.current = 'erase';
            doErase(row, col);
        } else {
            dragAction.current = 'place';
            toggleCell(row, col, 'place');
        }
    };

    const handleMouseEnter = (row, col) => {
        setHoveredCell({ row, col });
        if (!dragAction.current) return;
        const filled = grid[row][col];
        if (dragAction.current === 'place' && !validCells.has(`${row},${col}`)) return;
        if (dragAction.current === 'erase' && !filled) return;
        if (dragAction.current === 'erase') doErase(row, col);
        else toggleCell(row, col, 'place');
    };

    const handleMouseUp = () => { dragAction.current = null; };

    const deleteStructure = useCallback((cellSet) => {
        setGrid(prev => {
            const next = prev.map(r => [...r]);
            for (const key of cellSet) {
                const [r, c] = key.split(',').map(Number);
                next[r][c] = false;
            }
            return next;
        });
    }, [setGrid]);

    const handleLimpiar = () => {
        setMasterAnchor(null); // analyzeGrid falls back to first-found component
        setGrid(Array.from({ length: rows }, () => Array(cols).fill(false)));
    };

    const placedCount = grid.flat().filter(Boolean).length;

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center select-none"
            style={{ position: 'relative', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f172a 100%)' }}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <style>{CSS}</style>

            {/* Header */}
            <div className="mb-5 text-center">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
                    Planta 2D
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0 0' }}>
                    Haz clic o arrastra para colocar módulos
                </p>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '3px',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: disconnected.length > 0
                    ? '1px solid rgba(239,68,68,0.35)'
                    : '1px solid rgba(99,102,241,0.2)',
                boxShadow: disconnected.length > 0
                    ? '0 0 40px rgba(239,68,68,0.07), inset 0 0 40px rgba(0,0,0,0.3)'
                    : '0 0 40px rgba(99,102,241,0.08), inset 0 0 40px rgba(0,0,0,0.3)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                width: 'min(55vh, 500px)',
                height: 'min(55vh, 500px)',
            }}>
                {grid.map((rowArr, row) =>
                    rowArr.map((filled, col) => {
                        const key = `${row},${col}`;
                        const structType = cellStructure.get(key); // 'master' | 'disconnected' | undefined
                        const isDisconnected = structType === 'disconnected';
                        const isInvalid = !filled && !validCells.has(key);
                        const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;

                        let bg, border, boxShadow, cursor, opacity, transform;

                        if (filled) {
                            const color = isDisconnected
                                ? '#ef4444'
                                : cellColor(row, col, cols);
                            bg = isDisconnected
                                ? `linear-gradient(135deg, #ef4444cc, #dc262688)`
                                : `linear-gradient(135deg, ${color}cc, ${color}88)`;
                            border = isDisconnected
                                ? `1px solid #ef444499`
                                : `1px solid ${color}99`;
                            boxShadow = isDisconnected
                                ? `0 2px 12px #ef444455, inset 0 1px 0 rgba(255,255,255,0.15)`
                                : `0 2px 12px ${color}55, inset 0 1px 0 rgba(255,255,255,0.15)`;
                            cursor = 'pointer';
                            opacity = 1;
                            transform = isHovered ? 'scale(0.92)' : 'scale(1)';
                        } else if (isInvalid) {
                            bg = 'rgba(255,255,255,0.015)';
                            border = '1px solid rgba(255,255,255,0.03)';
                            boxShadow = 'none';
                            cursor = 'not-allowed';
                            opacity = 0.35;
                            transform = 'scale(1)';
                        } else {
                            bg = isHovered ? 'rgba(99,102,241,0.22)' : 'rgba(255,255,255,0.055)';
                            border = isHovered ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(99,102,241,0.15)';
                            boxShadow = isHovered ? '0 0 12px rgba(99,102,241,0.2)' : 'none';
                            cursor = 'pointer';
                            opacity = 1;
                            transform = 'scale(1)';
                        }

                        return (
                            <div
                                key={key}
                                onMouseDown={e => handleMouseDown(row, col, e)}
                                onMouseEnter={() => handleMouseEnter(row, col)}
                                title={
                                    filled
                                        ? `Módulo [${col+1},${row+1}] — clic para quitar`
                                        : isInvalid
                                            ? `Celda no conectada`
                                            : `[${col+1},${row+1}] — clic para colocar`
                                }
                                style={{
                                    borderRadius: '5px', cursor, opacity, transform,
                                    transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s, opacity 0.2s, border-color 0.15s',
                                    position: 'relative', overflow: 'hidden',
                                    background: bg, border, boxShadow,
                                }}
                            >
                                {filled && (
                                    <>
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)', borderRadius: '4px' }} />
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none">
                                                <rect x="3" y="8" width="18" height="12" rx="2" fill="rgba(255,255,255,0.25)" />
                                                <rect x="7" y="4" width="10" height="6" rx="1.5" fill="rgba(255,255,255,0.18)" />
                                                <line x1="3" y1="12" x2="21" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                                            </svg>
                                        </div>
                                    </>
                                )}
                                {!filled && !isInvalid && isHovered && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', borderRadius: '4px' }} />
                                )}
                                {isInvalid && (
                                    <svg width="100%" height="100%" viewBox="0 0 10 10" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
                                        <line x1="2" y1="2" x2="8" y2="8" stroke="#475569" strokeWidth="0.8" strokeLinecap="round" />
                                        <line x1="8" y1="2" x2="2" y2="8" stroke="#475569" strokeWidth="0.8" strokeLinecap="round" />
                                    </svg>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '999px', padding: '6px 18px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 8px #6366f188' }} />
                    <span style={{ fontSize: '0.9rem', color: '#a5b4fc', fontWeight: 600 }}>
                        {placedCount} {placedCount === 1 ? 'módulo' : 'módulos'}
                    </span>
                </div>
                {placedCount > 1 && (
                    <button onClick={handleLimpiar} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', padding: '6px 14px', color: '#fca5a5', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                    >Limpiar</button>
                )}
            </div>

            {/* Legend */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <LegendItem color="rgba(99,102,241,0.5)" border="rgba(99,102,241,0.3)" label="Disponible" />
                <LegendItem color="rgba(239,68,68,0.6)" border="rgba(239,68,68,0.4)" label="Estructura separada" />
                <LegendItem color="rgba(255,255,255,0.015)" border="rgba(255,255,255,0.04)" label="No conectado" dim />
                <div style={{ color: '#334155', fontSize: '0.7rem' }}>{cols} × {rows}</div>
            </div>

            {/* Disconnected structure warnings — absolute overlay at bottom */}
            {disconnected.length > 0 && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
                    {disconnected.map((comp, i) => (
                        <DisconnectedWarning
                            key={i}
                            index={disconnected.length > 1 ? i + 1 : null}
                            cellCount={comp.size}
                            onDelete={() => deleteStructure(comp)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

