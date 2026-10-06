import { useMemo, useEffect } from 'react';
import { MeshStandardMaterial, DoubleSide } from 'three';
import { ContactShadows } from '@react-three/drei';
import cfg from '../config/house_gen.json';

/** Material instances built from house_gen.json colors (no hardcoded geometry). */
function useHouseMaterials(colors) {
    const mats = useMemo(() => {
        const std = (color, extra = {}) => new MeshStandardMaterial({ color, roughness: 0.85, ...extra });
        return {
            exterior: std(colors.exterior),
            roof_top: std(colors.roof_top),
            frame: std(colors.frame, { roughness: 0.5 }),
            glass: std(colors.glass, {
                transparent: true,
                opacity: colors.glass_opacity,
                roughness: 0.05,
                metalness: 0.1,
                depthWrite: false,
                side: DoubleSide,
            }),
            interior_wall: std(colors.interior_wall),
            interior_floor: std(colors.interior_floor, { roughness: 0.7 }),
            door: std(colors.door),
            plinth: std(colors.plinth),
        };
    }, [colors]);
    useEffect(() => () => Object.values(mats).forEach(m => m.dispose()), [mats]);
    return mats;
}

/**
 * Renders the procedurally generated house (see src/procgen).
 * `house` = output of generateHouse(); only maps primitives → meshes.
 */
export const Scene = ({ house }) => {
    const mats = useHouseMaterials(cfg.colors);
    const resolve = (m) => (Array.isArray(m) ? m.map(k => mats[k]) : mats[m]);
    const center = house?.bounds?.center ?? [0, 0, 0];

    return (
        <group>
            <ambientLight intensity={0.6} />
            <directionalLight position={[15, 25, 10]} intensity={2.2} />
            <directionalLight position={[-12, 10, -8]} intensity={0.6} />

            <group position={[-center[0], 0, -center[2]]}>
                {house?.primitives.map(p => (
                    <mesh
                        key={p.id}
                        position={p.pos}
                        material={resolve(p.mat)}
                        renderOrder={p.mat === 'glass' ? 1 : 0}
                    >
                        <boxGeometry args={p.size} />
                    </mesh>
                ))}
            </group>

            <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={40} blur={2.2} far={8} />
        </group>
    );
};