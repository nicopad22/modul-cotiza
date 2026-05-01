import React from 'react';
import { T } from '../../theme';

export const MetricCard = ({ label, value, unit }) => (
    <div style={{
        flex: 1,
        background: T.surfaceContHigh,
        borderRadius: '8px',
        padding: '14px 14px',
        border: `1px solid ${T.outlineVariant}`,
    }}>
        <div style={{
            fontFamily: T.fontHead,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: T.onSurfaceVariant,
            marginBottom: '8px',
        }}>{label}</div>
        <div style={{
            fontFamily: T.fontHead,
            fontSize: '1.65rem',
            fontWeight: 700,
            color: T.primaryCont,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        }}>{value}</div>
        <div style={{
            fontFamily: T.fontBody,
            fontSize: '0.78rem',
            color: T.outline,
            marginTop: '5px',
        }}>{unit}</div>
    </div>
);
