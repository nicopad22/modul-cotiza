import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Experience } from "./components/Experience";
import Sidebar from "./components/Sidebar";

function App() {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="w-full h-screen flex flex-row overflow-hidden bg-neutral-900">
            {/* Canvas Container: grows to fill space */}
            <div className="flex-1 h-full relative">
                <Canvas
                    shadows
                    camera={{
                        position: [3, 3, 3],
                        fov: 30,
                    }}
                >
                    <color attach="background" args={["#1a1a1a"]} />
                    <Experience quantity={quantity} />
                </Canvas>
            </div>
            {/* Sidebar: fixed width, no shrink */}
            <Sidebar quantity={quantity} setQuantity={setQuantity} />
        </div>
    );
}

export default App;
