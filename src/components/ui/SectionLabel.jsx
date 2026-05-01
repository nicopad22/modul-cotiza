import React from 'react';
import { T } from '../../theme';

export const SectionLabel = ({ children, style = {} }) => (
    <div style={{
        fontFamily: T.fontHead,
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: T.onSurfaceVariant,
        marginBottom: '10px',
        ...style,
    }}>
        {children}
    </div>
);
