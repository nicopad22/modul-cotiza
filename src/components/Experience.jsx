import { OrbitControls, Environment } from "@react-three/drei";
import { Scene } from "./Scene";
import { useState } from "react";

export const Experience = ({ grid, environment, moduleHeight }) => {
    const [autoRotate, setAutoRotate] = useState(false);
    return (
        <>
            <OrbitControls
                enablePan={false}
                autoRotate={autoRotate}
                autoRotateSpeed={1}
                maxDistance={20}
                minDistance={3}
            />
            <Scene grid={grid} moduleHeight={moduleHeight} />
            <Environment files={environment === 'norte' ? "/norte_de_chile.exr" : "/sur_de_chile.exr"} background />
        </>
    );
};
