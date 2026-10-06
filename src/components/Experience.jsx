import { OrbitControls, Environment, useEnvironment } from "@react-three/drei";
import { Scene } from "./Scene";
import { useState } from "react";

// Preload environments immediately for fast switching and zero-delay initialization
useEnvironment.preload({ files: "/norte_de_chile.hdr" });
useEnvironment.preload({ files: "/sur_de_chile.hdr" });

// World units = meters (module = 3.3 m)
export const Experience = ({ house, environment }) => {
    const [autoRotate, setAutoRotate] = useState(false);
    return (
        <>
            <OrbitControls
                enablePan={false}
                autoRotate={autoRotate}
                autoRotateSpeed={1}
                maxDistance={50}
                minDistance={6}
                maxPolarAngle={Math.PI / 2 - 0.05}
                target={[0, 1.5, 0]}
            />
            <Scene house={house} />
            <Environment files={environment === 'norte' ? "/norte_de_chile.hdr" : "/sur_de_chile.hdr"} background />
        </>
    );
};
