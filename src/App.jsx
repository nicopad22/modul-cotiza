import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useCallback } from "react";
import { Experience } from "./components/Experience";
import Sidebar from "./components/Sidebar";
import GridEditor from "./components/GridEditor";
import { Loader } from "@react-three/drei";

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
    });

    // ── Estimate from API ─────────────────────────────────────────────
    const [estimate, setEstimate] = useState(null);
    const [estimateLoading, setEstimateLoading] = useState(false);

    const quantity = grid.flat().filter(Boolean).length;

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
                    body: JSON.stringify({
                        grid: gridToStrings(grid),
                        wall_panel_type: selections.wallPanelType,
                        kitchen_type: selections.kitchenType,
                        bathroom_type: selections.bathroomType,
                        bedrooms: selections.bedrooms,
                        bathrooms: selections.bathrooms,
                        floor_system_type: 'standard',
                        roof_system_type: 'standard',
                    }),
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
    }, [grid, selections, quantity]);

    return (
        <div className="w-full h-screen flex flex-row overflow-hidden bg-neutral-900">
            <div className="flex-1 h-full relative">
                {viewMode === '3d' ? (
                    <>
                        <Canvas shadows camera={{ position: [3, 3, 3], fov: 50 }}>
                            <color attach="background" args={["#1a1a1a"]} />
                            <Experience grid={grid} environment={environment} />
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
                )}
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
            />
        </div>
    );
}

export default App;
