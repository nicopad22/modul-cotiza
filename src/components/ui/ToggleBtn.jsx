import React from 'react';
import { T } from '../../theme';

export const ToggleBtn = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        style={{
            flex: 1,
            padding: '11px 0',
            borderRadius: '8px',
            border: active ? `1px solid ${T.surfaceTint}` : '1px solid transparent',
            cursor: 'pointer',
            fontFamily: T.fontHead,
            fontSize: '0.92rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
            background: active
                ? `rgba(0, 218, 243, 0.15)`
                : 'transparent',
            color: active ? T.primaryCont : T.onSurfaceVariant,
            boxShadow: active
                ? '0 0 12px rgba(0, 229, 255, 0.25)'
                : 'none',
        }}
    >
        {children}
    </button>
);
