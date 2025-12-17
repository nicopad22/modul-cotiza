import { OrbitControls, Environment } from "@react-three/drei";
import { Scene } from "./Scene";
import { useState } from "react";

export const Experience = () => {
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
            <Scene />
            <Environment files="/lakes_2k.exr" background />
        </>
    );
};
