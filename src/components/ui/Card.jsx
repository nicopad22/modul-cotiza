import React from 'react';
import { T } from '../../theme';

export const Card = ({ children, style = {} }) => (
    <div style={{
        background: T.surfaceContLow,
        borderRadius: '12px',
        border: `1px solid ${T.outlineVariant}`,
        padding: '16px',
        marginBottom: '12px',
        ...style,
    }}>
        {children}
    </div>
);
