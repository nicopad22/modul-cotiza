import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useCallback } from "react";
import { Experience } from "./components/Experience";
import Sidebar from "./components/Sidebar";
import GridEditor from "./components/GridEditor";
import SummaryCard from "./components/ui/SummaryCard";
import AppHeader from "./components/AppHeader";
import { Loader } from "@react-three/drei";
import { useIsMobile } from "./hooks/useIsMobile";
import { T } from "./theme";

const GRID_ROWS = 5;
const GRID_COLS = 5;

// Initial seed position — used only to place the first module and set the first anchor.
// Not enforced as unerasable; the master structure tracks itself via masterAnchor state.
const INIT_ROW = Math.floor(GRID_ROWS / 2);
const INIT_COL = Math.floor(GRID_COLS / 2);

function createInitialGrid() {
    const g = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false));
    g[INIT_ROW][INIT_COL] = true;
    return g;
}

/** Convert the React boolean grid to the string format the API expects. */
function gridToStrings(grid) {
    return grid.map(row => row.map(cell => (cell ? 'X' : '.')).join(''));
}

function App() {
    const [viewMode, setViewMode] = useState('3d');
    const [environment, setEnvironment] = useState('norte');
    const [grid, setGrid] = useState(createInitialGrid);
    const isMobile = useIsMobile();

    // Tracks one cell in the master structure. When that cell is erased,
    // GridEditor transfers it to another master cell before the erase commits.
    // If null, analyzeGrid falls back to first-found component.
    const [masterAnchor, setMasterAnchor] = useState(`${INIT_ROW},${INIT_COL}`);

    // ── Home configuration selections ─────────────────────────────────
    const [selections, setSelections] = useState({
        wallPanelType: 'mgo_sip_122',
        kitchenType: 'standard',
        bathroomType: 'standard',
        bedrooms: 2,
        bathrooms: 1,
        moduleHeight: 2.5,
    });

    // ── Estimate from API ─────────────────────────────────────────────
    const [estimate, setEstimate] = useState(null);
    const [estimateLoading, setEstimateLoading] = useState(false);
    const [quoteLoading, setQuoteLoading] = useState(false);

    const quantity = grid.flat().filter(Boolean).length;

    /** Build the shared API payload from current state. */
    const buildPayload = useCallback(() => ({
        grid: gridToStrings(grid),
        wall_panel_type: selections.wallPanelType,
        kitchen_type: selections.kitchenType,
        bathroom_type: selections.bathroomType,
        bedrooms: selections.bedrooms,
        bathrooms: selections.bathrooms,
        floor_system_type: 'standard',
        roof_system_type: 'standard',
        wall_height_m: selections.moduleHeight,
    }), [grid, selections]);

    /** Download a PDF quote from the API. */
    const handleDownloadPdf = useCallback(async () => {
        if (quoteLoading || quantity === 0) return;
        setQuoteLoading(true);
        try {
            const res = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildPayload()),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cotizacion-modul.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Quote API error:', err.message);
        } finally {
            setQuoteLoading(false);
        }
    }, [quoteLoading, quantity, buildPayload]);

    // Debounced API call whenever grid or selections change
    useEffect(() => {
        // Don't call if grid is empty
        if (quantity === 0) {
            setEstimate(null);
            return;
        }

        setEstimateLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await fetch('/api/estimate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(buildPayload()),
                });
                if (res.ok) {
                    setEstimate(await res.json());
                }
            } catch (err) {
                console.warn('Estimate API unavailable:', err.message);
            } finally {
                setEstimateLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [grid, selections, quantity, buildPayload]);

    const totalSqm = estimate?.geometry?.gross_area_m2 ?? (quantity * 10.89);
    const totalUF = estimate?.totals?.final_total_uf;
    const pricePerM2UF = estimate?.totals?.price_per_m2_uf;
    const ufSource = estimate?.totals?.uf_source ?? 'pendiente';
    const clpTotal = estimate?.totals?.final_total_clp;

    // ── Shared summary card instance ──────────────────────────────────
    const summaryCardEl = (
        <SummaryCard
            placedCount={quantity}
            totalSqm={totalSqm}
            totalUF={totalUF}
            pricePerM2UF={pricePerM2UF}
            ufSource={ufSource}
            clpTotal={clpTotal}
            estimateLoading={estimateLoading}
            estimate={estimate}
        />
    );

    // ── Scene content (3D or 2D grid editor) ──────────────────────────
    const sceneContent = viewMode === '3d' ? (
        <>
            <Canvas shadows camera={{ position: [3, 3, 3], fov: 50 }}>
                <color attach="background" args={["#1a1a1a"]} />
                <Experience grid={grid} environment={environment} moduleHeight={selections.moduleHeight} />
            </Canvas>
            <Loader />
        </>
    ) : (
        <GridEditor
            grid={grid}
            setGrid={setGrid}
            masterAnchor={masterAnchor}
            setMasterAnchor={setMasterAnchor}
        />
    );

    // ── Vista toggle overlay (top-right of scene) ────────────────────
    const vistaToggle = (
        <div style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 10,
            display: 'flex',
            background: 'rgba(10,18,20,0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '10px',
            border: `1px solid rgba(0, 218, 243, 0.18)`,
            padding: '3px',
            gap: '3px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
            {[{ id: '3d', label: '🧊 3D' }, { id: '2d', label: '🗺 Planta' }].map(({ id, label }) => {
                const active = viewMode === id;
                return (
                    <button
                        key={id}
                        onClick={() => setViewMode(id)}
                        style={{
                            padding: '5px 12px',
                            borderRadius: '7px',
                            border: 'none',
                            cursor: 'pointer',
                            background: active ? 'rgba(0, 218, 243, 0.18)' : 'transparent',
                            color: active ? '#00daf3' : 'rgba(255,255,255,0.55)',
                            fontFamily: T.fontHead,
                            fontSize: '0.82rem',
                            fontWeight: active ? 700 : 500,
                            letterSpacing: '0.01em',
                            transition: 'all 0.15s ease',
                            boxShadow: active ? '0 0 10px rgba(0, 218, 243, 0.2)' : 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );

    // ═══════════════════════════════════════════════════════════════════
    //  MOBILE LAYOUT — vertical stack
    // ═══════════════════════════════════════════════════════════════════
    if (isMobile) {
        return (
            <div style={{
                width: '100%',
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: T.bg,
            }}>
                {/* ── Top bar: logo + title + summary ── */}
                <div style={{
                    flexShrink: 0,
                    padding: '14px 16px',
                    borderBottom: `1px solid ${T.outlineVariant}`,
                    background: T.bg,
                }}>
                    {/* Logo row */}
                    <AppHeader
                        quoteLoading={quoteLoading}
                        quantity={quantity}
                        onDownloadPdf={handleDownloadPdf}
                        compact
                    />
                </div>

                {/* ── Scene view ── */}
                <div style={{
                    height: '45vh',
                    flexShrink: 0,
                    position: 'relative',
                    borderBottom: `1px solid ${T.outlineVariant}`,
                }}>
                    {sceneContent}
                    {vistaToggle}
                </div>

                {/* ── Scrollable sidebar controls ── */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: 0,
                    marginTop: "15px"
                }}>
                    {summaryCardEl}
                    <Sidebar
                        quantity={quantity}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        environment={environment}
                        setEnvironment={setEnvironment}
                        selections={selections}
                        setSelections={setSelections}
                        estimate={estimate}
                        estimateLoading={estimateLoading}
                        hideHeader
                        isMobile
                    />
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════
    //  DESKTOP LAYOUT — horizontal split (unchanged)
    // ═══════════════════════════════════════════════════════════════════
    return (
        <div className="w-full h-screen flex flex-row overflow-hidden bg-neutral-900">
            <div className="flex-1 h-full relative">
                {sceneContent}

                {/* ── Vista toggle overlay — top-right of scene ── */}
                {vistaToggle}

                {/* ── Summary overlay — bottom-right of scene ── */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 10,
                    pointerEvents: 'none',
                }}>
                    {summaryCardEl}
                </div>
            </div>
            <Sidebar
                quantity={quantity}
                viewMode={viewMode}
                setViewMode={setViewMode}
                environment={environment}
                setEnvironment={setEnvironment}
                selections={selections}
                setSelections={setSelections}
                estimate={estimate}
                estimateLoading={estimateLoading}
                grid={grid}
                gridToStrings={gridToStrings}
                quoteLoading={quoteLoading}
                onDownloadPdf={handleDownloadPdf}
            />
        </div>
    );
}

export default App;
