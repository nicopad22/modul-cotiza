import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

const MovingBox = ({ position, startPos, color }) => {
    const meshRef = useRef();
    // Initialize state with startPos if provided, otherwise target position
    // This allows new boxes to spawn at a specific location (e.g. previous edge)
    const [initialPos] = useState(startPos || position);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const target = new Vector3(...position);
            // Smoothly interpolate current position to target
            // Using a standard lerp formula with delta for frame-independence
            const speed = 5;
            meshRef.current.position.lerp(target, 1 - Math.exp(-speed * delta));
        }
    });

    return (
        <mesh ref={meshRef} position={initialPos}>
            <boxGeometry />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export const Scene = ({ quantity = 1 }) => {
    // Array of colors to cycle through
    const colors = ["orange", "gray", "lightblue", "lightgreen", "pink"];

    return (
        <group>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 16, 5]} intensity={2.5} />
            <directionalLight position={[-10, -13, -5]} intensity={1} />

            {Array.from({ length: quantity }).map((_, i) => {
                const xPos = (i - (quantity - 1) / 2) * 1.0;

                let spawnPos = null;
                if (i === quantity - 1 && quantity > 1) {
                    const prevRightmost = ((quantity - 2) / 2) * 1.0;
                    spawnPos = [prevRightmost + 1.0, 0, 0];
                }

                return (
                    <MovingBox
                        key={i}
                        position={[xPos, 0, 0]}
                        startPos={spawnPos}
                        color={colors[i % colors.length]}
                    />
                );
            })}
        </group>
    );
};