import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

// Module size in world units (1 unit = 1 module width/depth)
const MODULE_SIZE = 1.0;

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#c4b5fd'];

const MovingBox = ({ position, startPos, color }) => {
    const meshRef = useRef();
    const [initialPos] = useState(startPos || position);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const target = new Vector3(...position);
            const speed = 5;
            meshRef.current.position.lerp(target, 1 - Math.exp(-speed * delta));
        }
    });

    return (
        <mesh ref={meshRef} position={initialPos}>
            <boxGeometry args={[MODULE_SIZE, MODULE_SIZE, MODULE_SIZE]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export const Scene = ({ grid }) => {
    // Collect all filled cells from the grid
    const modules = useMemo(() => {
        if (!grid) return [];
        const cells = [];
        grid.forEach((rowArr, row) => {
            rowArr.forEach((filled, col) => {
                if (filled) cells.push({ row, col });
            });
        });
        return cells;
    }, [grid]);

    // Compute the centroid of all placed modules so we can center them at the origin
    const center = useMemo(() => {
        if (modules.length === 0) return { x: 0, z: 0 };
        const sumX = modules.reduce((s, m) => s + m.col, 0);
        const sumZ = modules.reduce((s, m) => s + m.row, 0);
        return {
            x: sumX / modules.length,
            z: sumZ / modules.length,
        };
    }, [modules]);

    return (
        <group>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 16, 5]} intensity={2.5} />
            <directionalLight position={[-10, -13, -5]} intensity={1} />

            {modules.map(({ row, col }, i) => {
                // Offset each module so the centroid sits at the world origin (0, 0, 0)
                const x = (col - center.x) * MODULE_SIZE;
                const y = 0;
                const z = (row - center.z) * MODULE_SIZE;

                const color = COLORS[i % COLORS.length];

                return (
                    <MovingBox
                        key={`${row}-${col}`}
                        position={[x, y, z]}
                        color={color}
                    />
                );
            })}
        </group>
    );
};