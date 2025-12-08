import { OrbitControls } from "@react-three/drei";

export const Experience = () => {
    return (
        <>
            <OrbitControls />
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
        </>
    );
};
