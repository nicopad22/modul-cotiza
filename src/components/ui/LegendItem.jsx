import React from 'react';

export default function LegendItem({ color, border, label, dim }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: color, border: `1px solid ${border}`, opacity: dim ? 0.5 : 1, flexShrink: 0 }} />
            <span style={{ fontSize: '0.68rem', color: '#475569' }}>{label}</span>
        </div>
    );
}
