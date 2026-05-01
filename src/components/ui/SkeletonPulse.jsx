import React from 'react';
import { T } from '../../theme';

export const SkeletonPulse = ({ width = '100%', height = '2.1rem' }) => (
    <div style={{
        width,
        height,
        borderRadius: '6px',
        background: `linear-gradient(90deg, ${T.surfaceContHigh} 25%, ${T.surfaceContHighest} 50%, ${T.surfaceContHigh} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
    }} />
);
