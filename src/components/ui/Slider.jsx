import React from 'react';
import { T } from '../../theme';

export const Slider = ({ label, value, min, max, step, onChange, unit }) => (
    <div style={{
        background: T.surfaceContHigh,
        borderRadius: '8px',
        padding: '12px 14px',
        border: `1px solid ${T.outlineVariant}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
                fontFamily: T.fontHead,
                fontSize: '0.85rem',
                fontWeight: 600,
                color: T.onSurface,
            }}>{label}</span>
            <span style={{
                fontFamily: T.fontHead,
                fontSize: '1.1rem',
                fontWeight: 700,
                color: T.primaryCont,
                fontVariantNumeric: 'tabular-nums',
            }}>{Number(value).toFixed(2)} {unit}</span>
        </div>
        <input 
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: T.surfaceTint }}
        />
    </div>
);
