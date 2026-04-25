import { Canvas } from "@react-three/fiber";
import { useState } from "react";
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

function App() {
    const [viewMode, setViewMode] = useState('3d');
    const [environment, setEnvironment] = useState('norte');
    const [grid, setGrid] = useState(createInitialGrid);

    // Tracks one cell in the master structure. When that cell is erased,
    // GridEditor transfers it to another master cell before the erase commits.
    // If null, analyzeGrid falls back to first-found component.
    const [masterAnchor, setMasterAnchor] = useState(`${INIT_ROW},${INIT_COL}`);

    const quantity = grid.flat().filter(Boolean).length;

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
            <Sidebar quantity={quantity} viewMode={viewMode} setViewMode={setViewMode} environment={environment} setEnvironment={setEnvironment} />
        </div>
    );
}

export default App;
