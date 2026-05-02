import React from 'react';
import { T } from '../../theme';

export const MetricCard = ({ label, value, unit }) => (
    <div style={{
        flex: 1,
        background: T.surfaceContHigh,
        borderRadius: '8px',
        padding: '10px 12px',
        border: `1px solid ${T.outlineVariant}`,
    }}>
        <div style={{
            fontFamily: T.fontBody,
            fontSize: '0.68rem',
            fontWeight: 600,
            color: T.onSurfaceVariant,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '8px',
        }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', padding: '0px, 2px' }}>
            <span style={{
                fontFamily: T.fontHead,
                fontSize: '1.6rem',
                fontWeight: 700,
                color: T.primaryCont,
                textShadow: '0 0 16px rgba(0, 229, 255, 0.35)',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
            }}>{value}</span>
            <span style={{
                fontFamily: T.fontHead,
                fontSize: '1rem',
                color: T.primaryCont,
                marginTop: '5px',
            }}>{unit}</span>
        </div>

    </div>
);
