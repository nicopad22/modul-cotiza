export const Scene = () => {
    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 16, 5]} intensity={2.5} />
            <directionalLight position={[-10, -16, -5]} intensity={1} />
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>
            <mesh position={[1.1, 0, 0]}>
                <boxGeometry />
                <meshStandardMaterial color="gray" />
            </mesh>
        </>
    );
};