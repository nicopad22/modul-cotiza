import React from 'react';
import { T } from '../../theme';
import { ToggleBtn } from './ToggleBtn';

export const SegmentedSelector = ({ options, value, onChange }) => (
    <div style={{
        background: T.surfaceCont,
        borderRadius: '10px',
        padding: '4px',
        display: 'flex',
        gap: '4px',
        border: `1px solid ${T.outlineVariant}`,
    }}>
        {options.map(opt => (
            <ToggleBtn
                key={opt.value}
                active={value === opt.value}
                onClick={() => onChange(opt.value)}
            >
                {opt.label}
            </ToggleBtn>
        ))}
    </div>
);
