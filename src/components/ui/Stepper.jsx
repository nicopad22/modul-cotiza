import React from 'react';
import { T } from '../../theme';

export const Stepper = ({ label, value, min = 1, max = 10, onChange }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: T.surfaceContHigh,
        borderRadius: '8px',
        padding: '10px 14px',
        border: `1px solid ${T.outlineVariant}`,
    }}>
        <span style={{
            fontFamily: T.fontHead,
            fontSize: '0.85rem',
            fontWeight: 600,
            color: T.onSurface,
        }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: `1px solid ${T.outlineVariant}`,
                    background: value <= min ? T.surfaceCont : T.surfaceContLow,
                    color: value <= min ? T.outlineVariant : T.primaryCont,
                    cursor: value <= min ? 'not-allowed' : 'pointer',
                    fontFamily: T.fontHead,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                }}
            >−</button>
            <span style={{
                fontFamily: T.fontHead,
                fontSize: '1.3rem',
                fontWeight: 700,
                color: T.primaryCont,
                minWidth: '28px',
                textAlign: 'center',
                fontVariantNumeric: 'tabular-nums',
            }}>{value}</span>
            <button
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: `1px solid ${T.outlineVariant}`,
                    background: value >= max ? T.surfaceCont : T.surfaceContLow,
                    color: value >= max ? T.outlineVariant : T.primaryCont,
                    cursor: value >= max ? 'not-allowed' : 'pointer',
                    fontFamily: T.fontHead,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                }}
            >+</button>
        </div>
    </div>
);
